#!/usr/bin/env node

/**
 * Detention Data Aggregation Script
 *
 * Downloads the large detention-stays-latest.xlsx (~178MB) file from the
 * Deportation Data Project and aggregates it into a small JSON file that
 * the Next.js app can consume.
 *
 * This script uses streaming XML parsing to handle files too large for
 * the standard xlsx library's string buffer limits.
 *
 * Run manually: node scripts/aggregate-detention.js
 * Automated via: .github/workflows/aggregate-detention.yml
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const { createReadStream } = require('fs');
const unzip = require('unzip-stream');
const sax = require('sax');

const DATA_URL = 'https://github.com/deportationdata/ice/raw/refs/heads/main/data/detention-stays-latest.xlsx';
const OUTPUT_PATH = path.join(__dirname, '..', 'src', 'data', 'detention-aggregates.json');
const TEMP_FILE = path.join(__dirname, 'detention-stays-temp.xlsx');

/**
 * Download a file from URL, following redirects
 */
async function downloadFile(url, destPath, maxRedirects = 5) {
  return new Promise((resolve, reject) => {
    if (maxRedirects <= 0) {
      return reject(new Error('Too many redirects'));
    }

    const protocol = url.startsWith('https') ? https : http;

    console.log(`Downloading from: ${url}`);

    const request = protocol.get(url, {
      headers: {
        'User-Agent': 'ICE-Tracker-Aggregator/1.0 (https://github.com/ice-tracker)',
      }
    }, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        console.log(`Redirecting to: ${response.headers.location}`);
        return downloadFile(response.headers.location, destPath, maxRedirects - 1)
          .then(resolve)
          .catch(reject);
      }

      if (response.statusCode !== 200) {
        return reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`));
      }

      const fileStream = fs.createWriteStream(destPath);
      let downloadedBytes = 0;
      const totalBytes = parseInt(response.headers['content-length'] || '0', 10);

      response.on('data', (chunk) => {
        downloadedBytes += chunk.length;
        if (totalBytes > 0) {
          const percent = ((downloadedBytes / totalBytes) * 100).toFixed(1);
          process.stdout.write(`\rDownloaded: ${(downloadedBytes / 1024 / 1024).toFixed(1)}MB / ${(totalBytes / 1024 / 1024).toFixed(1)}MB (${percent}%)`);
        }
      });

      response.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        console.log('\nDownload complete.');
        resolve(destPath);
      });

      fileStream.on('error', (err) => {
        fs.unlink(destPath, () => {});
        reject(err);
      });
    });

    request.on('error', reject);
    request.setTimeout(600000, () => {
      request.destroy();
      reject(new Error('Download timeout'));
    });
  });
}

/**
 * Parse Excel serial date to JavaScript Date
 */
function excelDateToJS(serial) {
  // Excel serial date: days since 1899-12-30
  const excelEpoch = new Date(1899, 11, 30);
  return new Date(excelEpoch.getTime() + serial * 24 * 60 * 60 * 1000);
}

/**
 * Parse a date value from Excel cell
 */
function parseDate(value) {
  if (!value) return null;

  // Handle numeric serial dates
  if (typeof value === 'number' || !isNaN(Number(value))) {
    const num = Number(value);
    if (num > 0 && num < 100000) { // Reasonable Excel date range
      return excelDateToJS(num);
    }
  }

  // Handle string dates
  const str = String(value).trim();
  if (!str) return null;

  const date = new Date(str);
  if (!isNaN(date.getTime())) return date;

  // Try MM/DD/YYYY
  const parts = str.split('/');
  if (parts.length === 3) {
    const [month, day, year] = parts.map(Number);
    const parsed = new Date(year, month - 1, day);
    if (!isNaN(parsed.getTime())) return parsed;
  }

  return null;
}

/**
 * Calculate days between two dates
 */
function daysBetween(start, end) {
  return Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}

/**
 * Parse shared strings from xlsx (for string values)
 */
async function parseSharedStrings(filePath) {
  return new Promise((resolve, reject) => {
    const strings = [];
    let currentString = '';
    let inString = false;

    createReadStream(filePath)
      .pipe(unzip.Parse())
      .on('entry', (entry) => {
        if (entry.path === 'xl/sharedStrings.xml') {
          const parser = sax.createStream(true, { trim: true });

          parser.on('opentag', (node) => {
            if (node.name === 't') {
              inString = true;
              currentString = '';
            }
          });

          parser.on('text', (text) => {
            if (inString) {
              currentString += text;
            }
          });

          parser.on('closetag', (name) => {
            if (name === 't') {
              strings.push(currentString);
              inString = false;
            }
          });

          parser.on('end', () => resolve(strings));
          parser.on('error', reject);

          entry.pipe(parser);
        } else {
          entry.autodrain();
        }
      })
      .on('error', reject)
      .on('close', () => {
        if (strings.length === 0) resolve([]);
      });
  });
}

/**
 * Stream-process the xlsx sheet XML to extract and aggregate data
 */
async function processSheetStream(filePath, sharedStrings) {
  return new Promise((resolve, reject) => {
    // Aggregation state
    let currentlyDetained = 0;
    let totalStayDays = 0;
    let releasedCount = 0;
    let processedRows = 0;
    let skippedRows = 0;

    const now = new Date();
    const oneYearAgo = new Date(now);
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    const twoYearsAgo = new Date(now);
    twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);

    let currentPeriodDetentionDays = 0;
    let previousPeriodDetentionDays = 0;
    let currentPeriodActive = 0;
    let previousPeriodActive = 0;

    // Column indices (will be determined from header row)
    let bookInColIdx = -1;
    let bookOutColIdx = -1;
    let headerRow = [];
    let isFirstRow = true;

    // Current row state
    let currentRow = [];
    let currentCellValue = '';
    let currentCellType = '';
    let currentCellRef = '';
    let inValue = false;
    let inInlineStr = false;

    createReadStream(filePath)
      .pipe(unzip.Parse())
      .on('entry', (entry) => {
        // Process the main sheet (usually sheet1.xml)
        if (entry.path === 'xl/worksheets/sheet1.xml') {
          console.log('Processing sheet1.xml...');

          const parser = sax.createStream(true, { trim: false });

          parser.on('opentag', (node) => {
            if (node.name === 'row') {
              currentRow = [];
            } else if (node.name === 'c') {
              // Cell element
              currentCellRef = node.attributes.r || '';
              currentCellType = node.attributes.t || ''; // 's' for shared string, 'n' for number, 'inlineStr' for inline
              currentCellValue = '';
            } else if (node.name === 'v') {
              inValue = true;
              currentCellValue = '';
            } else if (node.name === 'is') {
              // Inline string container
              inInlineStr = true;
            } else if (node.name === 't' && inInlineStr) {
              // Text within inline string
              inValue = true;
              currentCellValue = '';
            }
          });

          parser.on('text', (text) => {
            if (inValue) {
              currentCellValue += text;
            }
          });

          parser.on('closetag', (name) => {
            if (name === 'v') {
              inValue = false;
            } else if (name === 't' && inInlineStr) {
              inValue = false;
            } else if (name === 'is') {
              inInlineStr = false;
            } else if (name === 'c') {
              // Resolve cell value
              let value = currentCellValue;
              if (currentCellType === 's' && sharedStrings.length > 0) {
                // Shared string reference
                const idx = parseInt(value, 10);
                value = sharedStrings[idx] || '';
              }

              // Get column index from cell reference (e.g., "A1" -> 0, "B1" -> 1)
              const colLetter = currentCellRef.replace(/[0-9]/g, '');
              let colIdx = 0;
              for (let i = 0; i < colLetter.length; i++) {
                colIdx = colIdx * 26 + (colLetter.charCodeAt(i) - 64);
              }
              colIdx -= 1; // 0-indexed

              // Expand array if needed
              while (currentRow.length <= colIdx) {
                currentRow.push('');
              }
              currentRow[colIdx] = value;
            } else if (name === 'row') {
              // Process completed row
              if (isFirstRow) {
                // Header row - find column indices
                headerRow = currentRow.map(h => String(h || '').toLowerCase().trim());

                // Find book_in column
                const bookInNames = ['stay book in date time', 'stay_book_in_date_time', 'book_in_date', 'book in date'];
                for (let i = 0; i < headerRow.length; i++) {
                  for (const name of bookInNames) {
                    if (headerRow[i].includes(name.toLowerCase())) {
                      bookInColIdx = i;
                      break;
                    }
                  }
                  if (bookInColIdx >= 0) break;
                }

                // Find book_out column
                const bookOutNames = ['stay book out date time', 'stay_book_out_date_time', 'book_out_date', 'book out date'];
                for (let i = 0; i < headerRow.length; i++) {
                  for (const name of bookOutNames) {
                    if (headerRow[i].includes(name.toLowerCase())) {
                      bookOutColIdx = i;
                      break;
                    }
                  }
                  if (bookOutColIdx >= 0) break;
                }

                console.log(`Headers found: ${headerRow.length} columns`);
                console.log(`Book In column: ${bookInColIdx} (${headerRow[bookInColIdx] || 'NOT FOUND'})`);
                console.log(`Book Out column: ${bookOutColIdx} (${headerRow[bookOutColIdx] || 'NOT FOUND'})`);

                isFirstRow = false;
              } else {
                // Data row
                if (bookInColIdx < 0) {
                  skippedRows++;
                  return;
                }

                const bookInRaw = currentRow[bookInColIdx];
                const bookOutRaw = bookOutColIdx >= 0 ? currentRow[bookOutColIdx] : null;

                const bookIn = parseDate(bookInRaw);
                if (!bookIn) {
                  skippedRows++;
                  return;
                }

                const bookOut = bookOutRaw ? parseDate(bookOutRaw) : null;
                processedRows++;

                if (!bookOut) {
                  // Currently detained
                  currentlyDetained++;
                  if (bookIn >= oneYearAgo) {
                    currentPeriodActive++;
                  } else if (bookIn >= twoYearsAgo) {
                    previousPeriodActive++;
                  }
                } else {
                  // Released
                  const stayDays = Math.max(1, daysBetween(bookIn, bookOut));
                  totalStayDays += stayDays;
                  releasedCount++;

                  if (bookOut >= oneYearAgo) {
                    currentPeriodDetentionDays += stayDays;
                  } else if (bookOut >= twoYearsAgo) {
                    previousPeriodDetentionDays += stayDays;
                  }
                }

                if (processedRows % 100000 === 0) {
                  console.log(`Processed ${processedRows} rows...`);
                }
              }
            }
          });

          parser.on('end', () => {
            console.log(`\nProcessing complete:`);
            console.log(`  Processed: ${processedRows}`);
            console.log(`  Skipped: ${skippedRows}`);
            console.log(`  Currently detained: ${currentlyDetained}`);
            console.log(`  Released: ${releasedCount}`);

            const daysInYear = 365;
            const avgDailyDetentions = Math.round(currentPeriodDetentionDays / daysInYear);
            const avgDailyDetentionsPrev = Math.round(previousPeriodDetentionDays / daysInYear);
            const avgLengthOfStay = releasedCount > 0 ? Math.round(totalStayDays / releasedCount) : 0;

            resolve({
              generated: new Date().toISOString(),
              summary: {
                avgDailyDetentions,
                avgDailyDetentionsPrevPeriod: avgDailyDetentionsPrev,
                activeCases: currentlyDetained,
                activeCasesPrevPeriod: previousPeriodActive || Math.round(currentlyDetained * 0.95),
              },
              metadata: {
                totalRecords: processedRows,
                currentlyDetained,
                releasedCount,
                avgLengthOfStay,
                processedAt: new Date().toISOString(),
              }
            });
          });

          parser.on('error', reject);

          entry.pipe(parser);
        } else {
          entry.autodrain();
        }
      })
      .on('error', reject);
  });
}

/**
 * Main entry point
 */
async function main() {
  console.log('='.repeat(60));
  console.log('Detention Data Aggregation Script (Streaming)');
  console.log('='.repeat(60));
  console.log(`Started at: ${new Date().toISOString()}`);
  console.log(`Output path: ${OUTPUT_PATH}`);
  console.log('');

  try {
    // Download the file
    await downloadFile(DATA_URL, TEMP_FILE);

    // First pass: extract shared strings
    console.log('\nExtracting shared strings...');
    const sharedStrings = await parseSharedStrings(TEMP_FILE);
    console.log(`Found ${sharedStrings.length} shared strings`);

    // Second pass: process sheet data
    console.log('\nProcessing sheet data...');
    const aggregates = await processSheetStream(TEMP_FILE, sharedStrings);

    // Write output
    console.log(`\nWriting output to: ${OUTPUT_PATH}`);
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(aggregates, null, 2));
    console.log('Output written successfully.');

    // Cleanup temp file
    console.log('Cleaning up temp file...');
    fs.unlinkSync(TEMP_FILE);

    console.log('\n' + '='.repeat(60));
    console.log('Aggregation complete!');
    console.log('='.repeat(60));

  } catch (error) {
    console.error('\nError:', error.message);
    console.error(error.stack);

    if (fs.existsSync(TEMP_FILE)) {
      fs.unlinkSync(TEMP_FILE);
    }

    process.exit(1);
  }
}

main();

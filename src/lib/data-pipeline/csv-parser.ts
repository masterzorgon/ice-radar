import { parse } from 'csv-parse/sync';

// Raw record structure matching Deportation Data Project CSV columns
// Based on codebook at deportationdata.org/docs/ice/codebook.html
export interface RawImmigrationRecord {
  // Apprehension fields
  apprehension_date?: string;
  apprehension_state?: string;
  apprehension_county?: string;
  apprehension_method?: string;

  // Detention fields
  book_in_date?: string;
  book_out_date?: string;
  detention_facility?: string;

  // Deportation/Removal fields
  removal_date?: string;
  departure_country?: string;

  // Demographics
  citizenship?: string;
  birth_country?: string;
  birth_year?: string;
  gender?: string;

  // Family status
  family_unit?: string;
  uac?: string; // Unaccompanied child

  // Record identifiers
  unique_identifier?: string;
}

// Column name mappings for Deportation Data Project Excel files
// Based on codebook at deportationdata.org/docs/ice/codebook.html
const COLUMN_MAPPINGS: Record<string, keyof RawImmigrationRecord> = {
  // Apprehension fields - from arrests dataset
  'apprehension_date': 'apprehension_date',
  'apprehension date': 'apprehension_date',
  'Apprehension Date': 'apprehension_date',
  'app_date': 'apprehension_date',

  'apprehension_state': 'apprehension_state',
  'apprehension state': 'apprehension_state',
  'Apprehension State': 'apprehension_state',
  'app_state': 'apprehension_state',
  'state': 'apprehension_state',

  'apprehension_county': 'apprehension_county',
  'apprehension county': 'apprehension_county',
  'Apprehension County': 'apprehension_county',
  'app_county': 'apprehension_county',
  'county': 'apprehension_county',

  'apprehension_method': 'apprehension_method',
  'app_method': 'apprehension_method',
  'method': 'apprehension_method',

  // Detention fields - from detention-stays/stints datasets
  'book_in_date': 'book_in_date',
  'book in date': 'book_in_date',
  'Book In Date Time': 'book_in_date',
  'stay_book_in_date_time': 'book_in_date',
  'book_in_date_time': 'book_in_date',
  'Stay Book In Date Time': 'book_in_date',

  'book_out_date': 'book_out_date',
  'book out date': 'book_out_date',
  'Book Out Date Time': 'book_out_date',
  'stay_book_out_date_time': 'book_out_date',
  'book_out_date_time': 'book_out_date',
  'Stay Book Out Date Time': 'book_out_date',
  'Stay Book Out Date': 'book_out_date',

  'detention_facility': 'detention_facility',
  'detention facility': 'detention_facility',
  'Detention Facility': 'detention_facility',
  'Detention Facility First': 'detention_facility',
  'Detention Facility Last': 'detention_facility',
  'Detention Facility Longest': 'detention_facility',
  'detloc': 'detention_facility',
  'facility': 'detention_facility',

  // Removal/Deportation fields
  'removal_date': 'removal_date',
  'removal date': 'removal_date',
  'Departed Date': 'removal_date',
  'departed_date': 'removal_date',
  'depart_date': 'removal_date',

  'departure_country': 'departure_country',
  'departure country': 'departure_country',
  'Departure Country': 'departure_country',
  'depart_country': 'departure_country',

  // Demographics
  'citizenship': 'citizenship',
  'Citizenship Country': 'citizenship',
  'citizenship_country': 'citizenship',
  'cit_country': 'citizenship',
  'nationality': 'citizenship',

  'birth_country': 'birth_country',
  'birth country': 'birth_country',
  'Birth Country': 'birth_country',
  'country_of_birth': 'birth_country',

  'birth_year': 'birth_year',
  'birth year': 'birth_year',
  'Birth Year': 'birth_year',
  'year_of_birth': 'birth_year',
  'yob': 'birth_year',

  'gender': 'gender',
  'Gender': 'gender',
  'sex': 'gender',

  // Family status
  'family_unit': 'family_unit',
  'family unit': 'family_unit',
  'Family Unit': 'family_unit',
  'fmua': 'family_unit',

  'uac': 'uac',
  'UAC': 'uac',
  'unaccompanied_minor': 'uac',
  'unaccompanied_child': 'uac',

  // Record identifiers
  'unique_identifier': 'unique_identifier',
  'Unique Identifier': 'unique_identifier',
  'id': 'unique_identifier',
  'uid': 'unique_identifier',
};

function normalizeColumnName(col: string): keyof RawImmigrationRecord | null {
  const trimmed = col.trim();
  return COLUMN_MAPPINGS[trimmed] || COLUMN_MAPPINGS[trimmed.toLowerCase()] || null;
}

export function parseCSV(csvContent: string): RawImmigrationRecord[] {
  // Parse with auto-detected columns
  const rawRecords = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    relax_column_count: true,
  }) as Record<string, string>[];

  // Normalize column names
  return rawRecords.map(raw => {
    const normalized: RawImmigrationRecord = {};

    for (const [key, value] of Object.entries(raw)) {
      const normalizedKey = normalizeColumnName(key);
      if (normalizedKey && value) {
        normalized[normalizedKey] = value;
      }
    }

    return normalized;
  });
}

// Utility to detect CSV format and log column mapping
export function analyzeCSVColumns(csvContent: string): {
  detectedColumns: string[];
  mappedColumns: string[];
  unmappedColumns: string[];
} {
  const firstLine = csvContent.split('\n')[0];
  const detectedColumns = firstLine.split(',').map(c => c.trim().replace(/^"|"$/g, ''));

  const mappedColumns: string[] = [];
  const unmappedColumns: string[] = [];

  for (const col of detectedColumns) {
    if (normalizeColumnName(col)) {
      mappedColumns.push(col);
    } else {
      unmappedColumns.push(col);
    }
  }

  return { detectedColumns, mappedColumns, unmappedColumns };
}

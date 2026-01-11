import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export const runtime = 'edge';

const size = {
  width: 1200,
  height: 630,
};

const typeColors: Record<string, string> = {
  RAID: '#FF0000',
  CHECKPOINT: '#FFCC00',
  PATROL: '#33FF00',
  DETENTION: '#FF0000',
  SURVEILLANCE: '#FFCC00',
};

const typeLabels: Record<string, string> = {
  RAID: '⚠ RAID',
  CHECKPOINT: '◉ CHECKPOINT',
  PATROL: '◎ PATROL',
  DETENTION: '⚠ DETENTION',
  SURVEILLANCE: '◉ SURVEILLANCE',
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const report = await prisma.report.findUnique({
      where: { id },
    });

    if (!report) {
      return new ImageResponse(
        (
          <div
            style={{
              height: '100%',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#000000',
              fontFamily: 'monospace',
            }}
          >
            <div style={{ color: '#FF0000', fontSize: 48 }}>
              REPORT NOT FOUND
            </div>
          </div>
        ),
        { ...size }
      );
    }

    const typeColor = typeColors[report.type] || '#33FF00';
    const typeLabel = typeLabels[report.type] || report.type;
    const timestamp = new Date(report.createdAt).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short',
    });

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#000000',
            fontFamily: 'monospace',
            padding: 48,
            position: 'relative',
          }}
        >
          {/* Scanline overlay effect */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.15), rgba(0,0,0,0.15) 1px, transparent 1px, transparent 2px)',
              pointerEvents: 'none',
            }}
          />

          {/* Vignette effect */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.5) 100%)',
              pointerEvents: 'none',
            }}
          />

          {/* Top border with corners */}
          <div
            style={{
              position: 'absolute',
              top: 24,
              left: 24,
              right: 24,
              bottom: 24,
              border: '3px solid #0A3300',
              display: 'flex',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: 24,
              left: 24,
              width: 20,
              height: 20,
              borderTop: '3px solid #33FF00',
              borderLeft: '3px solid #33FF00',
              display: 'flex',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: 24,
              right: 24,
              width: 20,
              height: 20,
              borderTop: '3px solid #33FF00',
              borderRight: '3px solid #33FF00',
              display: 'flex',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: 24,
              left: 24,
              width: 20,
              height: 20,
              borderBottom: '3px solid #33FF00',
              borderLeft: '3px solid #33FF00',
              display: 'flex',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: 24,
              right: 24,
              width: 20,
              height: 20,
              borderBottom: '3px solid #33FF00',
              borderRight: '3px solid #33FF00',
              display: 'flex',
            }}
          />

          {/* Header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 24,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
              }}
            >
              {/* Radar icon */}
              <div
                style={{
                  width: 60,
                  height: 60,
                  border: '3px solid #33FF00',
                  borderRadius: 4,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    border: '2px solid #33FF00',
                    opacity: 0.5,
                    display: 'flex',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    width: 6,
                    height: 6,
                    backgroundColor: '#33FF00',
                    borderRadius: '50%',
                    display: 'flex',
                  }}
                />
              </div>
              <div
                style={{
                  color: '#33FF00',
                  fontSize: 32,
                  fontWeight: 'bold',
                  letterSpacing: 4,
                  textShadow: '0 0 10px #33FF00',
                  display: 'flex',
                }}
              >
                ICE RADAR
              </div>
            </div>
            <div
              style={{
                color: '#33FF00',
                fontSize: 16,
                opacity: 0.6,
                display: 'flex',
              }}
            >
              COMMUNITY ALERT SYSTEM
            </div>
          </div>

          {/* Divider */}
          <div
            style={{
              height: 2,
              background: 'repeating-linear-gradient(90deg, #33FF00 0px, #33FF00 8px, transparent 8px, transparent 16px)',
              marginBottom: 32,
              display: 'flex',
            }}
          />

          {/* Alert type badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: 24,
            }}
          >
            <div
              style={{
                color: typeColor,
                fontSize: 48,
                fontWeight: 'bold',
                letterSpacing: 6,
                textShadow: `0 0 20px ${typeColor}`,
                display: 'flex',
              }}
            >
              {typeLabel}
            </div>
          </div>

          {/* Location */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              marginBottom: 32,
            }}
          >
            <div
              style={{
                color: '#666666',
                fontSize: 14,
                letterSpacing: 2,
                display: 'flex',
              }}
            >
              LOCATION
            </div>
            <div
              style={{
                color: '#33FF00',
                fontSize: 56,
                fontWeight: 'bold',
                letterSpacing: 2,
                textShadow: '0 0 10px #33FF00',
                display: 'flex',
              }}
            >
              {report.city.toUpperCase()}, {report.state.toUpperCase()}
            </div>
            {report.address && (
              <div
                style={{
                  color: '#33FF00',
                  fontSize: 24,
                  opacity: 0.7,
                  display: 'flex',
                }}
              >
                {report.address}
              </div>
            )}
          </div>

          {/* Description preview */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              flex: 1,
            }}
          >
            <div
              style={{
                color: '#666666',
                fontSize: 14,
                letterSpacing: 2,
                display: 'flex',
              }}
            >
              DESCRIPTION
            </div>
            <div
              style={{
                color: '#33FF00',
                fontSize: 22,
                lineHeight: 1.4,
                opacity: 0.8,
                display: 'flex',
                overflow: 'hidden',
              }}
            >
              {report.description.length > 180
                ? report.description.substring(0, 180) + '...'
                : report.description}
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTop: '2px solid #0A3300',
              paddingTop: 16,
            }}
          >
            <div
              style={{
                display: 'flex',
                gap: 32,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ color: '#666666', fontSize: 14, display: 'flex' }}>
                  VERIFIED:
                </div>
                <div
                  style={{
                    color: report.verifiedCount >= 3 ? '#33FF00' : '#FFCC00',
                    fontSize: 18,
                    fontWeight: 'bold',
                    display: 'flex',
                  }}
                >
                  {report.verifiedCount}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ color: '#666666', fontSize: 14, display: 'flex' }}>
                  STATUS:
                </div>
                <div
                  style={{
                    color: report.status === 'ACTIVE' ? '#33FF00' : report.status === 'RESOLVED' ? '#666666' : '#FFCC00',
                    fontSize: 18,
                    fontWeight: 'bold',
                    display: 'flex',
                  }}
                >
                  {report.status}
                </div>
              </div>
            </div>
            <div
              style={{
                color: '#33FF00',
                fontSize: 16,
                opacity: 0.6,
                display: 'flex',
              }}
            >
              {timestamp}
            </div>
          </div>
        </div>
      ),
      {
        ...size,
      }
    );
  } catch (error) {
    console.error('Error generating OG image:', error);
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#000000',
            fontFamily: 'monospace',
          }}
        >
          <div style={{ color: '#FF0000', fontSize: 48 }}>
            ERROR GENERATING IMAGE
          </div>
        </div>
      ),
      { ...size }
    );
  }
}

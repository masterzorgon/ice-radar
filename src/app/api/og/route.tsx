import { ImageResponse } from 'next/og';

export const runtime = 'edge';

const size = {
  width: 1200,
  height: 630,
};

export async function GET() {
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

        {/* Border with corners */}
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

        {/* Main content container */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
            gap: 32,
          }}
        >
          {/* Radar icon */}
          <div
            style={{
              width: 140,
              height: 140,
              border: '4px solid #33FF00',
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              boxShadow: '0 0 30px rgba(51, 255, 0, 0.3)',
            }}
          >
            {/* Concentric circles */}
            <div
              style={{
                position: 'absolute',
                width: 100,
                height: 100,
                borderRadius: '50%',
                border: '2px solid #33FF00',
                opacity: 0.3,
                display: 'flex',
              }}
            />
            <div
              style={{
                position: 'absolute',
                width: 70,
                height: 70,
                borderRadius: '50%',
                border: '2px solid #33FF00',
                opacity: 0.4,
                display: 'flex',
              }}
            />
            <div
              style={{
                position: 'absolute',
                width: 40,
                height: 40,
                borderRadius: '50%',
                border: '2px solid #33FF00',
                opacity: 0.5,
                display: 'flex',
              }}
            />
            {/* Center dot */}
            <div
              style={{
                width: 12,
                height: 12,
                backgroundColor: '#33FF00',
                borderRadius: '50%',
                boxShadow: '0 0 15px #33FF00',
                display: 'flex',
              }}
            />
            {/* Blips */}
            <div
              style={{
                position: 'absolute',
                top: 30,
                right: 40,
                width: 8,
                height: 8,
                backgroundColor: '#33FF00',
                borderRadius: '50%',
                boxShadow: '0 0 10px #33FF00',
                display: 'flex',
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: 40,
                left: 35,
                width: 6,
                height: 6,
                backgroundColor: '#33FF00',
                borderRadius: '50%',
                opacity: 0.7,
                display: 'flex',
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: 55,
                left: 85,
                width: 6,
                height: 6,
                backgroundColor: '#FF0000',
                borderRadius: '50%',
                boxShadow: '0 0 10px #FF0000',
                display: 'flex',
              }}
            />
          </div>

          {/* Title */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 16,
            }}
          >
            <div
              style={{
                color: '#33FF00',
                fontSize: 72,
                fontWeight: 'bold',
                letterSpacing: 12,
                textShadow: '0 0 30px #33FF00, 0 0 60px rgba(51, 255, 0, 0.5)',
                display: 'flex',
              }}
            >
              ICE RADAR
            </div>
            <div
              style={{
                height: 3,
                width: 400,
                background: 'repeating-linear-gradient(90deg, #33FF00 0px, #33FF00 8px, transparent 8px, transparent 16px)',
                display: 'flex',
              }}
            />
          </div>

          {/* Subtitle */}
          <div
            style={{
              color: '#33FF00',
              fontSize: 24,
              letterSpacing: 6,
              opacity: 0.8,
              textTransform: 'uppercase',
              display: 'flex',
            }}
          >
            Community Alert System
          </div>

          {/* Description */}
          <div
            style={{
              color: '#33FF00',
              fontSize: 20,
              opacity: 0.6,
              maxWidth: 700,
              textAlign: 'center',
              lineHeight: 1.5,
              display: 'flex',
            }}
          >
            Anonymous reporting and tracking of ICE activity.
            Protecting communities through real-time alerts.
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
              gap: 24,
            }}
          >
            <div
              style={{
                color: '#33FF00',
                fontSize: 14,
                opacity: 0.5,
                letterSpacing: 2,
                display: 'flex',
              }}
            >
              ◉ LIVE REPORTS
            </div>
            <div
              style={{
                color: '#33FF00',
                fontSize: 14,
                opacity: 0.5,
                letterSpacing: 2,
                display: 'flex',
              }}
            >
              ◉ REAL-TIME ALERTS
            </div>
            <div
              style={{
                color: '#33FF00',
                fontSize: 14,
                opacity: 0.5,
                letterSpacing: 2,
                display: 'flex',
              }}
            >
              ◉ ANONYMOUS
            </div>
          </div>
          <div
            style={{
              color: '#33FF00',
              fontSize: 14,
              opacity: 0.5,
              display: 'flex',
            }}
          >
            iceradar.org
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

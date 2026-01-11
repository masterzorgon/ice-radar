'use client';

import { useState, memo } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
} from 'react-simple-maps';
import { StateEnforcementData } from '@/types/analytics';

const geoUrl = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json';

// State name to abbreviation mapping
const stateNameToAbbr: Record<string, string> = {
  'Alabama': 'AL', 'Alaska': 'AK', 'Arizona': 'AZ', 'Arkansas': 'AR', 'California': 'CA',
  'Colorado': 'CO', 'Connecticut': 'CT', 'Delaware': 'DE', 'Florida': 'FL', 'Georgia': 'GA',
  'Hawaii': 'HI', 'Idaho': 'ID', 'Illinois': 'IL', 'Indiana': 'IN', 'Iowa': 'IA',
  'Kansas': 'KS', 'Kentucky': 'KY', 'Louisiana': 'LA', 'Maine': 'ME', 'Maryland': 'MD',
  'Massachusetts': 'MA', 'Michigan': 'MI', 'Minnesota': 'MN', 'Mississippi': 'MS', 'Missouri': 'MO',
  'Montana': 'MT', 'Nebraska': 'NE', 'Nevada': 'NV', 'New Hampshire': 'NH', 'New Jersey': 'NJ',
  'New Mexico': 'NM', 'New York': 'NY', 'North Carolina': 'NC', 'North Dakota': 'ND', 'Ohio': 'OH',
  'Oklahoma': 'OK', 'Oregon': 'OR', 'Pennsylvania': 'PA', 'Rhode Island': 'RI', 'South Carolina': 'SC',
  'South Dakota': 'SD', 'Tennessee': 'TN', 'Texas': 'TX', 'Utah': 'UT', 'Vermont': 'VT',
  'Virginia': 'VA', 'Washington': 'WA', 'West Virginia': 'WV', 'Wisconsin': 'WI', 'Wyoming': 'WY',
  'District of Columbia': 'DC', 'Puerto Rico': 'PR',
};

interface StateHeatmapProps {
  data: StateEnforcementData[];
  title?: string;
  subtitle?: string;
}

function StateHeatmap({ data, title = 'MAP', subtitle = 'STATE ENFORCEMENT ACTIVITY' }: StateHeatmapProps) {
  const [hoveredState, setHoveredState] = useState<StateEnforcementData | null>(null);

  // Create a map of state codes to enforcement data
  const stateDataMap = data.reduce((acc, state) => {
    acc[state.stateCode] = state;
    return acc;
  }, {} as Record<string, StateEnforcementData>);

  const getIntensityColor = (intensity: number | undefined) => {
    if (!intensity || intensity === 0) return '#0A1A0A';
    if (intensity >= 9) return '#FF3333';
    if (intensity >= 7) return '#FF6633';
    if (intensity >= 5) return '#FFAA00';
    if (intensity >= 3) return '#29CC00';
    return '#146600';
  };

  return (
    <div className="bg-background border-2 border-accent-dim p-4 h-full relative">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-accent text-[10px] tracking-wider glow-text">[{title}]</span>
        <span className="text-accent-muted text-[8px] tracking-wider">{subtitle}</span>
      </div>

      {/* Hover tooltip */}
      {hoveredState && (
        <div className="absolute top-12 left-4 z-20 bg-background border-2 border-accent p-3 text-[8px] tracking-wider">
          <div className="text-accent glow-text mb-1">{hoveredState.state}</div>
          <div className="text-accent-muted">
            ENFORCEMENT ACTIONS: <span className="text-warning glow-warning">{hoveredState.enforcementActions.toLocaleString()}</span>
          </div>
          <div className="text-accent-muted">
            DEPORTATIONS: <span className="text-danger glow-danger">{hoveredState.deportations.toLocaleString()}</span>
          </div>
          <div className="text-accent-muted">
            INTENSITY: <span style={{ color: getIntensityColor(hoveredState.intensity) }}>
              {hoveredState.intensity}/10
            </span>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-10 flex items-center gap-3 text-[8px] tracking-wider">
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 bg-danger" />
          <span className="text-accent-muted">HIGH</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 bg-warning" />
          <span className="text-accent-muted">MED</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 bg-accent" />
          <span className="text-accent-muted">LOW</span>
        </div>
      </div>

      <div className="h-[calc(100%-3rem)]">
        <ComposableMap
          projection="geoAlbersUsa"
          className="w-full h-full"
          style={{ backgroundColor: 'transparent' }}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const stateName = geo.properties.name as string;
                const stateAbbr = stateNameToAbbr[stateName];
                const stateData = stateAbbr ? stateDataMap[stateAbbr] : undefined;

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={getIntensityColor(stateData?.intensity)}
                    stroke="#33FF00"
                    strokeWidth={1}
                    onMouseEnter={() => stateData && setHoveredState(stateData)}
                    onMouseLeave={() => setHoveredState(null)}
                    style={{
                      default: { outline: 'none', cursor: stateData ? 'pointer' : 'default' },
                      hover: { fill: stateData ? '#0A2A0A' : '#0A1A0A', outline: 'none', cursor: stateData ? 'pointer' : 'default' },
                      pressed: { outline: 'none' },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>
      </div>
    </div>
  );
}

export default memo(StateHeatmap);

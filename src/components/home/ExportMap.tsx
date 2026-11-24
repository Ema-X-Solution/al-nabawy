// Accurate world map from Natural Earth 110m outlines (public domain), server-rendered SVG.
import { COUNTRIES, MAP_W, MAP_MIN_Y, MAP_MAX_Y } from './map-data'

export interface MapMarker { x: number; y: number; color: string }
export interface MapHighlight { name: string; color: string }

// lon/lat -> svg coords, must match the generator projection
export function project(lon: number, lat: number) {
  return { x: ((lon + 180) / 360) * MAP_W, y: ((90 - lat) / 180) * 500 }
}

export default function ExportMap({ markers, highlights }: { markers: MapMarker[]; highlights: MapHighlight[] }) {
  const hl = new Map(highlights.map((h) => [h.name, h.color]))
  return (
    <svg
      viewBox={`0 ${MAP_MIN_Y} ${MAP_W} ${MAP_MAX_Y - MAP_MIN_Y}`}
      style={{ width: '100%', height: 'auto', display: 'block' }}
      role="img"
      aria-label="World map"
    >
      {COUNTRIES.map((c) => {
        const color = hl.get(c.name)
        return (
          <path
            key={c.name}
            d={c.d}
            fill={color || 'rgba(255,255,255,0.10)'}
            stroke={color || 'rgba(255,255,255,0.32)'}
            strokeWidth={color ? 1 : 0.7}
            strokeLinejoin="round"
          />
        )
      })}
      {markers.map((m, i) => (
        <g key={`m${i}`}>
          <circle cx={m.x} cy={m.y} r={7} fill={m.color} stroke="#0a2f52" strokeWidth={1.5} />
          <circle cx={m.x} cy={m.y} r={7} fill="none" stroke={m.color} strokeWidth={2.5} className="export-map-ping" />
        </g>
      ))}
    </svg>
  )
}

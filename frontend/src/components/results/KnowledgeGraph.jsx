import { useTheme } from 'next-themes'
import { useEffect, useRef, useState, useLayoutEffect } from 'react'

const SEVERITY_COLORS = {
  CRITICAL: {
    edge:  '#ef4444',
    label: '#dc2626',
    dark:  '#f87171',
    bg:    'rgba(239,68,68,0.12)'
  },
  HIGH: {
    edge:  '#f97316',
    label: '#ea580c',
    dark:  '#fb923c',
    bg:    'rgba(249,115,22,0.12)'
  },
  MEDIUM: {
    edge:  '#eab308',
    label: '#ca8a04',
    dark:  '#facc15',
    bg:    'rgba(234,179,8,0.12)'
  },
  LOW: {
    edge:  '#3b82f6',
    label: '#2563eb',
    dark:  '#60a5fa',
    bg:    'rgba(59,130,246,0.12)'
  }
}

// Demo interactions shown when no real ones exist
const DEMO_INTERACTIONS = [
  {
    ingredient1: 'Sodium Benzoate (E211)',
    ingredient2: 'Ascorbic Acid (E300)',
    interaction: 'Forms Benzene',
    severity:    'CRITICAL',
    source:      'WHO 2005 / IARC Group 1',
    isDemo:      true
  },
  {
    ingredient1: 'Sunset Yellow (E110)',
    ingredient2: 'Tartrazine (E102)',
    interaction: 'Hyperactivity Risk',
    severity:    'MEDIUM',
    source:      'EFSA Southampton Study 2009',
    isDemo:      true
  }
]

function wrapLabel(text, maxLen = 13) {
  if (text.length <= maxLen) return [text]
  // Try to split on space or parenthesis
  const parts = text.split(/[\s(]/)
  const lines = []
  let current = ''
  for (const part of parts) {
    const candidate = current ? `${current} ${part}` : part
    if (candidate.length > maxLen && current) {
      lines.push(current)
      current = part
    } else {
      current = candidate
    }
  }
  if (current) lines.push(current)
  return lines.slice(0, 3)
}

export default function KnowledgeGraph({ interactions }) {
  const { theme }   = useTheme()
  const isDark      = theme === 'dark'
  const wrapperRef  = useRef(null)
  const [width, setWidth] = useState(0)
  const [ready, setReady] = useState(false)

  const hasRealInteractions = interactions && interactions.length > 0
  const displayData = hasRealInteractions
    ? interactions
    : DEMO_INTERACTIONS

  // Use both useLayoutEffect and ResizeObserver for reliability
  useLayoutEffect(() => {
    const measure = () => {
      if (wrapperRef.current) {
        const w = wrapperRef.current.getBoundingClientRect().width
        if (w > 0) {
          setWidth(w)
          setReady(true)
        }
      }
    }

    // Measure immediately
    measure()

    // Also use ResizeObserver as fallback
    const observer = new ResizeObserver(() => measure())
    if (wrapperRef.current) {
      observer.observe(wrapperRef.current)
    }

    // Fallback timeout — measure after paint
    const timeout = setTimeout(measure, 100)

    return () => {
      observer.disconnect()
      clearTimeout(timeout)
    }
  }, [])

  // ── Layout ───────────────────────────────────
  const svgWidth  = width || 560
  const rowHeight = 100
  const topPad    = 30
  const height    = topPad + displayData.length * rowHeight + 40

  const leftX  = svgWidth * 0.20
  const rightX = svgWidth * 0.80

  // Build node positions
  const nodes = {}
  const edges = []

  displayData.forEach((item, idx) => {
    const y = topPad + idx * rowHeight + rowHeight / 2

    const lk = item.ingredient1
    const rk = item.ingredient2

    if (!nodes[lk]) nodes[lk] = { x: leftX,  y, key: lk }
    if (!nodes[rk]) nodes[rk] = { x: rightX, y, key: rk }

    edges.push({
      ...item,
      x1: leftX,
      y1: y,
      x2: rightX,
      y2: y
    })
  })

  const nodeR    = Math.min(38, svgWidth * 0.065)
  const fSize    = Math.max(8, Math.min(10, svgWidth * 0.017))
  const textColor = isDark ? '#e2e8f0' : '#1e293b'
  const mutedClr  = isDark ? '#94a3b8' : '#64748b'
  const nodeFill  = isDark ? '#1e2a3a' : '#f8fafc'
  const nodeLine  = isDark ? '#334155' : '#cbd5e1'

  return (
    <div className="w-full space-y-3">

      {/* Demo label */}
      {!hasRealInteractions && (
        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/20">
          <span className="text-xs text-blue-500 font-medium">
            📊 Example Graph — No interactions detected in this product.
            Showing reference interactions for illustration.
          </span>
        </div>
      )}

      {/* SVG Container */}
      <div ref={wrapperRef} className="w-full">
        {ready && (
          <svg
            width={svgWidth}
            height={height}
            viewBox={`0 0 ${svgWidth} ${height}`}
            style={{
              width:    '100%',
              height:   'auto',
              display:  'block',
              overflow: 'visible'
            }}
          >
            <defs>
              {/* Arrow markers per severity */}
              {Object.entries(SEVERITY_COLORS).map(([sev, c]) => (
                <marker
                  key={sev}
                  id={`kg-arrow-${sev}`}
                  markerWidth="8"
                  markerHeight="6"
                  refX="7"
                  refY="3"
                  orient="auto"
                >
                  <polygon
                    points="0 0, 8 3, 0 6"
                    fill={isDark ? c.dark : c.edge}
                  />
                </marker>
              ))}

              {/* Glow for CRITICAL */}
              <filter id="kg-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Column headers */}
            <text
              x={leftX}
              y={14}
              textAnchor="middle"
              fontSize={fSize}
              fontWeight="700"
              fill={mutedClr}
              letterSpacing="0.08em"
            >
              INGREDIENT A
            </text>
            <text
              x={rightX}
              y={14}
              textAnchor="middle"
              fontSize={fSize}
              fontWeight="700"
              fill={mutedClr}
              letterSpacing="0.08em"
            >
              INGREDIENT B
            </text>

            {/* ── Edges ── */}
            {edges.map((edge, idx) => {
              const sev     = edge.severity || 'LOW'
              const colors  = SEVERITY_COLORS[sev] || SEVERITY_COLORS.LOW
              const ec      = isDark ? colors.dark : colors.edge
              const lc      = isDark ? colors.dark : colors.label
              const isCrit  = sev === 'CRITICAL'
              const midX    = (edge.x1 + edge.x2) / 2
              const midY    = edge.y1

              // Arrow start/end offset from node edge
              const startX  = edge.x1 + nodeR + 3
              const endX    = edge.x2 - nodeR - 3

              // Interaction text — truncate if needed
              const interText = edge.interaction.length > 18
                ? edge.interaction.slice(0, 16) + '…'
                : edge.interaction

              const labelW = Math.min(svgWidth * 0.28, 120)
              const labelH = 22

              return (
                <g key={idx}>
                  {/* Main arrow line */}
                  <line
                    x1={startX}
                    y1={midY}
                    x2={endX}
                    y2={midY}
                    stroke={ec}
                    strokeWidth={isCrit ? 2.5 : 1.8}
                    strokeDasharray={isCrit ? 'none' : '7 4'}
                    markerEnd={`url(#kg-arrow-${sev})`}
                    filter={isCrit ? 'url(#kg-glow)' : 'none'}
                    opacity={0.85}
                  />

                  {/* Label pill on midpoint */}
                  <rect
                    x={midX - labelW / 2}
                    y={midY - labelH / 2}
                    width={labelW}
                    height={labelH}
                    rx={labelH / 2}
                    fill={isDark ? '#111827' : '#ffffff'}
                    stroke={ec}
                    strokeWidth={1.2}
                    opacity={0.97}
                  />
                  <text
                    x={midX}
                    y={midY + 4}
                    textAnchor="middle"
                    fontSize={fSize}
                    fontWeight="600"
                    fill={lc}
                  >
                    {interText}
                  </text>

                  {/* Severity pill below */}
                  <rect
                    x={midX - 28}
                    y={midY + labelH / 2 + 3}
                    width={56}
                    height={15}
                    rx={7.5}
                    fill={ec}
                    opacity={isDark ? 0.2 : 0.15}
                  />
                  <text
                    x={midX}
                    y={midY + labelH / 2 + 13}
                    textAnchor="middle"
                    fontSize={fSize - 1}
                    fontWeight="700"
                    fill={lc}
                    opacity={0.95}
                  >
                    {sev}
                  </text>
                </g>
              )
            })}

            {/* ── Nodes ── */}
            {Object.entries(nodes).map(([key, node]) => {
              const lines = wrapLabel(key)
              const lineH = fSize + 2.5
              const totalH = lines.length * lineH
              return (
                <g key={key}>
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={nodeR}
                    fill={nodeFill}
                    stroke={nodeLine}
                    strokeWidth={1.5}
                  />
                  {lines.map((line, li) => (
                    <text
                      key={li}
                      x={node.x}
                      y={
                        node.y
                        - totalH / 2
                        + li * lineH
                        + lineH / 2
                        + 1
                      }
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize={fSize}
                      fontWeight="500"
                      fill={textColor}
                    >
                      {line}
                    </text>
                  ))}
                </g>
              )
            })}
          </svg>
        )}

        {/* Fallback while measuring */}
        {!ready && (
          <div className="h-32 flex items-center justify-center">
            <div className="text-xs text-muted-foreground animate-pulse">
              Rendering graph...
            </div>
          </div>
        )}
      </div>

      {/* ── Legend ── */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-1">
        <span className="text-xs text-muted-foreground font-medium">
          Severity:
        </span>
        {Object.entries(SEVERITY_COLORS).map(([sev, c]) => (
          <div key={sev} className="flex items-center gap-1.5">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ background: isDark ? c.dark : c.edge }}
            />
            <span
              className="text-xs font-semibold"
              style={{ color: isDark ? c.dark : c.label }}
            >
              {sev}
            </span>
          </div>
        ))}
        <span className="text-xs text-muted-foreground">
          ╌╌ non-critical &nbsp; ── critical
        </span>
      </div>
    </div>
  )
}
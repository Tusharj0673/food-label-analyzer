import { FlaskConical, Lock, Zap } from 'lucide-react'
import { useTheme } from 'next-themes'

const modes = [
  {
    id:          'production',
    label:       'Production Mode',
    description: 'Fast — Gemini powered',
    icon:        Zap,
    // Green → teal → emerald gradient
    gradient:    'from-emerald-500 via-green-400 to-teal-500',
    gradientDark:'from-emerald-600 via-green-500 to-teal-600',
    shadow:      'rgba(16, 185, 129, 0.35)'
  },
  {
    id:          'research',
    label:       'Research Mode',
    description: 'Full pipeline — BERT + LayoutLMv3 + SHAP',
    icon:        FlaskConical,
    // Violet → purple → indigo gradient
    gradient:    'from-violet-500 via-purple-500 to-indigo-500',
    gradientDark:'from-violet-600 via-purple-600 to-indigo-600',
    shadow:      'rgba(139, 92, 246, 0.35)'
  }
]

export default function ModeSelector({
  mode,
  loading,
  onModeChange
}) {
  const { theme } = useTheme()
  const isDark    = theme === 'dark'

  return (
    <div className="space-y-3">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-foreground">
            Analysis Mode
          </h2>
          <p className="text-sm text-muted-foreground">
            {loading
              ? 'Mode locked during analysis'
              : 'Choose how to analyze your label'
            }
          </p>
        </div>
        {loading && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Lock className="h-3 w-3" />
            Locked
          </div>
        )}
      </div>

      {/* Mode Buttons */}
      <div className="grid grid-cols-2 gap-3">
       {modes.map(m => {
  const Icon        = m.icon
  const isActive    = mode === m.id
  const gradient    = isDark ? m.gradientDark : m.gradient
  const isResearch  = m.id === 'research'

  return (
    <button
      key={m.id}
      onClick={() => !isResearch && onModeChange(m.id)}
      disabled={loading || isResearch}
      className={`
        relative overflow-hidden w-full
        rounded-xl p-4 text-left
        transition-all duration-300
        ${isResearch
          ? 'cursor-not-allowed opacity-50 border-2 border-border bg-card'
          : isActive
            ? `bg-linear-to-br ${gradient}
               animate-gradient text-white shadow-lg
               scale-[1.02] border-2 border-transparent`
            : `border-2 bg-card hover:scale-[1.01]
               hover:shadow-md transition-transform ${isDark
                 ? 'border-white/10 hover:border-white/20'
                 : 'border-gray-200 hover:border-gray-300'
               }`
        }
      `}
      style={isActive && !isResearch ? {
        boxShadow: `0 4px 20px ${m.shadow}, 0 2px 8px ${m.shadow}`
      } : {}}
    >
      {/* Background ambient animation overlay for non-disabled active tabs */}
      {isActive && !isResearch && (
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.4) 50%, transparent 70%)',
            backgroundSize: '200% 200%',
            animation: 'gradientMove 2s ease infinite'
          }}
        />
      )}

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-2">
          <Icon className={`h-5 w-5 ${
            isResearch
              ? 'text-muted-foreground'
              : isActive ? 'text-white' : 'text-muted-foreground'
          }`} />
          
          {isResearch && (
            <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full font-medium">
              Unavailable
            </span>
          )}
          
          {loading && isActive && !isResearch && (
            <Lock className="h-3 w-3 text-white/70" />
          )}
          
          {!isResearch && isActive && !loading && (
            <div className="w-2 h-2 rounded-full bg-white/70 animate-pulse" />
          )}
        </div>

        <p className={`text-sm font-semibold leading-tight ${
          isResearch
            ? 'text-muted-foreground'
            : isActive ? 'text-white' : 'text-foreground'
        }`}>
          {m.label}
        </p>

        <p className={`text-xs mt-0.5 leading-tight ${
          isResearch
            ? 'text-muted-foreground/60'
            : isActive ? 'text-white/80' : 'text-muted-foreground'
        }`}>
          {isResearch
            ? 'Not available on displayed server'
            : m.description
          }
        </p>
      </div>
    </button>
  )
})}
      </div>

      {/* Research mode info */}
      {mode === 'research' && !loading && (
        <div className="flex items-start gap-2 p-3 rounded-xl bg-violet-50 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-500/20">
          <FlaskConical className="h-4 w-4 text-violet-600 dark:text-violet-400 shrink-0 mt-0.5" />
          <p className="text-xs text-violet-700 dark:text-violet-400">
            Research mode loads LayoutLMv3 and BERT —
            first scan may take 2-5 minutes while models
            download. Subsequent scans are much faster.
          </p>
        </div>
      )}
    </div>
  )
}
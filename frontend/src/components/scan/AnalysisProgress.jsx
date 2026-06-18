import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, CheckCircle } from 'lucide-react'
import { productionSteps, researchSteps } from './ScanConstants'

export default function AnalysisProgress({
  mode,
  currentStep
}) {
  const activeSteps = mode === 'research'
    ? researchSteps
    : productionSteps

  return (
    <Card className="border-border/60">
      <CardContent className="p-6 space-y-4">

        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            <span className="font-medium text-sm">
              Analyzing your label...
            </span>
          </div>
          <Badge
            variant="outline"
            className={
              mode === 'research'
                ? 'border-purple-500/30 text-purple-500 text-xs'
                : 'border-green-500/30 text-green-500 text-xs'
            }
          >
            {mode === 'research'
              ? '🔬 Research Mode'
              : '⚡ Production Mode'
            }
          </Badge>
        </div>

        {/* Steps */}
        {activeSteps.map((step, idx) => {
          const Icon     = step.icon
          const isDone   = idx < currentStep
          const isActive = idx === currentStep

          return (
            <div
              key={idx}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-500 ${
                isDone
                  ? 'bg-green-500/10'
                  : isActive
                  ? 'bg-primary/10'
                  : 'opacity-40'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                isDone
                  ? 'bg-green-500/20'
                  : isActive
                  ? 'bg-primary/20'
                  : 'bg-muted'
              }`}>
                {isDone
                  ? <CheckCircle className="h-4 w-4 text-green-500" />
                  : isActive
                  ? <Loader2 className="h-4 w-4 text-primary animate-spin" />
                  : <Icon className="h-4 w-4 text-muted-foreground" />
                }
              </div>
              <div>
                <p className={`text-sm font-medium ${
                  isDone
                    ? 'text-green-500'
                    : isActive
                    ? 'text-primary'
                    : 'text-muted-foreground'
                }`}>
                  {step.label}
                </p>
                <p className="text-xs text-muted-foreground">
                  {step.detail}
                </p>
              </div>
            </div>
          )
        })}

        {mode === 'research' && (
          <p className="text-xs text-muted-foreground text-center pt-2 border-t border-border/40">
            Research mode may take 2-5 minutes on first
            run — models are loading into memory
          </p>
        )}
      </CardContent>
    </Card>
  )
}
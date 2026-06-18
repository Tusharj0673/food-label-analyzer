import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScanLine } from 'lucide-react'
import {
  productionBadges,
  researchBadges
} from './ScanConstants'

export default function ScanFooter({
  mode,
  loading,
  file,
  onAnalyze
}) {
  const badges = mode === 'research'
    ? researchBadges
    : productionBadges

  return (
    <div className="space-y-4">
      {!loading && (
        <div className="space-y-2">
          <Button
            onClick={onAnalyze}
            className="w-full h-12 text-base gap-2"
            disabled={!file}
          >
            <ScanLine className="h-5 w-5" />
            {mode === 'research'
              ? 'Analyze with Full Pipeline'
              : 'Analyze This Label'
            }
          </Button>
          {!file && (
            <p className="text-xs text-center text-muted-foreground">
              Upload the front label image to begin
            </p>
          )}
        </div>
      )}

      {loading && (
        <p className="text-xs text-center text-muted-foreground">
          Please do not close or refresh this page
          during analysis
        </p>
      )}

      {!loading && (
        <div className="flex flex-wrap gap-2 justify-center">
          {badges.map((tag, idx) => (
            <Badge
              key={idx}
              variant="outline"
              className="text-xs text-muted-foreground"
            >
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
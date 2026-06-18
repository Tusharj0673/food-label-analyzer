import { Lock } from 'lucide-react'
import { healthProfiles } from './ScanConstants'

export default function HealthSelector({
  healthProfile,
  loading,
  onProfileChange
}) {
  return (
    <div className={`space-y-3 transition-opacity ${
      loading ? 'opacity-60 pointer-events-none' : ''
    }`}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-foreground">
            Your Health Profile
          </h2>
          <p className="text-sm text-muted-foreground">
            Select your condition for personalised
            ingredient flagging and analysis
          </p>
        </div>
        {loading && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Lock className="h-3 w-3" />
            Locked
          </div>
        )}
      </div>

      {/* Scrollable grid — handles 11 conditions */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {healthProfiles.map(profile => (
          <button
            key={profile.id}
            onClick={() => onProfileChange(profile.id)}
            disabled={loading}
            className={`p-3 rounded-xl border-2 text-left transition-all duration-200 disabled:cursor-not-allowed ${
              healthProfile === profile.id
                ? `${profile.color} border-current`
                : 'border-border bg-card hover:border-primary/40'
            }`}
          >
            <p className={`text-xs font-semibold leading-tight ${
              healthProfile === profile.id
                ? ''
                : 'text-foreground'
            }`}>
              {profile.label}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5 leading-tight">
              {profile.description}
            </p>
          </button>
        ))}
      </div>

      {/* Active condition indicator */}
      {healthProfile !== 'none' && (
        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-primary/5 border border-primary/20">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse shrink-0" />
          <p className="text-xs text-primary font-medium">
            Analysis personalised for:{' '}
            {healthProfiles.find(
              p => p.id === healthProfile
            )?.label}
          </p>
        </div>
      )}
    </div>
  )
}
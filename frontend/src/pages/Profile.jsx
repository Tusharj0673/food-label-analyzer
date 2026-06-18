import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card'
import {
  User,
  ShieldCheck,
  Loader2,
  Save,
  LogOut,
  ScanLine,
  History,
  Check
} from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'
import api from '@/api/axios'

const healthConditions = [
  {
    id:          'diabetic',
    label:       'Diabetic',
    description: 'Flags maltodextrin, dextrose, high sugar, and high-GI ingredients',
    color:       'border-blue-500 bg-blue-100 text-blue-900 dark:bg-blue-500/10 dark:text-blue-400'
  },
  {
    id:          'hypertensive',
    label:       'Hypertensive',
    description: 'Flags high sodium, MSG, and sodium-rich additives',
    color:       'border-orange-500 bg-orange-100 text-orange-900 dark:bg-orange-500/10 dark:text-orange-400'
  },
  {
    id:          'pku',
    label:       'PKU (Phenylketonuria)',
    description: 'Flags aspartame and phenylalanine — dangerous for PKU patients',
    color:       'border-violet-500 bg-violet-100 text-violet-900 dark:bg-purple-500/10 dark:text-purple-400'
  },
  {
    id:          'pregnant',
    label:       'Pregnant',
    description: 'Flags aspartame, saccharin, nitrates, and unsafe additives',
    color:       'border-pink-500 bg-pink-100 text-pink-900 dark:bg-pink-500/10 dark:text-pink-400'
  },
  {
    id:          'lactose_intolerant',
    label:       'Lactose Intolerant',
    description: 'Flags milk solids, whey, casein, lactose — 60% prevalence in India',
    color:       'border-amber-500 bg-amber-100 text-amber-900 dark:bg-yellow-500/10 dark:text-yellow-400'
  },
  {
    id:          'pcos',
    label:       'PCOS Management',
    description: 'Flags maida, partially hydrogenated oils, HFCS, and insulin-spiking sugars',
    color:       'border-rose-500 bg-rose-100 text-rose-900 dark:bg-rose-500/10 dark:text-rose-400'
  },
  {
    id:          'celiac',
    label:       'Celiac / Gluten Sensitive',
    description: 'Flags wheat, barley, rye, semolina, malt extract, and hidden gluten',
    color:       'border-yellow-600 bg-yellow-100 text-yellow-900 dark:bg-amber-500/10 dark:text-amber-400'
  },
  {
    id:          'heart',
    label:       'Heart Health / CVD Risk',
    description: 'Flags palm oil, palmolein, trans fats, and high sodium',
    color:       'border-red-500 bg-red-100 text-red-900 dark:bg-red-500/10 dark:text-red-400'
  },
  {
    id:          'ibs',
    label:       'IBS / Sensitive Gut',
    description: 'Flags sugar alcohols (polyols), inulin, chicory root, and high-FODMAP sweeteners',
    color:       'border-teal-500 bg-teal-100 text-teal-900 dark:bg-teal-500/10 dark:text-teal-400'
  },
  {
    id:          'uric_acid',
    label:       'High Uric Acid / Gout',
    description: 'Flags HFCS, fructose, liquid glucose, yeast extract',
    color:       'border-indigo-500 bg-indigo-100 text-indigo-900 dark:bg-indigo-500/10 dark:text-indigo-400'
  }
]

// All conditions default to false
const defaultHealthProfile = {
  diabetic:           false,
  hypertensive:       false,
  pku:                false,
  pregnant:           false,
  lactose_intolerant: false,
  pcos:               false,
  celiac:             false,
  heart:              false,
  ibs:                false,
  uric_acid:          false
}

export default function Profile() {
  const navigate = useNavigate()

  const [profile, setProfile]           = useState(null)
  const [loading, setLoading]           = useState(true)
  const [saving, setSaving]             = useState(false)
  const [saved, setSaved]               = useState(false)
  const [healthProfile, setHealthProfile] = useState(
    defaultHealthProfile
  )

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await api.get('/profile/')
      setProfile(response.data)

      if (response.data.healthProfile) {
        // Merge saved profile with defaults
        // This handles old profiles that
        // don't have new condition keys
        setHealthProfile({
          ...defaultHealthProfile,
          ...response.data.healthProfile
        })
      }
    } catch (error) {
      if (error.response?.status === 401) {
        navigate('/login')
        return
      }
      toast.error('Could not load profile')
    } finally {
      setLoading(false)
    }
  }

  const handleToggle = (conditionId) => {
    setHealthProfile(prev => ({
      ...prev,
      [conditionId]: !prev[conditionId]
    }))
    setSaved(false)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await api.put('/profile/health', healthProfile)
      setSaved(true)
      toast.success('Health profile updated successfully')
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      const msg = error.response?.data?.detail
        || 'Could not save profile. Please try again.'
      toast.error(msg)
    } finally {
      setSaving(false)
    }
  }

  const handleClearAll = () => {
    setHealthProfile(defaultHealthProfile)
    setSaved(false)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    toast.success('Logged out successfully')
    setTimeout(() => navigate('/login'), 500)
  }

  const activeConditions = Object.entries(healthProfile)
    .filter(([, v]) => v === true)
    .map(([k]) =>
      healthConditions.find(c => c.id === k)?.label || k
    )

  if (loading) {
    return (
      <div className="min-h-[90vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">
            Loading your profile...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[90vh] py-12 px-4">
      <Toaster position="top-center" />

      <div className="absolute inset-0 bg-linear-to-br from-green-500/5 via-background to-background pointer-events-none" />

      <div className="max-w-2xl mx-auto relative space-y-6">

        {/* Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 text-sm text-primary font-medium">
            <User className="h-4 w-4" />
            Your Profile
          </div>
          <h1 className="text-3xl font-bold text-foreground">
            Account Settings
          </h1>
          <p className="text-muted-foreground">
            Manage your health profile for personalised analysis
          </p>
        </div>

        {/* Account Info */}
        <Card className="border-border/60">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-foreground">
              <User className="h-5 w-5 text-primary" />
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-2xl font-bold text-primary">
                  {profile?.name?.[0]?.toUpperCase() || 'U'}
                </span>
              </div>
              <div>
                <p className="font-semibold text-lg text-foreground">
                  {profile?.name || 'User'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {profile?.email || ''}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {profile?.authProvider === 'google'
                    ? '🔵 Signed in with Google'
                    : '📧 Signed in with Email'
                  }
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">
                  Full Name
                </Label>
                <Input
                  value={profile?.name || ''}
                  disabled
                  className="h-9"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">
                  Email Address
                </Label>
                <Input
                  value={profile?.email || ''}
                  disabled
                  className="h-9"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Health Profile */}
        <Card className="border-border/60">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-foreground">
              <ShieldCheck className="h-5 w-5 text-primary" />
              Health Profile
            </CardTitle>
            <CardDescription>
              Selected conditions personalise your scan
              results — ingredient flags and health
              explanations are tailored to your profile.
              You can select multiple conditions.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">

            {/* Active summary */}
            {activeConditions.length > 0 ? (
              <div className="p-3 rounded-xl bg-primary/5 border border-primary/20">
                <p className="text-xs text-primary font-medium">
                  ✅ Active conditions ({activeConditions.length}):
                  {' '}{activeConditions.join(', ')}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Your scans will flag ingredients relevant
                  to these conditions
                </p>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-muted/50 border border-border">
                <p className="text-xs text-muted-foreground">
                  No conditions selected — general analysis
                  will be performed
                </p>
              </div>
            )}

            {/* Condition toggles */}
            <div className="space-y-2">
              {healthConditions.map(condition => {
                const isActive = healthProfile[condition.id] === true

                return (
                  <button
                    key={condition.id}
                    onClick={() => handleToggle(condition.id)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                      isActive
                        ? `${condition.color} border-current`
                        : 'border-border bg-card hover:border-primary/40'
                    }`}
                  >
                    <div className="flex-1 min-w-0 pr-3">
                      <p className={`font-medium text-sm ${
                        isActive ? '' : 'text-foreground'
                      }`}>
                        {condition.label}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                        {condition.description}
                      </p>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                      isActive
                        ? 'border-current bg-current'
                        : 'border-muted-foreground'
                    }`}>
                      {isActive && (
                        <Check className="h-3 w-3 text-white" />
                      )}
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Clear all */}
            <button
              onClick={handleClearAll}
              className="w-full p-3 rounded-xl border border-dashed border-border text-sm text-muted-foreground hover:border-primary/40 hover:text-foreground transition-all"
            >
              Clear all conditions — general analysis only
            </button>

            {/* Save Button */}
            <Button
              onClick={handleSave}
              disabled={saving || saved}
              className="w-full h-11 gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : saved ? (
                <>
                  <Check className="h-4 w-4" />
                  Saved Successfully
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Health Profile
                </>
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              Your saved profile auto-loads on the Scan page
            </p>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-border/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-foreground">
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start gap-3 h-11"
              onClick={() => navigate('/scan')}
            >
              <ScanLine className="h-4 w-4 text-primary" />
              Scan a Food Label
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start gap-3 h-11"
              onClick={() => navigate('/history')}
            >
              <History className="h-4 w-4 text-primary" />
              View Scan History
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start gap-3 h-11 text-red-500 hover:text-red-500 hover:border-red-500/40"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
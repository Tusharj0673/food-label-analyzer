import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ScanLine } from 'lucide-react'
import { Toaster } from 'react-hot-toast'
import toast from 'react-hot-toast'
import api from '@/api/axios'

import ImageUploader    from '@/components/scan/ImageUploader'
import ModeSelector     from '@/components/scan/ModeSelector'
import HealthSelector   from '@/components/scan/HealthSelector'
import AnalysisProgress from '@/components/scan/AnalysisProgress'
import ScanFooter       from '@/components/scan/ScanFooter'
import {
  productionSteps,
  researchSteps
} from '@/components/scan/ScanConstants'

export default function Scan() {
  const navigate = useNavigate()

  const [files, setFiles] = useState({
    front:       null,
    nutrition:   null,
    ingredients: null
  })
  const [previews, setPreviews] = useState({
    front:       null,
    nutrition:   null,
    ingredients: null
  })

  const [healthProfile, setHealthProfile] = useState('none')
  const [mode, setMode]                   = useState('production')
  const [loading, setLoading]             = useState(false)
  const [currentStep, setCurrentStep]     = useState(0)
  const [intervalRef, setIntervalRef]     = useState(null)

  // ── Effect 1: Cleanup interval on unmount ──
  useEffect(() => {
    return () => {
      if (intervalRef) clearInterval(intervalRef)
    }
  }, [intervalRef])

  // ── Effect 2: Warn before leaving during analysis ──
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (loading) {
        e.preventDefault()
        e.returnValue = ''
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [loading])

  // ── Effect 3: Auto-load saved health profile ──
  // THIS MUST BE AT COMPONENT LEVEL — not inside any function
  useEffect(() => {
    const loadSavedProfile = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) return

        const response = await api.get('/profile/')
        const saved    = response.data?.healthProfile
        if (!saved) return

        // Profile saves {diabetic: true, hypertensive: false}
        // Scan needs single string 'diabetic'
        const activeEntry = Object.entries(saved).find(
          ([, val]) => val === true
        )

        if (activeEntry) {
          setHealthProfile(activeEntry[0])
          toast.success(
            `Profile loaded: ${
              activeEntry[0].replace(/_/g, ' ')
            }`,
            { duration: 2000, icon: '👤' }
          )
        } else {
          setHealthProfile('none')
        }

      } catch (error) {
        // Silently fail — user can manually select
      }
    }

    loadSavedProfile()
  }, []) // Empty array = runs once on mount

  // ── Handlers ──────────────────────────────

  const handleFileSelect = (slotId, selected) => {
    setFiles(prev => ({ ...prev, [slotId]: selected }))
    setPreviews(prev => ({
      ...prev,
      [slotId]: URL.createObjectURL(selected)
    }))
  }

  const handleRemove = (slotId) => {
    if (loading) {
      toast.error('Cannot remove images during analysis')
      return
    }
    setFiles(prev    => ({ ...prev, [slotId]: null }))
    setPreviews(prev => ({ ...prev, [slotId]: null }))
  }

  const handleModeChange = (newMode) => {
    if (loading) {
      toast.error('Cannot switch mode during analysis')
      return
    }
    setMode(newMode)
  }

  const handleProfileChange = (profileId) => {
    if (loading) {
      toast.error('Cannot change profile during analysis')
      return
    }
    setHealthProfile(profileId)
  }

  const simulateSteps = (selectedMode) => {
    let step    = 0
    const steps = selectedMode === 'research'
      ? researchSteps
      : productionSteps
    const delay = selectedMode === 'research' ? 5000 : 2000

    const interval = setInterval(() => {
      step++
      setCurrentStep(step)
      if (step >= steps.length - 1) {
        clearInterval(interval)
      }
    }, delay)

    setIntervalRef(interval)
    return interval
  }

  const handleAnalyze = async () => {
    if (!files.front) {
      toast.error(
        'Please upload the front label image — it is required'
      )
      return
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/webp']
    const allFiles   = Object.values(files).filter(Boolean)

    for (const file of allFiles) {
      if (!validTypes.includes(file.type)) {
        toast.error('Invalid file type — JPG, PNG or WEBP only')
        return
      }
    }

    setLoading(true)
    setCurrentStep(0)

    const interval = simulateSteps(mode)

    try {
      const formData = new FormData()
      formData.append('front_image', files.front)

      if (files.nutrition) {
        formData.append('nutrition_image', files.nutrition)
      }
      if (files.ingredients) {
        formData.append('ingredients_image', files.ingredients)
      }

      formData.append('health_profile', healthProfile)
      formData.append('mode', mode)

      const response = await api.post(
        '/scan/analyze',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          timeout: mode === 'research' ? 180000 : 45000
        }
      )

      clearInterval(interval)
      setCurrentStep(
        mode === 'research'
          ? researchSteps.length
          : productionSteps.length
      )

      toast.success('Analysis complete!')

      setTimeout(() => {
        navigate(
          `/results/${response.data.scanId}`,
          { state: response.data }
        )
      }, 800)

    } catch (error) {
      clearInterval(interval)
      setLoading(false)
      setCurrentStep(0)

      if (error.code === 'ECONNABORTED') {
        toast.error(
          mode === 'research'
            ? 'Research mode timed out — try again in 1 minute'
            : 'Request timed out — please try again'
        )
        return
      }

      if (error.response?.status === 401) {
        toast.error('Session expired — please login again')
        navigate('/login')
        return
      }

      if (error.response?.status === 503) {
        toast.error('AI service unavailable — try Production Mode')
        return
      }

      if (error.response?.status === 422) {
        toast.error('Please upload the front label image first')
        return
      }

      toast.error(
        error.response?.data?.detail ||
        'Analysis failed — please try again'
      )
    }
  }

  return (
    <div className="min-h-[90vh] py-12 px-4">
      <Toaster position="top-center" />

      <div className="absolute inset-0 bg-linear-to-br from-green-500/5 via-background to-background pointer-events-none" />

      <div className="max-w-3xl mx-auto relative space-y-8">

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 text-sm text-primary font-medium">
            <ScanLine className="h-4 w-4" />
            Label Scanner
          </div>
          <h1 className="text-3xl font-bold text-foreground">
            Scan Your Food Label
          </h1>
          <p className="text-muted-foreground">
            Upload up to 3 photos — front panel, nutrition
            table, and ingredients list for maximum accuracy
          </p>
        </div>

        <ImageUploader
          files={files}
          previews={previews}
          loading={loading}
          onFileSelect={handleFileSelect}
          onRemove={handleRemove}
        />

        <ModeSelector
          mode={mode}
          loading={loading}
          onModeChange={handleModeChange}
        />

        <HealthSelector
          healthProfile={healthProfile}
          loading={loading}
          onProfileChange={handleProfileChange}
        />

        {loading && (
          <AnalysisProgress
            mode={mode}
            currentStep={currentStep}
          />
        )}

        <ScanFooter
          mode={mode}
          loading={loading}
          file={files.front}
          onAnalyze={handleAnalyze}
        />

      </div>
    </div>
  )
}
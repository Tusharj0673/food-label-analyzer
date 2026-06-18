import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  ShieldCheck,
  Eye,
  EyeOff,
  Loader2,
  Check,
  X
} from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'
import api from '@/api/axios'
import { useGoogleAuth } from '@/hooks/useGoogleAuth'

// Password strength checker
const checkPasswordStrength = (password) => {
  const checks = {
    length:    password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number:    /[0-9]/.test(password),
  }
  const passed = Object.values(checks).filter(Boolean).length
  return { checks, strength: passed }
}

const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong']
const strengthColors = [
  '',
  'bg-red-500',
  'bg-yellow-500',
  'bg-blue-500',
  'bg-green-500'
]

export default function Register() {
  const navigate = useNavigate()
  const { signInWithGoogle } = useGoogleAuth()

  const [formData, setFormData] = useState({
    name:            '',
    email:           '',
    password:        '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword]        = useState(false)
  const [showConfirm, setShowConfirm]          = useState(false)
  const [loading, setLoading]                  = useState(false)
  const [passwordFocused, setPasswordFocused]  = useState(false)

  const { checks, strength } = checkPasswordStrength(
    formData.password
  )

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validation
    if (!formData.name ||
        !formData.email ||
        !formData.password ||
        !formData.confirmPassword) {
      toast.error('Please fill in all fields')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (strength < 2) {
      toast.error('Please choose a stronger password')
      return
    }

    setLoading(true)
    try {
      await api.post('/auth/register', {
        name:     formData.name,
        email:    formData.email,
        password: formData.password
      })

      toast.success('Account created successfully!')

      // Auto login after register
      const loginResponse = await api.post(
        '/auth/login',
        {
          email:    formData.email,
          password: formData.password
        }
      )

      localStorage.setItem(
        'token',
        loginResponse.data.token
      )
      localStorage.setItem(
        'user',
        JSON.stringify({
          name:  loginResponse.data.name,
          email: loginResponse.data.email
        })
      )

      setTimeout(() => navigate('/scan'), 1000)

    } catch (error) {
      const message = error.response?.data?.detail
        || 'Registration failed. Please try again.'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-12">
      <Toaster position="top-center" />

      {/* Background gradient */}
      <div className="absolute inset-0 bg-linear-to-br from-green-500/5 via-background to-background pointer-events-none" />

      <div className="w-full max-w-md relative">

        {/* Logo */}
        <div className="flex flex-col items-center mb-8 space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
            <ShieldCheck className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">LabelIQ</h1>
          <p className="text-sm text-muted-foreground">
            Verify food labels. Stay informed.
          </p>
        </div>

        <Card className="border-border/60 shadow-xl">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl font-bold">
              Create account
            </CardTitle>
            <CardDescription>
              Start verifying food labels for free
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">
                  Full Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Rush"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={loading}
                  className="h-11"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="rush@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                  className="h-11"
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                    disabled={loading}
                    className="h-11 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword
                      ? <EyeOff className="h-4 w-4" />
                      : <Eye className="h-4 w-4" />
                    }
                  </button>
                </div>

                {/* Password strength bar */}
                {formData.password && (
                  <div className="space-y-2">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map(level => (
                        <div
                          key={level}
                          className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                            level <= strength
                              ? strengthColors[strength]
                              : 'bg-border'
                          }`}
                        />
                      ))}
                    </div>
                    <p className={`text-xs ${
                      strength <= 1
                        ? 'text-red-500'
                        : strength === 2
                        ? 'text-yellow-500'
                        : strength === 3
                        ? 'text-blue-500'
                        : 'text-green-500'
                    }`}>
                      {strengthLabels[strength]} password
                    </p>
                  </div>
                )}

                {/* Password requirements */}
                {(passwordFocused || formData.password) && (
                  <div className="grid grid-cols-2 gap-1 pt-1">
                    {[
                      { key: 'length',    label: '8+ characters' },
                      { key: 'uppercase', label: 'Uppercase letter' },
                      { key: 'lowercase', label: 'Lowercase letter' },
                      { key: 'number',    label: 'Number' },
                    ].map(req => (
                      <div
                        key={req.key}
                        className="flex items-center gap-1.5"
                      >
                        {checks[req.key]
                          ? <Check className="h-3 w-3 text-green-500" />
                          : <X className="h-3 w-3 text-muted-foreground" />
                        }
                        <span className={`text-xs ${
                          checks[req.key]
                            ? 'text-green-500'
                            : 'text-muted-foreground'
                        }`}>
                          {req.label}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="Repeat your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={loading}
                    className={`h-11 pr-10 ${
                      formData.confirmPassword &&
                      formData.password !== formData.confirmPassword
                        ? 'border-red-500 focus-visible:ring-red-500'
                        : formData.confirmPassword &&
                          formData.password === formData.confirmPassword
                        ? 'border-green-500 focus-visible:ring-green-500'
                        : ''
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirm(!showConfirm)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showConfirm
                      ? <EyeOff className="h-4 w-4" />
                      : <Eye className="h-4 w-4" />
                    }
                  </button>
                </div>

                {/* Match indicator */}
                {formData.confirmPassword && (
                  <p className={`text-xs flex items-center gap-1 ${
                    formData.password === formData.confirmPassword
                      ? 'text-green-500'
                      : 'text-red-500'
                  }`}>
                    {formData.password === formData.confirmPassword
                      ? <><Check className="h-3 w-3" /> Passwords match</>
                      : <><X className="h-3 w-3" /> Passwords do not match</>
                    }
                  </p>
                )}
              </div>

              {/* Submit */}
              <Button
                type="submit"
                className="w-full h-11"
                disabled={loading}
              >
                {loading
                  ? <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating account...
                    </>
                  : 'Create Account'
                }
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  or
                </span>
              </div>
            </div>

            {/* Google placeholder */}
           <Button
  type="button"
  variant="outline"
  className="w-full h-11 gap-3"
  onClick={signInWithGoogle}
  disabled={loading}
>
  <svg className="h-4 w-4" viewBox="0 0 24 24">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
  Continue with Google
</Button>
          </CardContent>

          <CardFooter className="pt-0">
            <p className="text-sm text-muted-foreground text-center w-full">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-primary hover:underline font-medium"
              >
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
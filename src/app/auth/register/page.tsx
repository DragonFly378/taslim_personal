'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BookOpen, User, Mail, Lock, CheckCircle2 } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export default function RegisterPage() {
  const { t } = useLanguage()
  const router = useRouter()
  const [formData, setFormData] = useState({
    fullName: '',
    gender: '',
    email: '',
    password: '',
    retypePassword: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    const newFormData = { ...formData, [name]: value }
    setFormData(newFormData)

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }

    // Real-time validation for password match
    if (name === 'password' || name === 'retypePassword') {
      // Check if passwords match when both fields have values
      if (newFormData.password && newFormData.retypePassword) {
        if (newFormData.password === newFormData.retypePassword) {
          setErrors(prev => ({ ...prev, retypePassword: '' }))
        } else if (errors.retypePassword !== t.auth.register.errors.passwordMismatch) {
          setErrors(prev => ({
            ...prev,
            retypePassword: t.auth.register.errors.passwordMismatch
          }))
        }
      }
    }
  }

  const validate = (showAllErrors = true) => {
    const newErrors: Record<string, string> = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = t.auth.register.errors.fullNameRequired
    } else if (formData.fullName.trim().length < 3) {
      newErrors.fullName = t.auth.register.errors.fullNameMin
    }

    if (!formData.gender) {
      newErrors.gender = t.auth.register.errors.genderRequired
    }

    if (!formData.email.trim()) {
      newErrors.email = t.auth.register.errors.emailRequired
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t.auth.register.errors.emailInvalid
    }

    if (!formData.password) {
      newErrors.password = t.auth.register.errors.passwordRequired
    } else if (formData.password.length < 8) {
      newErrors.password = t.auth.register.errors.passwordMin
    }

    // Always validate retype password if either password field has a value
    if (formData.password || formData.retypePassword) {
      if (!formData.retypePassword) {
        newErrors.retypePassword = t.auth.register.errors.retypePasswordRequired
      } else if (formData.password !== formData.retypePassword) {
        newErrors.retypePassword = t.auth.register.errors.passwordMismatch
      }
    }

    if (showAllErrors) {
      setErrors(newErrors)
    }
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted', formData)

    if (!validate()) {
      console.log('Validation failed', errors)
      return
    }

    setIsLoading(true)
    console.log('Submitting to API...')

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.fullName,
          gender: formData.gender,
          email: formData.email,
          password: formData.password
        })
      })

      const data = await response.json()

      if (!response.ok) {
        setErrors({ submit: data.error || t.auth.register.errors.registrationFailed || 'Registration failed' })
        return
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/auth/signin')
      }, 2000)
    } catch (error) {
      setErrors({ submit: t.auth.register.errors.errorOccurred || 'An error occurred. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Card className="w-full max-w-md card-glow border-2">
          <div className="h-2 bg-gradient-to-r from-primary via-secondary to-primary" />
          <CardContent className="pt-12 pb-8">
            <div className="text-center">
              <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-primary to-secondary rounded-full mx-auto mb-6 shadow-lg">
                <CheckCircle2 className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-3 text-foreground">{t.auth.register.success}</h2>
              <p className="text-muted-foreground mb-6">
                {t.auth.register.successMessage}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12">
      <Card className="w-full max-w-md card-glow border-2">
        <div className="h-2 bg-gradient-to-r from-primary via-secondary to-primary" />
        <CardHeader className="text-center pb-4">
          <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-primary to-secondary rounded-2xl mx-auto mb-4 shadow-lg">
            <BookOpen className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl">{t.auth.register.title}</CardTitle>
          <CardDescription className="text-base">
            {t.auth.register.subtitle}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium mb-2">
                {t.auth.register.fullName} <span className="text-destructive">{t.common.required}</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder={t.auth.register.fullNamePlaceholder}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.fullName ? 'border-destructive' : 'border-input'
                  }`}
                />
              </div>
              {errors.fullName && (
                <p className="text-sm text-destructive mt-1">{errors.fullName}</p>
              )}
            </div>

            {/* Gender */}
            <div>
              <label htmlFor="gender" className="block text-sm font-medium mb-2">
                {t.auth.register.gender} <span className="text-destructive">{t.common.required}</span>
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.gender ? 'border-destructive' : 'border-input'
                }`}
              >
                <option value="">{t.auth.register.genderPlaceholder}</option>
                <option value="male">{t.auth.register.male}</option>
                <option value="female">{t.auth.register.female}</option>
              </select>
              {errors.gender && (
                <p className="text-sm text-destructive mt-1">{errors.gender}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                {t.auth.register.email} <span className="text-destructive">{t.common.required}</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={t.auth.register.emailPlaceholder}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.email ? 'border-destructive' : 'border-input'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-destructive mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                {t.auth.register.password} <span className="text-destructive">{t.common.required}</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={t.auth.register.passwordPlaceholder}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.password ? 'border-destructive' : 'border-input'
                  }`}
                />
              </div>
              {errors.password && (
                <p className="text-sm text-destructive mt-1">{errors.password}</p>
              )}
            </div>

            {/* Retype Password */}
            <div>
              <label htmlFor="retypePassword" className="block text-sm font-medium mb-2">
                {t.auth.register.retypePassword} <span className="text-destructive">{t.common.required}</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="password"
                  id="retypePassword"
                  name="retypePassword"
                  value={formData.retypePassword}
                  onChange={handleChange}
                  placeholder={t.auth.register.retypePasswordPlaceholder}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.retypePassword ? 'border-destructive' : 'border-input'
                  }`}
                />
              </div>
              {errors.retypePassword && (
                <p className="text-sm text-destructive mt-1">{errors.retypePassword}</p>
              )}
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-sm text-destructive">{errors.submit}</p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? t.auth.register.creatingAccount : t.auth.register.createAccount}
            </Button>
          </form>

          {/* Sign In Link */}
          <div className="text-center text-sm text-muted-foreground pt-6">
            <p>
              {t.auth.register.alreadyHaveAccount}{' '}
              <Link href="/auth/signin" className="text-primary font-semibold hover:underline">
                {t.auth.register.signInLink}
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

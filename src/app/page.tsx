'use client'

import Link from 'next/link'
import { BookOpen, BookMarked, Heart, ArrowRight, Globe, Smartphone, Cloud, Lock, Zap, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LastReadBanner } from '@/components/LastReadBanner'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export default function HomePage() {
  const { t } = useLanguage()
  const features = [
    {
      icon: BookOpen,
      title: t.home.features.readQuran.title,
      description: t.home.features.readQuran.description,
      href: '/quran',
      gradient: 'from-primary to-secondary'
    },
    {
      icon: BookMarked,
      title: t.home.features.dailyDuas.title,
      description: t.home.features.dailyDuas.description,
      href: '/duas',
      gradient: 'from-secondary to-primary'
    },
    {
      icon: Heart,
      title: t.home.features.bookmarks.title,
      description: t.home.features.bookmarks.description,
      href: '/bookmarks',
      gradient: 'from-primary/80 to-secondary/80'
    }
  ]

  const additionalFeatures = [
    {
      icon: Smartphone,
      title: t.home.moreFeatures.mobile.title,
      description: t.home.moreFeatures.mobile.description
    },
    {
      icon: Cloud,
      title: t.home.moreFeatures.cloud.title,
      description: t.home.moreFeatures.cloud.description
    },
    {
      icon: Lock,
      title: t.home.moreFeatures.privacy.title,
      description: t.home.moreFeatures.privacy.description
    },
    {
      icon: Zap,
      title: t.home.moreFeatures.fast.title,
      description: t.home.moreFeatures.fast.description
    },
    {
      icon: Globe,
      title: t.home.moreFeatures.language.title,
      description: t.home.moreFeatures.language.description
    },
    {
      icon: Users,
      title: t.home.moreFeatures.community.title,
      description: t.home.moreFeatures.community.description
    }
  ]

  const stats = [
    t.home.stats.surahs,
    t.home.stats.ayahs,
    t.home.stats.free,
    t.home.stats.access
  ]

  return (
    <div>
      <LastReadBanner />

      {/* Hero Section */}
      <div className="relative mb-20 overflow-hidden">
        {/* Animated Background Gradients */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute inset-0 islamic-pattern opacity-20" />
        </div>

        <div className="relative py-16 md:py-24">
          {/* Decorative Arabic Calligraphy */}
          <div className="text-center mb-6 md:mb-8">
            <div className="font-arabic text-5xl md:text-6xl lg:text-8xl text-primary/10 select-none" dir="rtl" lang="ar">
              ﷽
            </div>
          </div>

          {/* Main Content */}
          <div className="text-center space-y-4 sm:space-y-6 max-w-4xl mx-auto px-4">
            <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-bold mb-4 sm:mb-6 gradient-text animate-fade-in">
              {t.home.title}
            </h1>

            <p className="text-base sm:text-xl md:text-2xl lg:text-3xl text-muted-foreground max-w-3xl mx-auto text-balance leading-relaxed">
              {t.home.subtitle}
            </p>

            <div className="inline-block">
              <p className="text-sm sm:text-lg md:text-xl text-primary italic px-4 sm:px-6 py-2 sm:py-3 bg-primary/5 rounded-full border border-primary/20">
                {t.home.tagline}
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-6 sm:pt-8 w-full sm:w-auto px-4 sm:px-0">
              <Button
                asChild
                size="lg"
                className="text-base sm:text-lg px-8 sm:px-10 py-6 sm:py-7 shadow-2xl shadow-primary/30 hover:shadow-primary/50 hover:scale-105 transition-all duration-300 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 w-full sm:w-auto"
              >
                <Link href="/quran">
                  <BookOpen className="mr-2 h-5 w-5 sm:h-6 sm:w-6" />
                  {t.home.startReading}
                  <ArrowRight className="ml-2 h-5 w-5 sm:h-6 sm:w-6" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="text-base sm:text-lg px-8 sm:px-10 py-6 sm:py-7 border-2 border-primary/30 hover:bg-gradient-to-r hover:from-primary/10 hover:to-secondary/10 hover:border-primary hover:scale-105 transition-all duration-300 w-full sm:w-auto"
              >
                <Link href="/duas">
                  <BookMarked className="mr-2 h-5 w-5 sm:h-6 sm:w-6" />
                  {t.home.browseDuas}
                </Link>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 pt-8 text-xs md:text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span>100% Free</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse delay-200" />
                <span>No Ads</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-500" />
                <span>Works Offline</span>
              </div>
            </div>
          </div>

          {/* Decorative Bottom Element */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        {features.map((feature) => {
          const Icon = feature.icon
          return (
            <Link key={feature.href} href={feature.href} className="group">
              <Card className="h-full card-glow border-2 hover:border-primary/30 transition-all duration-300 overflow-hidden">
                <div className={`h-2 bg-gradient-to-r ${feature.gradient}`} />
                <CardHeader className="pb-4">
                  <div className={`w-16 h-16 flex items-center justify-center bg-gradient-to-br ${feature.gradient} rounded-2xl mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">{feature.title}</CardTitle>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <span className="text-sm text-primary font-semibold inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                    {t.common.explore}
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      {/* Stats Section */}
      <div className="mb-16 sm:mb-20 relative">
        {/* Decorative Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/5 rounded-full blur-3xl" />
        </div>

        <div className="text-center mb-8 sm:mb-12 px-4">
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-3 sm:mb-4 gradient-text">
            {t.home.stats.title}
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            {t.home.stats.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <Card key={index} className="relative text-center p-4 sm:p-6 md:p-8 bg-gradient-to-br from-primary/10 via-primary/5 to-secondary/10 border-2 border-primary/20 hover:border-primary/40 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-primary/20 group overflow-hidden">
              {/* Animated Background Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-secondary/0 group-hover:from-primary/20 group-hover:to-secondary/20 transition-all duration-500" />

              <CardContent className="p-0 relative z-10">
                <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-br from-primary to-secondary bg-clip-text text-transparent mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-300">
                  {stat.number}
                </div>
                <div className="text-sm sm:text-base md:text-xl font-bold text-foreground mb-1 sm:mb-2 group-hover:text-primary transition-colors">
                  {stat.label}
                </div>
                <div className="text-xs sm:text-sm md:text-base text-muted-foreground">
                  {stat.description}
                </div>
              </CardContent>

              {/* Decorative Corner */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </Card>
          ))}
        </div>
      </div>

      {/* Additional Features */}
      <div className="mb-16">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-3 sm:mb-4 gradient-text px-4">
          {t.home.moreFeatures.title}
        </h2>
        <p className="text-center text-muted-foreground text-sm sm:text-base md:text-lg mb-8 sm:mb-10 max-w-3xl mx-auto px-4">
          {t.home.moreFeatures.subtitle}
        </p>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {additionalFeatures.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card key={index} className="border-2 hover:border-primary/30 transition-all duration-300 group">
                <CardHeader>
                  <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl mb-3 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Info Section */}
      <Card className="card-glow border-2 overflow-hidden mb-16">
        <div className="h-2 bg-gradient-to-r from-primary via-secondary to-primary" />
        <CardHeader className="bg-gradient-to-br from-primary/5 to-secondary/5">
          <CardTitle className="text-xl sm:text-2xl">{t.home.whyChoose.title}</CardTitle>
          <CardDescription className="text-sm sm:text-base">
            {t.home.whyChoose.subtitle}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <ul className="grid md:grid-cols-2 gap-3 sm:gap-4">
            <li className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg hover:bg-primary/5 transition-colors">
              <span className="text-primary text-lg sm:text-xl mt-0.5 flex-shrink-0">✓</span>
              <span className="text-sm sm:text-base"><strong className="text-primary">{t.home.whyChoose.guestMode.label}</strong> {t.home.whyChoose.guestMode.text}</span>
            </li>
            <li className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg hover:bg-primary/5 transition-colors">
              <span className="text-primary text-lg sm:text-xl mt-0.5 flex-shrink-0">✓</span>
              <span className="text-sm sm:text-base"><strong className="text-primary">{t.home.whyChoose.autoTracking.label}</strong> {t.home.whyChoose.autoTracking.text}</span>
            </li>
            <li className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg hover:bg-primary/5 transition-colors">
              <span className="text-primary text-lg sm:text-xl mt-0.5 flex-shrink-0">✓</span>
              <span className="text-sm sm:text-base"><strong className="text-primary">{t.home.whyChoose.accountMerge.label}</strong> {t.home.whyChoose.accountMerge.text}</span>
            </li>
            <li className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg hover:bg-primary/5 transition-colors">
              <span className="text-primary text-lg sm:text-xl mt-0.5 flex-shrink-0">✓</span>
              <span className="text-sm sm:text-base"><strong className="text-primary">{t.home.whyChoose.multiLanguage.label}</strong> {t.home.whyChoose.multiLanguage.text}</span>
            </li>
            <li className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg hover:bg-primary/5 transition-colors">
              <span className="text-primary text-lg sm:text-xl mt-0.5 flex-shrink-0">✓</span>
              <span className="text-sm sm:text-base"><strong className="text-primary">{t.home.whyChoose.responsive.label}</strong> {t.home.whyChoose.responsive.text}</span>
            </li>
            <li className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg hover:bg-primary/5 transition-colors">
              <span className="text-primary text-lg sm:text-xl mt-0.5 flex-shrink-0">✓</span>
              <span className="text-sm sm:text-base"><strong className="text-primary">{t.home.whyChoose.updated.label}</strong> {t.home.whyChoose.updated.text}</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Testimonial Section */}
      <Card className="card-glow border-2 overflow-hidden mb-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="h-2 bg-gradient-to-r from-primary to-secondary" />
        <CardContent className="p-8 md:p-12 text-center">
          <div className="font-arabic text-4xl md:text-5xl text-secondary-900 dark:text-primary-100 mb-6" dir="rtl" lang="ar">
            {t.home.bismillah.arabic}
          </div>
          <p className="text-lg md:text-xl text-muted-foreground italic mb-4">
            "{t.home.bismillah.translation}"
          </p>
          <p className="text-base text-muted-foreground max-w-3xl mx-auto">
            {t.home.bismillah.description}
          </p>
        </CardContent>
      </Card>

      {/* CTA Section */}
      <Card className="card-glow border-2 overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-primary via-secondary to-primary" />
        <CardContent className="p-8 md:p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">
            {t.home.cta.title}
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            {t.home.cta.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8 py-6 shadow-lg shadow-primary/20">
              <Link href="/auth/register">
                <Users className="mr-2 h-5 w-5" />
                {t.home.cta.createAccount}
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6 border-2">
              <Link href="/quran">
                <BookOpen className="mr-2 h-5 w-5" />
                {t.home.cta.browseQuran}
              </Link>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-6">
            {t.home.cta.note}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

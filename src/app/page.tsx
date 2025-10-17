'use client'

import Link from 'next/link'
import { BookOpen, BookMarked, Heart, ArrowRight, Globe, Smartphone, Cloud, Lock, Zap, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import PrayerTimesCard from '@/components/PrayerTimesCard'

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
    <div className="pb-8">
      {/* Hero Section */}
      <div className="relative mb-12 sm:mb-16 md:mb-20 overflow-hidden">
        {/* Animated Background Gradients */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute inset-0 islamic-pattern opacity-10 sm:opacity-20" />
        </div>

        <div className="relative py-12 sm:py-16 md:py-24">
          {/* Decorative Arabic Calligraphy */}
          <div className="text-center mb-4 sm:mb-6 md:mb-8">
            <div className="font-arabic text-4xl sm:text-5xl md:text-6xl lg:text-8xl text-primary/10 select-none" dir="rtl" lang="ar">
              ﷽
            </div>
          </div>

          {/* Main Content */}
          <div className="text-center space-y-3 sm:space-y-4 md:space-y-6 max-w-4xl mx-auto px-4">
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-8xl font-bold mb-3 sm:mb-4 md:mb-6 gradient-text animate-fade-in leading-tight">
              {t.home.title}
            </h1>

            <p className="text-sm sm:text-base md:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto text-balance leading-relaxed px-2">
              {t.home.subtitle}
            </p>

            <div className="inline-block px-2">
              <p className="text-xs sm:text-sm md:text-base lg:text-xl text-primary italic px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 md:py-3 bg-primary/5 rounded-full border border-primary/20">
                {t.home.tagline}
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 md:gap-4 justify-center pt-4 sm:pt-6 md:pt-8 w-full sm:w-auto">
              <Button
                asChild
                size="lg"
                className="text-sm sm:text-base md:text-lg px-6 sm:px-8 md:px-10 py-5 sm:py-6 md:py-7 shadow-2xl shadow-primary/30 hover:shadow-primary/50 active:scale-95 sm:hover:scale-105 transition-all duration-300 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 w-full sm:w-auto"
              >
                <Link href="/quran">
                  <BookOpen className="mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                  {t.home.startReading}
                  <ArrowRight className="ml-1.5 sm:ml-2 h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="text-sm sm:text-base md:text-lg px-6 sm:px-8 md:px-10 py-5 sm:py-6 md:py-7 border-2 border-primary/30 hover:bg-gradient-to-r hover:from-primary/10 hover:to-secondary/10 hover:border-primary active:scale-95 sm:hover:scale-105 transition-all duration-300 w-full sm:w-auto"
              >
                <Link href="/duas">
                  <BookMarked className="mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                  {t.home.browseDuas}
                </Link>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-6 pt-6 sm:pt-8 text-xs sm:text-sm md:text-base text-muted-foreground px-2">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span>100% Free</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-teal-500 rounded-full animate-pulse delay-200" />
                <span>No Ads</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full animate-pulse delay-500" />
                <span>Works Offline</span>
              </div>
            </div>
          </div>

          {/* Decorative Bottom Element */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        </div>
      </div>

      {/* Prayer Times Card */}
      <div className="mb-8 sm:mb-10 md:mb-12">
        <PrayerTimesCard />
      </div>

      {/* Features Grid */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-12 sm:mb-14 md:mb-16">
        {features.map((feature) => {
          const Icon = feature.icon
          return (
            <Link key={feature.href} href={feature.href} className="group">
              <Card className="h-full card-glow border-2 hover:border-primary/30 active:border-primary/50 transition-all duration-300 overflow-hidden">
                <div className={`h-1.5 sm:h-2 bg-gradient-to-r ${feature.gradient}`} />
                <CardHeader className="pb-3 sm:pb-4 pt-4 sm:pt-6">
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex items-center justify-center bg-gradient-to-br ${feature.gradient} rounded-xl sm:rounded-2xl mb-3 sm:mb-4 shadow-lg group-hover:scale-110 group-active:scale-95 transition-transform duration-300`}>
                    <Icon className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-white" />
                  </div>
                  <CardTitle className="text-base sm:text-lg md:text-xl group-hover:text-primary transition-colors">{feature.title}</CardTitle>
                  <CardDescription className="text-xs sm:text-sm md:text-base">{feature.description}</CardDescription>
                </CardHeader>
                <CardContent className="pb-4 sm:pb-6">
                  <span className="text-xs sm:text-sm text-primary font-semibold inline-flex items-center gap-1.5 sm:gap-2 group-hover:gap-3 transition-all">
                    {t.common.explore}
                    <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      {/* Stats Section */}
      <div className="mb-12 sm:mb-16 md:mb-20 relative">
        {/* Decorative Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[600px] h-[300px] sm:h-[400px] bg-primary/5 rounded-full blur-3xl" />
        </div>

        <div className="text-center mb-6 sm:mb-8 md:mb-12 px-4">
          <h2 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3 md:mb-4 gradient-text">
            {t.home.stats.title}
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
            {t.home.stats.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
          {stats.map((stat, index) => (
            <Card key={index} className="relative text-center p-3 sm:p-4 md:p-6 lg:p-8 bg-gradient-to-br from-primary/10 via-primary/5 to-secondary/10 border-2 border-primary/20 hover:border-primary/40 active:border-primary/50 transition-all duration-500 hover:scale-105 active:scale-95 hover:shadow-2xl hover:shadow-primary/20 group overflow-hidden">
              {/* Animated Background Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-secondary/0 group-hover:from-primary/20 group-hover:to-secondary/20 transition-all duration-500" />

              <CardContent className="p-0 relative z-10">
                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold bg-gradient-to-br from-primary to-secondary bg-clip-text text-transparent mb-1.5 sm:mb-2 md:mb-3 group-hover:scale-110 transition-transform duration-300 leading-tight">
                  {stat.number}
                </div>
                <div className="text-xs sm:text-sm md:text-base lg:text-xl font-bold text-foreground mb-0.5 sm:mb-1 md:mb-2 group-hover:text-primary transition-colors">
                  {stat.label}
                </div>
                <div className="text-[10px] sm:text-xs md:text-sm lg:text-base text-muted-foreground leading-tight">
                  {stat.description}
                </div>
              </CardContent>

              {/* Decorative Corner */}
              <div className="absolute top-0 right-0 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-gradient-to-br from-primary/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </Card>
          ))}
        </div>
      </div>

      {/* Additional Features */}
      <div className="mb-12 sm:mb-14 md:mb-16">
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-2 sm:mb-3 md:mb-4 gradient-text px-4">
          {t.home.moreFeatures.title}
        </h2>
        <p className="text-center text-muted-foreground text-xs sm:text-sm md:text-base lg:text-lg mb-6 sm:mb-8 md:mb-10 max-w-3xl mx-auto px-4">
          {t.home.moreFeatures.subtitle}
        </p>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          {additionalFeatures.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card key={index} className="border-2 hover:border-primary/30 active:border-primary/50 transition-all duration-300 group">
                <CardHeader className="p-4 sm:p-5 md:p-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg sm:rounded-xl mb-2 sm:mb-3 group-hover:scale-110 group-active:scale-95 transition-transform duration-300">
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                  </div>
                  <CardTitle className="text-sm sm:text-base md:text-lg">{feature.title}</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Info Section */}
      <Card className="card-glow border-2 overflow-hidden mb-10 sm:mb-12 md:mb-16">
        <div className="h-1.5 sm:h-2 bg-gradient-to-r from-primary via-secondary to-primary" />
        <CardHeader className="bg-gradient-to-br from-primary/5 to-secondary/5 p-4 sm:p-5 md:p-6">
          <CardTitle className="text-lg sm:text-xl md:text-2xl">{t.home.whyChoose.title}</CardTitle>
          <CardDescription className="text-xs sm:text-sm md:text-base">
            {t.home.whyChoose.subtitle}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4 sm:pt-5 md:pt-6 p-4 sm:p-5 md:p-6">
          <ul className="grid md:grid-cols-2 gap-2 sm:gap-3 md:gap-4">
            <li className="flex items-start gap-2 sm:gap-2.5 md:gap-3 p-2 sm:p-2.5 md:p-3 rounded-lg hover:bg-primary/5 active:bg-primary/10 transition-colors">
              <span className="text-primary text-base sm:text-lg md:text-xl mt-0.5 flex-shrink-0">✓</span>
              <span className="text-xs sm:text-sm md:text-base"><strong className="text-primary">{t.home.whyChoose.guestMode.label}</strong> {t.home.whyChoose.guestMode.text}</span>
            </li>
            <li className="flex items-start gap-2 sm:gap-2.5 md:gap-3 p-2 sm:p-2.5 md:p-3 rounded-lg hover:bg-primary/5 active:bg-primary/10 transition-colors">
              <span className="text-primary text-base sm:text-lg md:text-xl mt-0.5 flex-shrink-0">✓</span>
              <span className="text-xs sm:text-sm md:text-base"><strong className="text-primary">{t.home.whyChoose.autoTracking.label}</strong> {t.home.whyChoose.autoTracking.text}</span>
            </li>
            <li className="flex items-start gap-2 sm:gap-2.5 md:gap-3 p-2 sm:p-2.5 md:p-3 rounded-lg hover:bg-primary/5 active:bg-primary/10 transition-colors">
              <span className="text-primary text-base sm:text-lg md:text-xl mt-0.5 flex-shrink-0">✓</span>
              <span className="text-xs sm:text-sm md:text-base"><strong className="text-primary">{t.home.whyChoose.accountMerge.label}</strong> {t.home.whyChoose.accountMerge.text}</span>
            </li>
            <li className="flex items-start gap-2 sm:gap-2.5 md:gap-3 p-2 sm:p-2.5 md:p-3 rounded-lg hover:bg-primary/5 active:bg-primary/10 transition-colors">
              <span className="text-primary text-base sm:text-lg md:text-xl mt-0.5 flex-shrink-0">✓</span>
              <span className="text-xs sm:text-sm md:text-base"><strong className="text-primary">{t.home.whyChoose.multiLanguage.label}</strong> {t.home.whyChoose.multiLanguage.text}</span>
            </li>
            <li className="flex items-start gap-2 sm:gap-2.5 md:gap-3 p-2 sm:p-2.5 md:p-3 rounded-lg hover:bg-primary/5 active:bg-primary/10 transition-colors">
              <span className="text-primary text-base sm:text-lg md:text-xl mt-0.5 flex-shrink-0">✓</span>
              <span className="text-xs sm:text-sm md:text-base"><strong className="text-primary">{t.home.whyChoose.responsive.label}</strong> {t.home.whyChoose.responsive.text}</span>
            </li>
            <li className="flex items-start gap-2 sm:gap-2.5 md:gap-3 p-2 sm:p-2.5 md:p-3 rounded-lg hover:bg-primary/5 active:bg-primary/10 transition-colors">
              <span className="text-primary text-base sm:text-lg md:text-xl mt-0.5 flex-shrink-0">✓</span>
              <span className="text-xs sm:text-sm md:text-base"><strong className="text-primary">{t.home.whyChoose.updated.label}</strong> {t.home.whyChoose.updated.text}</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Testimonial Section */}
      <Card className="card-glow border-2 overflow-hidden mb-10 sm:mb-12 md:mb-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="h-1.5 sm:h-2 bg-gradient-to-r from-primary to-secondary" />
        <CardContent className="p-6 sm:p-8 md:p-10 lg:p-12 text-center">
          <div className="font-arabic text-3xl sm:text-4xl md:text-5xl text-secondary-900 dark:text-primary-100 mb-4 sm:mb-5 md:mb-6" dir="rtl" lang="ar">
            {t.home.bismillah.arabic}
          </div>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground italic mb-3 sm:mb-4 px-2">
            "{t.home.bismillah.translation}"
          </p>
          <p className="text-xs sm:text-sm md:text-base text-muted-foreground max-w-3xl mx-auto px-2">
            {t.home.bismillah.description}
          </p>
        </CardContent>
      </Card>

      {/* CTA Section */}
      <Card className="card-glow border-2 overflow-hidden">
        <div className="h-1.5 sm:h-2 bg-gradient-to-r from-primary via-secondary to-primary" />
        <CardContent className="p-6 sm:p-8 md:p-10 lg:p-12 text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 gradient-text px-2">
            {t.home.cta.title}
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-6 sm:mb-7 md:mb-8 max-w-2xl mx-auto px-2">
            {t.home.cta.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Button asChild size="lg" className="text-sm sm:text-base md:text-lg px-6 sm:px-7 md:px-8 py-5 sm:py-5.5 md:py-6 shadow-lg shadow-primary/20 active:scale-95 sm:hover:scale-105 transition-all w-full sm:w-auto">
              <Link href="/auth/register">
                <Users className="mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                {t.home.cta.createAccount}
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-sm sm:text-base md:text-lg px-6 sm:px-7 md:px-8 py-5 sm:py-5.5 md:py-6 border-2 active:scale-95 sm:hover:scale-105 transition-all w-full sm:w-auto">
              <Link href="/quran">
                <BookOpen className="mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                {t.home.cta.browseQuran}
              </Link>
            </Button>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-4 sm:mt-5 md:mt-6 px-2">
            {t.home.cta.note}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

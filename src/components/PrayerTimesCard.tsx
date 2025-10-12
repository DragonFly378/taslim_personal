'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Clock, MapPin, ArrowRight, Loader2 } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/LanguageContext'

interface PrayerTimes {
  Fajr: string
  Dhuhr: string
  Asr: string
  Maghrib: string
  Isha: string
}

interface HijriDate {
  day: string
  month: {
    en: string
    ar: string
  }
  year: string
}

interface GregorianDate {
  day: string
  month: {
    en: string
  }
  year: string
}

export default function PrayerTimesCard() {
  const { language } = useLanguage()
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null)
  const [location, setLocation] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [nextPrayer, setNextPrayer] = useState<string | null>(null)
  const [hijriDate, setHijriDate] = useState<HijriDate | null>(null)
  const [gregorianDate, setGregorianDate] = useState<GregorianDate | null>(null)

  const prayerNames = {
    Fajr: { en: 'Fajr', id: 'Subuh' },
    Dhuhr: { en: 'Dhuhr', id: 'Dzuhur' },
    Asr: { en: 'Asr', id: 'Ashar' },
    Maghrib: { en: 'Maghrib', id: 'Maghrib' },
    Isha: { en: 'Isha', id: 'Isya' }
  }

  const formatTime = (time: string) => {
    return time.split(' ')[0]
  }

  const getNextPrayer = (times: PrayerTimes) => {
    const now = new Date()
    const currentMinutes = now.getHours() * 60 + now.getMinutes()

    const prayerOrder: (keyof PrayerTimes)[] = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']

    for (const prayer of prayerOrder) {
      const time = formatTime(times[prayer])
      const [hours, minutes] = time.split(':').map(Number)
      const prayerMinutes = hours * 60 + minutes

      if (prayerMinutes > currentMinutes) {
        return prayer
      }
    }

    return 'Fajr' // Next day
  }

  useEffect(() => {
    const fetchPrayerTimes = async () => {
      try {
        if (!navigator.geolocation) {
          setLoading(false)
          return
        }

        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords

            // Fetch location name
            try {
              const geoResponse = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=en`
              )
              const geoData = await geoResponse.json()
              const city = geoData.address.city || geoData.address.town || geoData.address.village || 'Your Location'
              setLocation(city)
            } catch {
              setLocation('Your Location')
            }

            // Fetch prayer times
            const response = await fetch(`/api/prayer-times?latitude=${latitude}&longitude=${longitude}`)
            const data = await response.json()

            if (data.success) {
              const times: PrayerTimes = {
                Fajr: data.data.timings.Fajr,
                Dhuhr: data.data.timings.Dhuhr,
                Asr: data.data.timings.Asr,
                Maghrib: data.data.timings.Maghrib,
                Isha: data.data.timings.Isha
              }
              setPrayerTimes(times)
              setNextPrayer(getNextPrayer(times))

              // Set Hijri date
              setHijriDate({
                day: data.data.date.hijri.day,
                month: {
                  en: data.data.date.hijri.month.en,
                  ar: data.data.date.hijri.month.ar
                },
                year: data.data.date.hijri.year
              })

              // Set Gregorian date
              setGregorianDate({
                day: data.data.date.gregorian.day,
                month: {
                  en: data.data.date.gregorian.month.en
                },
                year: data.data.date.gregorian.year
              })
            }

            setLoading(false)
          },
          () => {
            setLoading(false)
          }
        )
      } catch {
        setLoading(false)
      }
    }

    fetchPrayerTimes()
  }, [])

  if (loading) {
    return (
      <Card className="border-2 border-primary/20 overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-emerald-500 to-teal-600" />
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Clock className="w-5 h-5 text-primary" />
            {language === 'en' ? 'Prayer Times' : 'Waktu Sholat'}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </CardContent>
      </Card>
    )
  }

  if (!prayerTimes) {
    return (
      <Card className="border-2 border-primary/20 overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-emerald-500 to-teal-600" />
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Clock className="w-5 h-5 text-primary" />
            {language === 'en' ? 'Prayer Times' : 'Waktu Sholat'}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-6">
          <p className="text-sm text-muted-foreground mb-4">
            {language === 'en'
              ? 'Enable location access to see prayer times'
              : 'Aktifkan akses lokasi untuk melihat waktu sholat'}
          </p>
          <Button asChild variant="outline" size="sm">
            <Link href="/waktu-sholat">
              {language === 'en' ? 'View Prayer Times' : 'Lihat Waktu Sholat'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-2 border-primary/20 overflow-hidden hover:border-primary/40 transition-all duration-300 shadow-sm">
      <div className="h-1 sm:h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600" />
      <CardHeader className="pb-3 sm:pb-3 px-4 sm:px-6 pt-4 sm:pt-6">
        <div className="flex items-start justify-between gap-2 sm:gap-3">
          <div className="flex flex-col gap-1 min-w-0">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg md:text-xl">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 flex-shrink-0" />
              <span className="leading-tight">
                {language === 'en' ? "Today's Prayer Times" : 'Waktu Sholat Hari Ini'}
              </span>
            </CardTitle>
            {location && (
              <div className="flex items-center gap-1 bg-teal-50 dark:bg-teal-950/30 px-2 py-0.5 rounded-md border border-teal-200/50 dark:border-teal-800/50 ml-6 sm:ml-7 w-fit">
                <MapPin className="w-3 h-3 flex-shrink-0 text-teal-600 dark:text-teal-400" />
                <span className="text-[10px] sm:text-xs font-medium text-teal-700 dark:text-teal-400 truncate">
                  {location}
                </span>
              </div>
            )}
          </div>
          {(gregorianDate || hijriDate) && (
            <div className="flex flex-col gap-1 items-end flex-shrink-0">
              {gregorianDate && (
                <div className="flex items-center gap-1 bg-primary/5 px-2 py-0.5 rounded-md border border-primary/10">
                  <span className="text-[10px] sm:text-xs font-medium text-primary whitespace-nowrap">
                    {gregorianDate.day} {gregorianDate.month.en} {gregorianDate.year}
                  </span>
                </div>
              )}
              {hijriDate && (
                <div className="flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-md border border-emerald-200/50 dark:border-emerald-800/50">
                  <span className="font-arabic text-[10px] sm:text-xs text-emerald-700 dark:text-emerald-400 whitespace-nowrap" dir="rtl">
                    {hijriDate.day} {hijriDate.month.ar} {hijriDate.year} ه
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
        {/* Desktop and Tablet View */}
        <div className="hidden sm:grid grid-cols-5 gap-2 mb-4">
          {Object.entries(prayerNames).map(([key, names]) => {
            const isNext = nextPrayer === key
            return (
              <div
                key={key}
                className={`text-center p-2 md:p-3 rounded-lg transition-all duration-300 ${
                  isNext
                    ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white scale-105 shadow-lg ring-2 ring-emerald-400/50'
                    : 'bg-gradient-to-br from-primary/5 to-primary/10 hover:from-primary/10 hover:to-primary/15 border border-primary/10'
                }`}
              >
                <p className={`text-xs md:text-sm font-medium mb-1 ${
                  isNext ? 'text-white' : 'text-muted-foreground'
                }`}>
                  {language === 'en' ? names.en : names.id}
                </p>
                <p className={`text-sm md:text-base font-bold ${
                  isNext ? 'text-white' : 'text-primary'
                }`}>
                  {formatTime(prayerTimes[key as keyof PrayerTimes])}
                </p>
              </div>
            )
          })}
        </div>

        {/* Mobile View - Seamless List Layout */}
        <div className="sm:hidden space-y-1.5 mb-4">
          {Object.entries(prayerNames).map(([key, names]) => {
            const isNext = nextPrayer === key
            return (
              <div
                key={key}
                className={`flex items-center justify-between py-2.5 px-3 rounded-lg transition-all duration-300 ${
                  isNext
                    ? 'bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/25 scale-[1.01]'
                    : 'bg-gradient-to-r from-primary/5 to-primary/8 border border-primary/10 active:scale-[0.98]'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className={`flex items-center justify-center w-6 h-6 rounded-md flex-shrink-0 ${
                    isNext
                      ? 'bg-white/20'
                      : 'bg-primary/10'
                  }`}>
                    <Clock className={`w-3 h-3 ${
                      isNext ? 'text-white' : 'text-emerald-600'
                    }`} />
                  </div>
                  <p className={`text-sm font-semibold ${
                    isNext ? 'text-white' : 'text-foreground'
                  }`}>
                    {language === 'en' ? names.en : names.id}
                  </p>
                  {isNext && (
                    <span className="text-[9px] font-medium bg-white/20 text-white px-1.5 py-0.5 rounded-full">
                      {language === 'en' ? 'NEXT' : 'NEXT'}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <p className={`text-base font-bold tabular-nums ${
                    isNext ? 'text-white' : 'text-primary'
                  }`}>
                    {formatTime(prayerTimes[key as keyof PrayerTimes])}
                  </p>
                  {isNext && (
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                  )}
                </div>
              </div>
            )
          })}
        </div>

        <Button asChild variant="outline" size="sm" className="w-full text-xs sm:text-sm h-9 sm:h-10 border-emerald-600/20 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-600/40 transition-all">
          <Link href="/waktu-sholat">
            {language === 'en' ? 'View Full Schedule' : 'Lihat Jadwal Lengkap'}
            <ArrowRight className="ml-1.5 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}

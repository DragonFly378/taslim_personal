'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MapPin, Calendar, Globe, Loader2, RefreshCw, Search, X } from 'lucide-react'
import { PrayerTimeResponse, LocationInfo } from '@/types'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import { countries, getCitiesByCountry } from '@/lib/cities-data'

export default function WaktuSholatPage() {
  const { language } = useLanguage()
  const [prayerData, setPrayerData] = useState<PrayerTimeResponse | null>(null)
  const [location, setLocation] = useState<LocationInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [nextPrayer, setNextPrayer] = useState<{ name: string; time: string; minutesUntil: number } | null>(null)

  // Filter states
  const [filterMode, setFilterMode] = useState<'location' | 'city'>('location')
  const [cityInput, setCityInput] = useState('')
  const [countryInput, setCountryInput] = useState('')
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [showFilters, setShowFilters] = useState(false)
  const [availableCities, setAvailableCities] = useState<string[]>([])

  const fetchPrayerTimesByCoords = async (lat: number, lon: number, date?: string) => {
    try {
      setLoading(true)
      setError(null)

      let url = `/api/prayer-times?latitude=${lat}&longitude=${lon}`
      if (date) {
        url += `&date=${date}`
      }

      const response = await fetch(url)
      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch prayer times')
      }

      setPrayerData(data.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch prayer times')
    } finally {
      setLoading(false)
    }
  }

  const fetchPrayerTimesByCity = async (city: string, country: string, date?: string) => {
    try {
      setLoading(true)
      setError(null)

      let url = `/api/prayer-times?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}`
      if (date) {
        url += `&date=${date}`
      }

      const response = await fetch(url)
      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch prayer times')
      }

      setPrayerData(data.data)

      // Set location info from city/country
      setLocation({
        city,
        country,
        latitude: data.data.meta.latitude,
        longitude: data.data.meta.longitude
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch prayer times')
    } finally {
      setLoading(false)
    }
  }

  const fetchLocationName = async (lat: number, lon: number) => {
    try {
      // Using OpenStreetMap Nominatim for reverse geocoding (free)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=en`
      )
      const data = await response.json()

      const locationInfo = {
        city: data.address.city || data.address.town || data.address.village || 'Unknown',
        country: data.address.country || 'Unknown',
        latitude: lat,
        longitude: lon
      }

      setLocation(locationInfo)
      // Try to find matching country in our list
      const matchedCountry = countries.find(c =>
        c.name.toLowerCase() === locationInfo.country.toLowerCase()
      )
      if (matchedCountry) {
        setCountryInput(matchedCountry.name)
        setAvailableCities(matchedCountry.cities)
        // Check if city exists in list
        const cityExists = matchedCountry.cities.some(c =>
          c.toLowerCase() === locationInfo.city.toLowerCase()
        )
        if (cityExists) {
          setCityInput(locationInfo.city)
        }
      }
    } catch (err) {
      console.error('Failed to fetch location name:', err)
      setLocation({
        city: 'Unknown',
        country: 'Unknown',
        latitude: lat,
        longitude: lon
      })
    }
  }

  const getUserLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser')
      setLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        await fetchLocationName(latitude, longitude)
        await fetchPrayerTimesByCoords(latitude, longitude)
      },
      (err) => {
        setError('Please enable location access or search by city')
        setLoading(false)
      }
    )
  }

  useEffect(() => {
    getUserLocation()
  }, [])

  // Update next prayer every minute
  useEffect(() => {
    if (!prayerData || selectedDate) {
      setNextPrayer(null)
      return
    }

    const updateNextPrayer = () => {
      const next = getNextPrayer()
      setNextPrayer(next)
    }

    updateNextPrayer()
    const interval = setInterval(updateNextPrayer, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [prayerData, selectedDate])

  const handleCitySearch = () => {
    if (!cityInput.trim() || !countryInput.trim()) {
      setError('Please enter both city and country')
      return
    }

    setFilterMode('city')
    fetchPrayerTimesByCity(cityInput, countryInput, selectedDate)
  }

  const handleDateChange = (date: string) => {
    setSelectedDate(date)

    if (filterMode === 'city' && cityInput && countryInput) {
      fetchPrayerTimesByCity(cityInput, countryInput, date)
    } else if (location) {
      fetchPrayerTimesByCoords(location.latitude, location.longitude, date)
    }
  }

  const handleClearFilters = () => {
    setSelectedDate('')
    setShowFilters(false)
    if (location) {
      if (filterMode === 'city' && cityInput && countryInput) {
        fetchPrayerTimesByCity(cityInput, countryInput)
      } else {
        fetchPrayerTimesByCoords(location.latitude, location.longitude)
      }
    }
  }

  const handleRefresh = () => {
    if (filterMode === 'city' && cityInput && countryInput) {
      fetchPrayerTimesByCity(cityInput, countryInput, selectedDate)
    } else if (location) {
      fetchPrayerTimesByCoords(location.latitude, location.longitude, selectedDate)
    } else {
      getUserLocation()
    }
  }

  // Format date to DD-MM-YYYY for API
  const formatDateForAPI = (dateString: string) => {
    if (!dateString) return ''
    // Parse date safely by treating it as local date
    const [year, month, day] = dateString.split('-').map(Number)
    const paddedDay = String(day).padStart(2, '0')
    const paddedMonth = String(month).padStart(2, '0')
    return `${paddedDay}-${paddedMonth}-${year}`
  }

  // Get today's date in YYYY-MM-DD format for input default
  const getTodayInputFormat = () => {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const prayerNames = {
    Fajr: { en: 'Fajr', id: 'Subuh' },
    Sunrise: { en: 'Sunrise', id: 'Terbit' },
    Dhuhr: { en: 'Dhuhr', id: 'Dzuhur' },
    Asr: { en: 'Asr', id: 'Ashar' },
    Maghrib: { en: 'Maghrib', id: 'Maghrib' },
    Isha: { en: 'Isha', id: 'Isya' }
  }

  const formatTime = (time: string) => {
    // Remove timezone info (e.g., " (WIB)")
    return time.split(' ')[0]
  }

  // Get the next prayer time
  const getNextPrayer = () => {
    if (!prayerData) return null

    const now = new Date()
    const currentHours = now.getHours()
    const currentMinutes = now.getMinutes()
    const currentTimeInMinutes = currentHours * 60 + currentMinutes

    const prayerOrder = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as const
 
    for (const prayer of prayerOrder) {
      const time = formatTime(prayerData.timings[prayer])
      const [hours, minutes] = time.split(':').map(Number)
      const prayerTimeInMinutes = hours * 60 + minutes

      if (prayerTimeInMinutes > currentTimeInMinutes) {
        return {
          name: prayer,
          time,
          minutesUntil: prayerTimeInMinutes - currentTimeInMinutes
        }
      }
    }

    // If no prayer is found (after Isha), next is Fajr tomorrow
    const fajrTime = formatTime(prayerData.timings.Fajr)
    const [hours, minutes] = fajrTime.split(':').map(Number)
    const fajrTimeInMinutes = hours * 60 + minutes
    const minutesUntilMidnight = (24 * 60) - currentTimeInMinutes

    return {
      name: 'Fajr' as const,
      time: fajrTime,
      minutesUntil: minutesUntilMidnight + fajrTimeInMinutes
    }
  }

  // Format time remaining
  const formatTimeRemaining = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60

    if (language === 'en') {
      if (hours > 0) {
        return `in ${hours}h ${mins}m`
      }
      return `in ${mins}m`
    } else {
      if (hours > 0) {
        return `${hours}j ${mins}m lagi`
      }
      return `${mins}m lagi`
    }
  }

  return (
    <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-4xl">
      <div className="mb-4 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">
          {language === 'en' ? 'Prayer Times' : 'Waktu Sholat'}
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          {language === 'en'
            ? 'Daily prayer times based on your location or city'
            : 'Jadwal waktu sholat berdasarkan lokasi atau kota Anda'}
        </p>
      </div>

      {/* Filters Section */}
      <Card className="mb-4 sm:mb-6 shadow-sm">
        <CardHeader className="py-2 sm:py-3 px-4 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              <CardTitle className="text-base sm:text-lg">
                {language === 'en' ? 'Search & Filters' : 'Cari & Filter'}
              </CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="hover:bg-primary/10 h-8 sm:h-9 text-xs sm:text-sm"
            >
              {showFilters ? (
                <>
                  <X className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-1" />
                  <span className="hidden sm:inline">{language === 'en' ? 'Close' : 'Tutup'}</span>
                </>
              ) : (
                <>
                  <Search className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-1" />
                  <span className="hidden sm:inline">{language === 'en' ? 'Open' : 'Buka'}</span>
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        {showFilters && (
          <CardContent className="space-y-4 sm:space-y-5 pt-2 px-4 sm:px-6 pb-4 sm:pb-6">
            {/* City and Country Search */}
            <div className="space-y-3 sm:space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    {language === 'en' ? 'Country' : 'Negara'}
                  </label>
                  <Select
                    value={countryInput}
                    onValueChange={(value) => {
                      setCountryInput(value)
                      const cities = getCitiesByCountry(value)
                      setAvailableCities(cities)
                      setCityInput('') // Reset city when country changes
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={language === 'en' ? 'Select country' : 'Pilih negara'} />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country.code} value={country.name}>
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {language === 'en' ? 'City' : 'Kota'}
                  </label>
                  <Select
                    value={cityInput}
                    onValueChange={setCityInput}
                    disabled={!countryInput || availableCities.length === 0}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={
                        !countryInput
                          ? (language === 'en' ? 'Select country first' : 'Pilih negara terlebih dahulu')
                          : (language === 'en' ? 'Select city' : 'Pilih kota')
                      } />
                    </SelectTrigger>
                    <SelectContent>
                      {availableCities.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Date Picker */}
            <div>
              <label className="text-sm font-medium mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {language === 'en' ? 'Select Date' : 'Pilih Tanggal'}
              </label>
              <div className="relative">
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => {
                    const formattedDate = formatDateForAPI(e.target.value)
                    handleDateChange(formattedDate)
                    setSelectedDate(e.target.value)
                  }}
                  max={getTodayInputFormat()}
                  className="w-full pl-4 pr-10 py-2 text-base cursor-pointer"
                  placeholder={language === 'en' ? 'Choose a date' : 'Pilih tanggal'}
                />
              </div>
              {selectedDate && (
                <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
                  <Globe className="w-3 h-3" />
                  {(() => {
                    // Parse date safely by treating it as local date
                    const [year, month, day] = selectedDate.split('-').map(Number);
                    const date = new Date(year, month - 1, day);
                    return date.toLocaleDateString(language === 'en' ? 'en-US' : 'id-ID', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    });
                  })()}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 pt-3 border-t">
              <Button
                onClick={handleCitySearch}
                className="w-full sm:flex-1 h-10 sm:h-11 font-medium"
                disabled={!cityInput || !countryInput}
              >
                <Search className="w-4 h-4 mr-2" />
                {language === 'en' ? 'Search' : 'Cari'}
              </Button>
              <Button
                variant="outline"
                onClick={handleClearFilters}
                className="w-full sm:w-auto h-10 sm:h-11"
              >
                <X className="w-4 h-4 mr-2" />
                {language === 'en' ? 'Clear' : 'Hapus'}
              </Button>
              <Button
                variant="outline"
                onClick={getUserLocation}
                className="w-full sm:w-auto h-10 sm:h-11"
              >
                <MapPin className="w-4 h-4 mr-2" />
                {language === 'en' ? 'My Location' : 'Lokasi Saya'}
              </Button>
            </div>
          </CardContent>
        )}
      </Card>

      {error && (
        <Card className="mb-4 sm:mb-6 border-red-200 bg-red-50">
          <CardContent className="pt-4 sm:pt-6 px-4 sm:px-6 pb-4 sm:pb-6">
            <p className="text-sm sm:text-base text-red-600">{error}</p>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-64 mt-2" />
            </CardHeader>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : prayerData && location ? (
        <div className="space-y-4 sm:space-y-6">
          {/* Location and Date Info */}
          <Card>
            <CardHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-4 sm:pb-6">
              <div className="flex justify-between items-start gap-3">
                <div className="flex-1 min-w-0">
                  <CardTitle className="flex items-center gap-2 mb-2 text-lg sm:text-xl">
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                    <span className="truncate">{location.city}, {location.country}</span>
                  </CardTitle>
                  <CardDescription className="space-y-1 text-xs sm:text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                      <span className="truncate">
                        {prayerData.date.hijri.day} {prayerData.date.hijri.month.en} {prayerData.date.hijri.year} H
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                      <span className="truncate">
                        {prayerData.date.gregorian.weekday.en}, {prayerData.date.gregorian.day} {prayerData.date.gregorian.month.en} {prayerData.date.gregorian.year}
                      </span>
                    </div>
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  disabled={loading}
                  className="h-8 w-8 sm:h-9 sm:w-9 p-0 flex-shrink-0"
                >
                  <RefreshCw className={`w-3 h-3 sm:w-4 sm:h-4 ${loading ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </CardHeader>
          </Card>

          {/* Prayer Times Grid */}
          <Card className="overflow-hidden">
            <CardHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4">
              <CardTitle className="text-lg sm:text-xl">
                {selectedDate
                  ? (language === 'en' ? 'Prayer Times' : 'Jadwal Sholat')
                  : (language === 'en' ? 'Today\'s Prayer Times' : 'Jadwal Sholat Hari Ini')
                }
              </CardTitle>
            </CardHeader>
            <CardContent className="px-3 sm:px-6 pb-4 sm:pb-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-4">
                {Object.entries(prayerNames).map(([key, names]) => {
                  const time = prayerData.timings[key as keyof typeof prayerData.timings]
                  const isNextPrayer = nextPrayer?.name === key

                  return (
                    <div
                      key={key}
                      className={`
                        rounded-lg p-3 sm:p-4 border transition-all duration-300
                        ${isNextPrayer
                          ? 'bg-gradient-to-br from-emerald-500 to-teal-600 border-emerald-400 shadow-lg ring-2 ring-emerald-400/50 scale-105'
                          : 'bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 hover:shadow-md'
                        }
                      `}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <p className={`text-xs sm:text-sm font-medium truncate ${
                          isNextPrayer ? 'text-white' : 'text-muted-foreground'
                        }`}>
                          {language === 'en' ? names.en : names.id}
                        </p>
                        {isNextPrayer && (
                          <span className="text-[10px] sm:text-xs font-bold bg-white/90 text-emerald-700 px-1.5 sm:px-2 py-0.5 rounded-full">
                            {language === 'en' ? 'NEXT' : 'BERIKUTNYA'}
                          </span>
                        )}
                      </div>
                      <p className={`text-xl sm:text-2xl font-bold ${
                        isNextPrayer ? 'text-white' : 'text-primary'
                      }`}>
                        {formatTime(time)}
                      </p>
                      {isNextPrayer && nextPrayer && (
                        <p className="text-[10px] sm:text-xs font-medium text-white/90 mt-1">
                          {formatTimeRemaining(nextPrayer.minutesUntil)}
                        </p>
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Islamic Date Card */}
          <Card className="overflow-hidden">
            <CardHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4">
              <CardTitle className="text-lg sm:text-xl">
                {language === 'en' ? 'Islamic Date' : 'Tanggal Hijriah'}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
              <div className="text-center p-4 sm:p-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg">
                <p className="text-2xl sm:text-3xl font-bold text-emerald-900 mb-2" dir="rtl">
                  {prayerData.date.hijri.day} {prayerData.date.hijri.month.ar} {prayerData.date.hijri.year}
                </p>
                <p className="text-base sm:text-lg text-emerald-700">
                  {prayerData.date.hijri.day} {prayerData.date.hijri.month.en} {prayerData.date.hijri.year} {prayerData.date.hijri.designation.abbreviated}
                </p>
                <p className="text-xs sm:text-sm text-emerald-600 mt-2">
                  {prayerData.date.hijri.weekday.en}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  )
}

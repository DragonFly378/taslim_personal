'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Hash, List } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface SurahBottomBarProps {
  currentSurah: {
    nomor: number
    namaLatin: string
    nama: string
    arti: string
    jumlahAyat: number
  }
  previousSurah?: {
    nomor: number
    namaLatin: string
    nama: string
  } | null
  nextSurah?: {
    nomor: number
    namaLatin: string
    nama: string
  } | null
}

export function SurahBottomBar({ currentSurah, previousSurah, nextSurah }: SurahBottomBarProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [jumpToAyah, setJumpToAyah] = useState('')
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      // Show bar after scrolling 300px
      if (window.scrollY > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Prevent hydration mismatch by not rendering until mounted
  if (!isMounted) {
    return null
  }

  const handleJumpToAyah = (ayahNumber: number) => {
    const ayahElement = document.querySelector(`[data-ayah="${ayahNumber}"]`)
    if (ayahElement) {
      ayahElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  const handleQuickJump = () => {
    const ayahNum = parseInt(jumpToAyah)
    if (ayahNum && ayahNum >= 1 && ayahNum <= currentSurah.jumlahAyat) {
      handleJumpToAyah(ayahNum)
      setJumpToAyah('')
    }
  }

  // Generate ayah list in groups of 10
  const ayahGroups: number[][] = []
  for (let i = 1; i <= currentSurah.jumlahAyat; i += 10) {
    const group = []
    for (let j = i; j < i + 10 && j <= currentSurah.jumlahAyat; j++) {
      group.push(j)
    }
    ayahGroups.push(group)
  }

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      {/* Bottom Navigation Bar */}
      <div className="bg-background/98 backdrop-blur-xl border-t-2 border-primary/20 shadow-2xl">
        <div className="container mx-auto max-w-7xl px-2 sm:px-4 py-2 sm:py-3">
          {/* Mobile Layout */}
          <div className="md:hidden">
            {/* Top Row - Current Surah Info */}
            <div className="flex items-center gap-2 px-3 py-2.5 bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 rounded-xl border border-primary/20 mb-2">
              <div className="w-9 h-9 flex items-center justify-center bg-gradient-to-br from-primary to-secondary rounded-lg text-white font-bold text-sm shadow-md flex-shrink-0">
                {currentSurah.nomor}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-sm text-foreground truncate">
                  {currentSurah.namaLatin} · {currentSurah.arti}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="font-arabic truncate" dir="rtl">{currentSurah.nama}</span>
                  <span>•</span>
                  <span className="flex-shrink-0">{currentSurah.jumlahAyat} Ayahs</span>
                </div>
              </div>
            </div>

            {/* Bottom Row - Navigation Buttons */}
            <div className="grid grid-cols-4 gap-2">
              {/* Previous Button */}
              {previousSurah ? (
                <Link
                  href={`/quran/${previousSurah.nomor}`}
                  className="flex flex-col items-center justify-center px-2 py-2 rounded-xl bg-primary/10 hover:bg-primary/20 transition-all active:scale-95"
                  title={`Previous: ${previousSurah.namaLatin}`}
                >
                  <ChevronLeft className="h-5 w-5 text-primary mb-1" />
                  <span className="text-xs font-medium text-foreground">Previous</span>
                </Link>
              ) : (
                <div />
              )}

              {/* Jump to Ayah Button */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="flex flex-col items-center justify-center px-2 py-2 rounded-xl border-2 border-primary/30 bg-primary/5 hover:bg-primary/10 transition-all active:scale-95"
                    title="Jump to Ayah"
                  >
                    <Hash className="h-5 w-5 text-primary mb-1" />
                    <span className="text-xs font-medium text-foreground">Jump</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="center"
                  className="w-72 max-h-[400px] overflow-y-auto mb-2"
                  sideOffset={10}
                >
                  {/* Quick Jump Input */}
                  <div className="p-3 border-b sticky top-0 bg-background z-10">
                    <div className="flex gap-2">
                      <input
                        type="number"
                        min="1"
                        max={currentSurah.jumlahAyat}
                        value={jumpToAyah}
                        onChange={(e) => setJumpToAyah(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleQuickJump()
                          }
                        }}
                        placeholder={`1-${currentSurah.jumlahAyat}`}
                        className="flex-1 px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <Button
                        type="button"
                        size="sm"
                        onClick={handleQuickJump}
                        className="bg-gradient-to-r from-primary to-secondary"
                      >
                        Go
                      </Button>
                    </div>
                  </div>

                  {/* Ayah Grid */}
                  <div className="p-3 space-y-2">
                    {ayahGroups.map((group, groupIndex) => (
                      <div key={groupIndex} className="grid grid-cols-5 gap-2">
                        {group.map((ayahNum) => (
                          <button
                            key={ayahNum}
                            type="button"
                            onClick={() => handleJumpToAyah(ayahNum)}
                            className="px-2 py-2 text-sm font-medium rounded-lg border border-primary/20 hover:bg-gradient-to-r hover:from-primary hover:to-secondary hover:text-white transition-all active:scale-95"
                          >
                            {ayahNum}
                          </button>
                        ))}
                      </div>
                    ))}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* All Surahs Button */}
              <Link
                href="/quran"
                className="flex flex-col items-center justify-center px-2 py-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 transition-all active:scale-95"
                title="All Surahs"
              >
                <List className="h-5 w-5 text-purple-600 mb-1" />
                <span className="text-xs font-medium text-foreground">All</span>
              </Link>

              {/* Next Button */}
              {nextSurah ? (
                <Link
                  href={`/quran/${nextSurah.nomor}`}
                  className="flex flex-col items-center justify-center px-2 py-2 rounded-xl bg-secondary/10 hover:bg-secondary/20 transition-all active:scale-95"
                  title={`Next: ${nextSurah.namaLatin}`}
                >
                  <ChevronRight className="h-5 w-5 text-secondary mb-1" />
                  <span className="text-xs font-medium text-foreground">Next</span>
                </Link>
              ) : (
                <div />
              )}
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:flex items-center justify-between gap-4">
            {/* Left - Current Surah Info */}
            <div className="flex items-center gap-3 px-4 py-2.5 bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 rounded-xl border border-primary/20 min-w-0 flex-1">
              <div className="w-11 h-11 flex items-center justify-center bg-gradient-to-br from-primary to-secondary rounded-xl text-white font-bold text-base shadow-md flex-shrink-0">
                {currentSurah.nomor}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-base text-foreground truncate">
                  {currentSurah.namaLatin} · {currentSurah.arti}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="font-arabic" dir="rtl">{currentSurah.nama}</span>
                  <span>•</span>
                  <span>{currentSurah.jumlahAyat} Ayahs</span>
                </div>
              </div>
            </div>

            {/* Right - Navigation Buttons */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* All Surahs Button */}
              <Link
                href="/quran"
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border-2 border-purple-500/30 transition-all group"
                title="All Surahs"
              >
                <List className="h-5 w-5 text-purple-600 flex-shrink-0" />
                <div className="min-w-0">
                  <div className="font-semibold text-sm text-foreground">All Surahs</div>
                </div>
              </Link>

              {/* Jump to Ayah Button */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="px-4 py-3 rounded-xl border-2 border-primary/30 hover:bg-primary/10 transition-all"
                    title="Jump to Ayah"
                  >
                    <Hash className="h-5 w-5 text-primary" />
                    <span className="ml-2 text-sm font-medium">Jump</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-80 max-h-[400px] overflow-y-auto"
                  sideOffset={10}
                >
                  {/* Quick Jump Input */}
                  <div className="p-3 border-b sticky top-0 bg-background z-10">
                    <div className="flex gap-2">
                      <input
                        type="number"
                        min="1"
                        max={currentSurah.jumlahAyat}
                        value={jumpToAyah}
                        onChange={(e) => setJumpToAyah(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleQuickJump()
                          }
                        }}
                        placeholder={`1-${currentSurah.jumlahAyat}`}
                        className="flex-1 px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <Button
                        type="button"
                        size="sm"
                        onClick={handleQuickJump}
                        className="bg-gradient-to-r from-primary to-secondary"
                      >
                        Go
                      </Button>
                    </div>
                  </div>

                  {/* Ayah Grid */}
                  <div className="p-3 space-y-2">
                    {ayahGroups.map((group, groupIndex) => (
                      <div key={groupIndex} className="grid grid-cols-5 gap-2">
                        {group.map((ayahNum) => (
                          <button
                            key={ayahNum}
                            type="button"
                            onClick={() => handleJumpToAyah(ayahNum)}
                            className="px-3 py-2 text-sm font-medium rounded-lg border border-primary/20 hover:bg-gradient-to-r hover:from-primary hover:to-secondary hover:text-white transition-all"
                          >
                            {ayahNum}
                          </button>
                        ))}
                      </div>
                    ))}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Previous Button */}
              {previousSurah ? (
                <Link
                  href={`/quran/${previousSurah.nomor}`}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl bg-primary/10 hover:bg-primary/20 transition-all group"
                  title={`Previous: ${previousSurah.namaLatin}`}
                >
                  <ChevronLeft className="h-6 w-6 text-primary flex-shrink-0 group-hover:-translate-x-1 transition-transform" />
                  <div className="min-w-0">
                    <div className="text-xs text-muted-foreground">Previous</div>
                    <div className="font-semibold text-sm text-foreground truncate max-w-[120px]">
                      {previousSurah.namaLatin}
                    </div>
                  </div>
                </Link>
              ) : (
                <div />
              )}

              {/* Next Button */}
              {nextSurah ? (
                <Link
                  href={`/quran/${nextSurah.nomor}`}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl bg-secondary/10 hover:bg-secondary/20 transition-all group"
                  title={`Next: ${nextSurah.namaLatin}`}
                >
                  <div className="min-w-0 text-right">
                    <div className="text-xs text-muted-foreground">Next</div>
                    <div className="font-semibold text-sm text-foreground truncate max-w-[120px]">
                      {nextSurah.namaLatin}
                    </div>
                  </div>
                  <ChevronRight className="h-6 w-6 text-secondary flex-shrink-0 group-hover:translate-x-1 transition-transform" />
                </Link>
              ) : (
                <div />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

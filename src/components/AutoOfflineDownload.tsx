/**
 * Automatic Background Download for Offline Content
 * Downloads Quran and Duas in the background on first visit
 */

'use client'

import { useEffect, useState } from 'react'
import { Download, Check, X } from 'lucide-react'
import { downloadQuranForOffline, downloadDuasForOffline, type DownloadProgress } from '@/lib/offline-download'
import { getOfflineStorage } from '@/lib/offline-storage'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

export function AutoOfflineDownload() {
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadComplete, setDownloadComplete] = useState(false)
  const [quranProgress, setQuranProgress] = useState<DownloadProgress>({
    total: 114,
    current: 0,
    percentage: 0,
    status: 'idle',
  })
  const [duasProgress, setDuasProgress] = useState<DownloadProgress>({
    total: 100,
    current: 0,
    percentage: 0,
    status: 'idle',
  })
  const [isDismissed, setIsDismissed] = useState(false)
  const [showNotification, setShowNotification] = useState(false)

  useEffect(() => {
    checkAndStartDownload()
  }, [])

  const checkAndStartDownload = async () => {
    try {
      // Check if user has dismissed auto-download
      const dismissed = localStorage.getItem('auto_download_dismissed')
      if (dismissed === 'true') {
        setIsDismissed(true)
        return
      }

      // Check if already downloaded
      const storage = await getOfflineStorage()
      const status = await storage.getOfflineStatus()

      // If both Quran and Duas are already downloaded, don't show notification
      if (status.quranDownloaded && status.duasDownloaded) {
        setDownloadComplete(true)
        return
      }

      // Show notification to start download
      setShowNotification(true)

      // Auto-start download after 3 seconds if user doesn't dismiss
      const autoStartTimer = setTimeout(() => {
        if (!isDismissed) {
          startBackgroundDownload()
        }
      }, 3000)

      return () => clearTimeout(autoStartTimer)
    } catch (error) {
      console.error('Error checking download status:', error)
    }
  }

  const startBackgroundDownload = async () => {
    setIsDownloading(true)
    setShowNotification(false)

    try {
      const storage = await getOfflineStorage()
      const status = await storage.getOfflineStatus()

      // Download Quran if not already downloaded
      if (!status.quranDownloaded) {
        setQuranProgress({ ...quranProgress, status: 'downloading' })
        await downloadQuranForOffline((progress) => {
          setQuranProgress(progress)
        })
      }

      // Download Duas if not already downloaded
      if (!status.duasDownloaded) {
        setDuasProgress({ ...duasProgress, status: 'downloading' })
        await downloadDuasForOffline((progress) => {
          setDuasProgress(progress)
        })
      }

      setDownloadComplete(true)

      // Hide progress indicator after 5 seconds
      setTimeout(() => {
        setIsDownloading(false)
      }, 5000)
    } catch (error) {
      console.error('Background download error:', error)
      setIsDownloading(false)
    }
  }

  const dismissNotification = () => {
    setShowNotification(false)
    setIsDismissed(true)
    localStorage.setItem('auto_download_dismissed', 'true')
  }

  const dismissForever = () => {
    dismissNotification()
  }

  // Don't render if dismissed or complete and not downloading
  if ((isDismissed || downloadComplete) && !isDownloading) {
    return null
  }

  // Initial notification to ask user
  if (showNotification && !isDownloading) {
    return (
      <div className="fixed bottom-4 right-4 left-4 sm:left-auto z-50 max-w-md mx-auto sm:mx-0 animate-in slide-in-from-bottom-5">
        <Card className="border-2 border-primary/40 shadow-2xl bg-gradient-to-br from-background to-primary/5 backdrop-blur-sm overflow-hidden">
          {/* Decorative gradient bar */}
          <div className="h-1 bg-gradient-to-r from-primary via-secondary to-primary" />

          <CardContent className="p-4 sm:p-5">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary/30 animate-pulse">
                <Download className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-sm sm:text-base mb-1 sm:mb-1.5 text-foreground">
                  📥 Download for Offline Access?
                </h4>
                <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 leading-relaxed">
                  We'll download the <strong className="text-foreground">Quran</strong> and <strong className="text-foreground">Duas</strong> in the background so you can access them offline anytime.
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    size="sm"
                    onClick={startBackgroundDownload}
                    className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-xs sm:text-sm shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all active:scale-95 w-full sm:w-auto"
                  >
                    <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5" />
                    Download Now
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={dismissForever}
                    className="text-xs sm:text-sm border-2 hover:bg-muted/50 active:scale-95 transition-all w-full sm:w-auto"
                  >
                    Maybe Later
                  </Button>
                </div>
              </div>
              <button
                onClick={dismissNotification}
                className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors rounded-full p-1 hover:bg-muted/50"
                aria-label="Dismiss notification"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Download progress indicator
  if (isDownloading) {
    const totalProgress = (quranProgress.percentage + duasProgress.percentage) / 2
    const isComplete = downloadComplete

    return (
      <div className="fixed bottom-4 right-4 left-4 sm:left-auto z-50 max-w-md mx-auto sm:mx-0 animate-in slide-in-from-bottom-5">
        <Card className={`border-2 shadow-2xl backdrop-blur-sm overflow-hidden transition-all duration-500 ${
          isComplete
            ? 'border-green-500/50 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900'
            : 'border-primary/40 bg-gradient-to-br from-background to-primary/5'
        }`}>
          {/* Decorative gradient bar */}
          <div className={`h-1 transition-all duration-500 ${
            isComplete
              ? 'bg-green-500'
              : 'bg-gradient-to-r from-primary via-secondary to-primary animate-pulse'
          }`} />

          <CardContent className="p-4 sm:p-5">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg transition-all duration-500 ${
                isComplete
                  ? 'bg-green-500 shadow-green-500/30 scale-110'
                  : 'bg-gradient-to-br from-primary to-secondary shadow-primary/30 animate-pulse'
              }`}>
                {isComplete ? (
                  <Check className="w-6 h-6 sm:w-7 sm:h-7 text-white animate-in zoom-in" />
                ) : (
                  <Download className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-sm sm:text-base mb-2 sm:mb-3">
                  {isComplete ? '✅ Download Complete!' : '⏬ Downloading for Offline...'}
                </h4>

                {!isComplete && (
                  <div className="space-y-2.5">
                    {/* Quran Progress */}
                    {quranProgress.status === 'downloading' && (
                      <div className="bg-background/50 p-2 sm:p-2.5 rounded-lg border border-border/50">
                        <div className="flex justify-between items-center text-xs sm:text-sm mb-1.5">
                          <span className="font-medium text-foreground">📖 Quran</span>
                          <span className="text-muted-foreground font-mono">{quranProgress.current}/{quranProgress.total}</span>
                        </div>
                        <Progress value={quranProgress.percentage} className="h-2" />
                        <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
                          {Math.round(quranProgress.percentage)}% complete
                        </p>
                      </div>
                    )}

                    {/* Duas Progress */}
                    {duasProgress.status === 'downloading' && (
                      <div className="bg-background/50 p-2 sm:p-2.5 rounded-lg border border-border/50">
                        <div className="flex justify-between items-center text-xs sm:text-sm mb-1.5">
                          <span className="font-medium text-foreground">🤲 Duas</span>
                          <span className="text-muted-foreground font-mono">{duasProgress.percentage}%</span>
                        </div>
                        <Progress value={duasProgress.percentage} className="h-2" />
                        <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
                          {Math.round(duasProgress.percentage)}% complete
                        </p>
                      </div>
                    )}

                    {/* Overall Progress */}
                    <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-primary pt-1">
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      Overall Progress: {Math.round(totalProgress)}%
                    </div>
                  </div>
                )}

                {isComplete && (
                  <div className="bg-green-50 dark:bg-green-900/30 p-3 rounded-lg border border-green-200 dark:border-green-800">
                    <p className="text-xs sm:text-sm text-green-800 dark:text-green-200 font-medium mb-1">
                      🎉 All content downloaded successfully!
                    </p>
                    <p className="text-[10px] sm:text-xs text-green-700 dark:text-green-300">
                      You can now access the Quran and Duas offline anytime.
                    </p>
                  </div>
                )}
              </div>
              {!isComplete && (
                <button
                  onClick={() => setIsDownloading(false)}
                  className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors rounded-full p-1 hover:bg-muted/50"
                  aria-label="Minimize progress"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return null
}

/**
 * Offline Content Manager Component
 * Allows users to download Quran and Duas for offline access
 */

'use client'

import { useState, useEffect } from 'react'
import { Download, Trash2, Check, Loader2, HardDrive, Wifi, WifiOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { useToast } from '@/hooks/use-toast'
import { getOfflineStorage, type OfflineStatus } from '@/lib/offline-storage'
import {
  downloadQuranForOffline,
  downloadDuasForOffline,
  deleteOfflineContent,
  getStorageEstimate,
  formatBytes,
  type DownloadProgress,
} from '@/lib/offline-download'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

export function OfflineManager() {
  const { toast } = useToast()
  const [offlineStatus, setOfflineStatus] = useState<OfflineStatus | null>(null)
  const [storageInfo, setStorageInfo] = useState({ usage: 0, quota: 0, percentage: 0 })
  const [isOnline, setIsOnline] = useState(true)

  const [quranProgress, setQuranProgress] = useState<DownloadProgress>({
    total: 0,
    current: 0,
    percentage: 0,
    status: 'idle',
  })

  const [duasProgress, setDuasProgress] = useState<DownloadProgress>({
    total: 0,
    current: 0,
    percentage: 0,
    status: 'idle',
  })

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<'quran' | 'duas' | 'all' | null>(null)

  useEffect(() => {
    loadStatus()
    loadStorageInfo()

    // Monitor online/offline status
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const loadStatus = async () => {
    try {
      const storage = await getOfflineStorage()
      const status = await storage.getOfflineStatus()
      setOfflineStatus(status)
    } catch (error) {
      console.error('Error loading offline status:', error)
    }
  }

  const loadStorageInfo = async () => {
    try {
      const info = await getStorageEstimate()
      setStorageInfo(info)
    } catch (error) {
      console.error('Error loading storage info:', error)
    }
  }

  const handleDownloadQuran = async () => {
    try {
      setQuranProgress({ total: 114, current: 0, percentage: 0, status: 'downloading' })

      const success = await downloadQuranForOffline((progress) => {
        setQuranProgress(progress)
      })

      if (success) {
        toast({
          title: 'Quran Downloaded',
          description: 'All 114 surahs are now available offline!',
        })
        await loadStatus()
        await loadStorageInfo()
      } else {
        toast({
          title: 'Download Failed',
          description: 'Failed to download Quran. Please try again.',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Error downloading Quran:', error)
      toast({
        title: 'Error',
        description: 'An error occurred while downloading',
        variant: 'destructive',
      })
    }
  }

  const handleDownloadDuas = async () => {
    try {
      setDuasProgress({ total: 100, current: 0, percentage: 0, status: 'downloading' })

      const success = await downloadDuasForOffline((progress) => {
        setDuasProgress(progress)
      })

      if (success) {
        toast({
          title: 'Duas Downloaded',
          description: 'All daily duas are now available offline!',
        })
        await loadStatus()
        await loadStorageInfo()
      } else {
        toast({
          title: 'Download Failed',
          description: 'Failed to download duas. Please try again.',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Error downloading Duas:', error)
      toast({
        title: 'Error',
        description: 'An error occurred while downloading',
        variant: 'destructive',
      })
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return

    try {
      const success = await deleteOfflineContent(deleteTarget)

      if (success) {
        toast({
          title: 'Deleted',
          description: `Offline ${deleteTarget === 'all' ? 'content' : deleteTarget} removed successfully`,
        })
        await loadStatus()
        await loadStorageInfo()

        // Reset progress
        if (deleteTarget === 'quran' || deleteTarget === 'all') {
          setQuranProgress({ total: 0, current: 0, percentage: 0, status: 'idle' })
        }
        if (deleteTarget === 'duas' || deleteTarget === 'all') {
          setDuasProgress({ total: 0, current: 0, percentage: 0, status: 'idle' })
        }
      }
    } catch (error) {
      console.error('Error deleting content:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete offline content',
        variant: 'destructive',
      })
    } finally {
      setDeleteDialogOpen(false)
      setDeleteTarget(null)
    }
  }

  const openDeleteDialog = (target: 'quran' | 'duas' | 'all') => {
    setDeleteTarget(target)
    setDeleteDialogOpen(true)
  }

  const isQuranDownloading = quranProgress.status === 'downloading'
  const isDuasDownloading = duasProgress.status === 'downloading'
  const isAnyDownloading = isQuranDownloading || isDuasDownloading

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isOnline ? (
              <>
                <Wifi className="h-5 w-5 text-green-600" />
                <span>Online</span>
              </>
            ) : (
              <>
                <WifiOff className="h-5 w-5 text-orange-600" />
                <span>Offline</span>
              </>
            )}
          </CardTitle>
          <CardDescription>
            {isOnline
              ? 'Connected to the internet. You can download content for offline use.'
              : 'You are offline. Only previously downloaded content is available.'}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Storage Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HardDrive className="h-5 w-5" />
            Storage Usage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Used</span>
              <span className="font-medium">
                {formatBytes(storageInfo.usage)} / {formatBytes(storageInfo.quota)}
              </span>
            </div>
            <Progress value={storageInfo.percentage} />
            <p className="text-xs text-muted-foreground">
              {storageInfo.percentage.toFixed(1)}% of available storage used
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Quran Download Card */}
      <Card>
        <CardHeader>
          <CardTitle>Complete Quran (114 Surahs)</CardTitle>
          <CardDescription>
            Download all surahs with Arabic text, transliteration, and Indonesian translation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {offlineStatus?.quranDownloaded && quranProgress.status !== 'downloading' ? (
            <div className="flex items-center gap-2 text-green-600">
              <Check className="h-5 w-5" />
              <span className="font-medium">Downloaded</span>
              {offlineStatus.lastQuranUpdate && (
                <span className="text-xs text-muted-foreground">
                  {new Date(offlineStatus.lastQuranUpdate).toLocaleDateString()}
                </span>
              )}
            </div>
          ) : isQuranDownloading ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="font-medium">
                  Downloading... ({quranProgress.current}/{quranProgress.total})
                </span>
              </div>
              <Progress value={quranProgress.percentage} />
              <p className="text-xs text-muted-foreground">{quranProgress.percentage}% complete</p>
            </div>
          ) : null}

          <div className="flex gap-2">
            <Button
              onClick={handleDownloadQuran}
              disabled={!isOnline || isAnyDownloading}
              className="flex-1"
            >
              <Download className="mr-2 h-4 w-4" />
              {offlineStatus?.quranDownloaded ? 'Re-download' : 'Download Quran'}
            </Button>
            {offlineStatus?.quranDownloaded && (
              <Button
                variant="destructive"
                size="icon"
                onClick={() => openDeleteDialog('quran')}
                disabled={isAnyDownloading}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Duas Download Card */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Duas</CardTitle>
          <CardDescription>Download all Islamic daily prayers and supplications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {offlineStatus?.duasDownloaded && duasProgress.status !== 'downloading' ? (
            <div className="flex items-center gap-2 text-green-600">
              <Check className="h-5 w-5" />
              <span className="font-medium">Downloaded</span>
              {offlineStatus.lastDuasUpdate && (
                <span className="text-xs text-muted-foreground">
                  {new Date(offlineStatus.lastDuasUpdate).toLocaleDateString()}
                </span>
              )}
            </div>
          ) : isDuasDownloading ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="font-medium">Downloading...</span>
              </div>
              <Progress value={duasProgress.percentage} />
              <p className="text-xs text-muted-foreground">{duasProgress.percentage}% complete</p>
            </div>
          ) : null}

          <div className="flex gap-2">
            <Button
              onClick={handleDownloadDuas}
              disabled={!isOnline || isAnyDownloading}
              className="flex-1"
            >
              <Download className="mr-2 h-4 w-4" />
              {offlineStatus?.duasDownloaded ? 'Re-download' : 'Download Duas'}
            </Button>
            {offlineStatus?.duasDownloaded && (
              <Button
                variant="destructive"
                size="icon"
                onClick={() => openDeleteDialog('duas')}
                disabled={isAnyDownloading}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Delete All */}
      {(offlineStatus?.quranDownloaded || offlineStatus?.duasDownloaded) && (
        <Button
          variant="outline"
          onClick={() => openDeleteDialog('all')}
          disabled={isAnyDownloading}
          className="w-full"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete All Offline Content
        </Button>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Offline Content?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {deleteTarget === 'all' ? 'all offline content' : `offline ${deleteTarget}`}?
              You'll need to download it again to use it offline.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

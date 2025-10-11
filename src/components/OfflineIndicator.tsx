/**
 * Offline Indicator Badge
 * Shows when content is being loaded from offline storage
 */

'use client'

import { WifiOff } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface OfflineIndicatorProps {
  isOffline: boolean
  className?: string
}

export function OfflineIndicator({ isOffline, className }: OfflineIndicatorProps) {
  if (!isOffline) return null

  return (
    <Badge variant="secondary" className={className}>
      <WifiOff className="mr-1 h-3 w-3" />
      Offline Mode
    </Badge>
  )
}

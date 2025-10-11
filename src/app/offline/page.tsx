import { Metadata } from 'next'
import { OfflineManager } from '@/components/OfflineManager'

export const metadata: Metadata = {
  title: 'Offline Mode - Taslim',
  description: 'Download Quran and Duas for offline access',
}

export default function OfflinePage() {
  return (
    <div className="container max-w-4xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Offline Mode</h1>
        <p className="text-muted-foreground">
          Download content to your device for access without internet connection
        </p>
      </div>

      <OfflineManager />

      <div className="mt-12 p-6 bg-muted/50 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">How Offline Mode Works</h2>
        <ul className="space-y-3 text-sm">
          <li className="flex gap-2">
            <span className="text-green-600 font-bold">•</span>
            <span>
              <strong>Download Once:</strong> Download the Quran or Duas when you have internet
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-green-600 font-bold">•</span>
            <span>
              <strong>Access Anywhere:</strong> Read even without internet connection
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-green-600 font-bold">•</span>
            <span>
              <strong>Auto Update:</strong> Content updates automatically when you're online
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-green-600 font-bold">•</span>
            <span>
              <strong>Storage Efficient:</strong> Downloaded content is stored locally in your browser
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-green-600 font-bold">•</span>
            <span>
              <strong>Easy Management:</strong> Delete content anytime to free up space
            </span>
          </li>
        </ul>
      </div>
    </div>
  )
}

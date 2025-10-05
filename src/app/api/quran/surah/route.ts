import { NextResponse } from 'next/server'
import { getAllSurahs } from '@/lib/equran-api'

export async function GET() {
  try {
    const surahs = await getAllSurahs()

    // Transform to match our interface
    const transformed = surahs.map(surah => ({
      id: surah.nomor,
      surahNumber: surah.nomor,
      latinName: surah.namaLatin,
      arabicName: surah.nama,
      translationId: surah.arti,
      translationEn: surah.arti,
      revelationPlace: surah.tempatTurun,
      ayahCount: surah.jumlahAyat
    }))

    return NextResponse.json({
      success: true,
      data: transformed
    })
  } catch (error) {
    console.error('Error fetching surahs:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch surahs' },
      { status: 500 }
    )
  }
}

export const dynamic = 'force-static'
export const revalidate = 86400 // Revalidate every 24 hours

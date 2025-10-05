import { NextRequest, NextResponse } from 'next/server'
import { getSurahByNumber } from '@/lib/equran-api'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const surahNumber = parseInt(resolvedParams.id)

    if (isNaN(surahNumber) || surahNumber < 1 || surahNumber > 114) {
      return NextResponse.json(
        { success: false, error: 'Invalid surah number. Must be between 1 and 114.' },
        { status: 400 }
      )
    }

    const surahData = await getSurahByNumber(surahNumber)

    // Transform to match our interface
    const ayahs = surahData.ayat.map((ayah) => ({
      id: surahNumber * 1000 + ayah.nomorAyat, // Generate unique ID
      numberInSurah: ayah.nomorAyat,
      arabicText: ayah.teksArab,
      transliteration: ayah.teksLatin,
      translations: {
        'id-kemenag': ayah.teksIndonesia
      },
      audio: ayah.audio
    }))

    const response = {
      surah: {
        id: surahData.nomor,
        surahNumber: surahData.nomor,
        latinName: surahData.namaLatin,
        arabicName: surahData.nama,
        translationId: surahData.arti,
        translationEn: surahData.arti,
        revelationPlace: surahData.tempatTurun,
        ayahCount: surahData.jumlahAyat,
        description: surahData.deskripsi,
        audioFull: surahData.audioFull
      },
      ayahs,
      navigation: {
        next: surahData.suratSelanjutnya,
        previous: surahData.suratSebelumnya
      }
    }

    return NextResponse.json({
      success: true,
      data: response
    })
  } catch (error) {
    console.error('Error fetching surah:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch surah' },
      { status: 500 }
    )
  }
}

export const dynamic = 'force-dynamic'

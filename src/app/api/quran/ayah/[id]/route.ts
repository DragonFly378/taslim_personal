import { NextRequest, NextResponse } from 'next/server'
import { getAyah, getSurahByNumber } from '@/lib/equran-api'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    // Parse the ID as surahNumber-ayahNumber (e.g., "1-5" for Al-Fatihah ayah 5)
    const [surahNum, ayahNum] = resolvedParams.id.split('-').map(n => parseInt(n))

    if (!surahNum || !ayahNum || isNaN(surahNum) || isNaN(ayahNum)) {
      return NextResponse.json(
        { error: 'Invalid format. Use format: surahNumber-ayahNumber (e.g., 1-5)' },
        { status: 400 }
      )
    }

    const surahData = await getSurahByNumber(surahNum)
    const ayahData = await getAyah(surahNum, ayahNum)

    const response = {
      id: surahNum * 1000 + ayahNum,
      numberInSurah: ayahData.nomorAyat,
      arabicText: ayahData.teksArab,
      transliteration: ayahData.teksLatin,
      surah: {
        id: surahData.nomor,
        surahNumber: surahData.nomor,
        latinName: surahData.namaLatin,
        arabicName: surahData.nama
      },
      translations: {
        'id-kemenag': ayahData.teksIndonesia
      },
      audio: ayahData.audio
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching ayah:', error)
    return NextResponse.json(
      { error: 'Failed to fetch ayah' },
      { status: 500 }
    )
  }
}

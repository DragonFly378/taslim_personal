import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const latitude = searchParams.get('latitude')
    const longitude = searchParams.get('longitude')
    const city = searchParams.get('city')
    const country = searchParams.get('country')
    const date = searchParams.get('date') // Format: DD-MM-YYYY or timestamp
    const method = searchParams.get('method') || '20' // 20 = KEMENAG (Kementerian Agama Republik Indonesia)

    let url: string

    // Choose API endpoint based on parameters
    if (city && country) {
      // Use city-based API
      const baseUrl = 'https://api.aladhan.com/v1/timingsByCity'
      const dateParam = date ? `/${date}` : ''
      url = `${baseUrl}${dateParam}?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=${method}`
    } else if (latitude && longitude) {
      // Use coordinate-based API
      const baseUrl = 'https://api.aladhan.com/v1/timings'
      const dateParam = date ? `/${date}` : ''
      url = `${baseUrl}${dateParam}?latitude=${latitude}&longitude=${longitude}&method=${method}`
    } else {
      return NextResponse.json(
        {
          success: false,
          error: 'Either (city and country) or (latitude and longitude) are required'
        },
        { status: 400 }
      )
    }

    // Fetch prayer times from Aladhan API
    const response = await fetch(url, {
      next: { revalidate: 3600 } // Cache for 1 hour
    })

    if (!response.ok) {
      throw new Error('Failed to fetch prayer times')
    }

    const data = await response.json()

    if (data.code !== 200) {
      throw new Error(data.data || 'API Error')
    }

    return NextResponse.json({
      success: true,
      data: data.data
    })
  } catch (error) {
    console.error('Prayer times API error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch prayer times'
      },
      { status: 500 }
    )
  }
}

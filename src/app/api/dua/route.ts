import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')

    const where = category
      ? {
          category: {
            slug: category
          }
        }
      : {}

    const duas = await prisma.dua.findMany({
      where,
      orderBy: { order: 'asc' },
      include: {
        category: {
          select: {
            nameEn: true,
            nameId: true,
            slug: true
          }
        }
      }
    })

    return NextResponse.json(duas)
  } catch (error) {
    console.error('Error fetching duas:', error)
    return NextResponse.json(
      { error: 'Failed to fetch duas' },
      { status: 500 }
    )
  }
}

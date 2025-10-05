import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const categories = await prisma.duaCategory.findMany({
      orderBy: { order: 'asc' },
      include: {
        _count: {
          select: { duas: true }
        }
      }
    })

    const formatted = categories.map(cat => ({
      id: cat.id,
      nameEn: cat.nameEn,
      nameId: cat.nameId,
      slug: cat.slug,
      order: cat.order,
      duaCount: cat._count.duas
    }))

    return NextResponse.json(formatted)
  } catch (error) {
    console.error('Error fetching dua categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const bookmarkSchema = z.object({
  type: z.enum(['AYAH', 'DUA']),
  refId: z.number().int().positive()
})

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type')

    const where: any = { userId: session.user.id }
    if (type === 'AYAH' || type === 'DUA') {
      where.type = type
    }

    const bookmarks = await prisma.bookmark.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(bookmarks)
  } catch (error) {
    console.error('Error fetching bookmarks:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bookmarks' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validated = bookmarkSchema.parse(body)

    const bookmark = await prisma.bookmark.create({
      data: {
        userId: session.user.id,
        type: validated.type,
        refId: validated.refId
      }
    })

    return NextResponse.json({ success: true, data: bookmark })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }
    console.error('Error creating bookmark:', error)
    return NextResponse.json(
      { error: 'Failed to create bookmark' },
      { status: 500 }
    )
  }
}

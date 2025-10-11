import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const quranLastReadSchema = z.object({
  type: z.literal('QURAN'),
  surahId: z.number().int().positive(),
  ayahNumber: z.number().int().positive(),
  summary: z.string().optional().nullable(),
  url: z.string().optional().nullable()
})

const duaLastReadSchema = z.object({
  type: z.literal('DUA'),
  duaId: z.number().int().positive(),
  summary: z.string().optional().nullable(),
  url: z.string().optional().nullable()
})

const lastReadSchema = z.union([quranLastReadSchema, duaLastReadSchema])

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
    if (type === 'QURAN' || type === 'DUA') {
      where.type = type
    }

    const lastRead = await prisma.lastRead.findFirst({
      where
    })

    return NextResponse.json(lastRead, {
      headers: {
        'Cache-Control': 'private, max-age=60, stale-while-revalidate=120',
      },
    })
  } catch (error) {
    console.error('Error fetching last read:', error)
    return NextResponse.json(
      { error: 'Failed to fetch last read' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validated = lastReadSchema.parse(body)

    const data: any = {
      userId: session.user.id,
      type: validated.type,
      summary: validated.summary || null,
      url: validated.url || null
    }

    if (validated.type === 'QURAN') {
      data.surahId = validated.surahId
      data.ayahNumber = validated.ayahNumber
      data.duaId = null
    } else {
      data.duaId = validated.duaId
      data.surahId = null
      data.ayahNumber = null
    }

    const lastRead = await prisma.lastRead.upsert({
      where: {
        userId_type: {
          userId: session.user.id,
          type: validated.type
        }
      },
      update: data,
      create: data
    })

    return NextResponse.json({ success: true, data: lastRead })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }
    console.error('Error updating last read:', error)
    return NextResponse.json(
      { error: 'Failed to update last read' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const guestBookmarkSchema = z.object({
  type: z.enum(['AYAH', 'DUA']),
  refId: z.number().int().positive()
})

const guestLastReadSchema = z.object({
  type: z.enum(['QURAN', 'DUA']),
  surahId: z.number().int().positive().optional(),
  ayahNumber: z.number().int().positive().optional(),
  duaId: z.number().int().positive().optional()
})

const mergeSchema = z.object({
  bookmarks: z.array(guestBookmarkSchema),
  lastReads: z.array(guestLastReadSchema)
})

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
    const validated = mergeSchema.parse(body)

    let bookmarksCreated = 0
    let lastReadsCreated = 0

    // Merge bookmarks
    for (const bookmark of validated.bookmarks) {
      try {
        await prisma.bookmark.create({
          data: {
            userId: session.user.id,
            type: bookmark.type,
            refId: bookmark.refId
          }
        })
        bookmarksCreated++
      } catch (error) {
        // Skip duplicates
        console.log('Skipping duplicate bookmark:', bookmark)
      }
    }

    // Merge last reads
    for (const lastRead of validated.lastReads) {
      try {
        const data: any = {
          userId: session.user.id,
          type: lastRead.type
        }

        if (lastRead.type === 'QURAN' && lastRead.surahId && lastRead.ayahNumber) {
          data.surahId = lastRead.surahId
          data.ayahNumber = lastRead.ayahNumber
        } else if (lastRead.type === 'DUA' && lastRead.duaId) {
          data.duaId = lastRead.duaId
        }

        await prisma.lastRead.upsert({
          where: {
            userId_type: {
              userId: session.user.id,
              type: lastRead.type
            }
          },
          update: data,
          create: data
        })
        lastReadsCreated++
      } catch (error) {
        console.error('Error merging last read:', error)
      }
    }

    return NextResponse.json({
      success: true,
      merged: {
        bookmarks: bookmarksCreated,
        lastReads: lastReadsCreated
      }
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }
    console.error('Error merging guest data:', error)
    return NextResponse.json(
      { error: 'Failed to merge data' },
      { status: 500 }
    )
  }
}

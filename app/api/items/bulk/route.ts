import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { ids } = body

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: 'Invalid request. Provide an array of item IDs.' },
        { status: 400 }
      )
    }

    await prisma.item.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    })

    return NextResponse.json({ success: true, deletedCount: ids.length })
  } catch (error) {
    console.error('Error deleting items:', error)
    return NextResponse.json(
      { error: 'Failed to delete items' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { ids, storageLocationId } = body

    if (!ids || !Array.isArray(ids) || ids.length === 0 || !storageLocationId) {
      return NextResponse.json(
        { error: 'Invalid request. Provide an array of item IDs and a storage location ID.' },
        { status: 400 }
      )
    }

    await prisma.item.updateMany({
      where: {
        id: {
          in: ids,
        },
      },
      data: {
        storageLocationId,
      },
    })

    return NextResponse.json({ success: true, updatedCount: ids.length })
  } catch (error) {
    console.error('Error updating items:', error)
    return NextResponse.json(
      { error: 'Failed to update items' },
      { status: 500 }
    )
  }
}


import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const [
      totalItems,
      itemsByCategory,
      lowStockItems,
      expiringSoon,
      recentlyAdded,
      itemsByLocation,
    ] = await Promise.all([
      // Total items count
      prisma.item.count(),

      // Items by category
      prisma.item.groupBy({
        by: ['category'],
        _count: {
          category: true,
        },
      }),

      // Low stock items (quantity <= 2)
      prisma.item.findMany({
        where: {
          quantity: {
            lte: 2,
          },
        },
        take: 10,
        orderBy: {
          quantity: 'asc',
        },
        include: {
          storageLocation: true,
        },
      }),

      // Items expiring soon (within next 30 days)
      prisma.item.findMany({
        where: {
          expirationDate: {
            not: null,
            gte: new Date(),
            lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          },
        },
        take: 10,
        orderBy: {
          expirationDate: 'asc',
        },
        include: {
          storageLocation: true,
        },
      }),

      // Recently added items
      prisma.item.findMany({
        take: 5,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          storageLocation: true,
        },
      }),

      // Items by location
      prisma.storageLocation.findMany({
        include: {
          _count: {
            select: { items: true },
          },
        },
        orderBy: {
          room: 'asc',
        },
      }),
    ])

    return NextResponse.json({
      totalItems,
      itemsByCategory: itemsByCategory.map((item) => ({
        category: item.category,
        count: item._count.category,
      })),
      lowStockItems,
      expiringSoon,
      recentlyAdded,
      itemsByLocation: itemsByLocation.map((location) => ({
        id: location.id,
        name: location.name,
        room: location.room,
        count: location._count.items,
      })),
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    )
  }
}


import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search')
    const category = searchParams.get('category')
    const locationId = searchParams.get('locationId')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    const where: any = {}
    
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { category: { contains: search } },
        { notes: { contains: search } },
      ]
    }
    
    if (category) {
      where.category = category
    }
    
    if (locationId) {
      where.storageLocationId = locationId
    }

    const items = await prisma.item.findMany({
      where,
      include: {
        storageLocation: true,
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
    })

    return NextResponse.json(items)
  } catch (error) {
    console.error('Error fetching items:', error)
    return NextResponse.json(
      { error: 'Failed to fetch items' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      category,
      quantity,
      storageLocationId,
      purchaseDate,
      expirationDate,
      notes,
      imageUrl,
    } = body

    if (!name || !category || !storageLocationId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const item = await prisma.item.create({
      data: {
        name,
        category,
        quantity: quantity || 1,
        storageLocationId,
        purchaseDate: purchaseDate ? new Date(purchaseDate) : null,
        expirationDate: expirationDate ? new Date(expirationDate) : null,
        notes,
        imageUrl,
      },
      include: {
        storageLocation: true,
      },
    })

    return NextResponse.json(item, { status: 201 })
  } catch (error) {
    console.error('Error creating item:', error)
    return NextResponse.json(
      { error: 'Failed to create item' },
      { status: 500 }
    )
  }
}


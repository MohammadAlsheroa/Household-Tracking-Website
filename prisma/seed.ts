import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create storage locations
  const kitchenPantry = await prisma.storageLocation.create({
    data: {
      name: 'Kitchen Pantry',
      room: 'Kitchen',
      description: 'Main pantry for food items',
    },
  })

  const garageShelf1 = await prisma.storageLocation.create({
    data: {
      name: 'Garage Shelf 1',
      room: 'Garage',
      description: 'Top shelf in garage',
    },
  })

  const garageShelf2 = await prisma.storageLocation.create({
    data: {
      name: 'Garage Shelf 2',
      room: 'Garage',
      description: 'Middle shelf in garage',
    },
  })

  const bedroomCloset = await prisma.storageLocation.create({
    data: {
      name: 'Bedroom Closet',
      room: 'Bedroom',
      description: 'Main bedroom closet',
    },
  })

  const bathroomCabinet = await prisma.storageLocation.create({
    data: {
      name: 'Bathroom Cabinet',
      room: 'Bathroom',
      description: 'Medicine and toiletries cabinet',
    },
  })

  // Create items
  const items = [
    {
      name: 'Canned Tomatoes',
      category: 'Food',
      quantity: 6,
      storageLocationId: kitchenPantry.id,
      purchaseDate: new Date('2024-01-15'),
      expirationDate: new Date('2025-12-31'),
      notes: 'Organic brand',
    },
    {
      name: 'Pasta',
      category: 'Food',
      quantity: 4,
      storageLocationId: kitchenPantry.id,
      purchaseDate: new Date('2024-02-01'),
      expirationDate: new Date('2026-01-01'),
      notes: 'Various types',
    },
    {
      name: 'Olive Oil',
      category: 'Condiments',
      quantity: 2,
      storageLocationId: kitchenPantry.id,
      purchaseDate: new Date('2024-01-20'),
      expirationDate: new Date('2025-06-30'),
    },
    {
      name: 'Toolbox',
      category: 'Tools',
      quantity: 1,
      storageLocationId: garageShelf1.id,
      purchaseDate: new Date('2023-11-10'),
      notes: 'Contains various hand tools',
    },
    {
      name: 'Paint Cans',
      category: 'Supplies',
      quantity: 3,
      storageLocationId: garageShelf2.id,
      purchaseDate: new Date('2023-09-15'),
      notes: 'White, blue, and red paint',
    },
    {
      name: 'Winter Jackets',
      category: 'Clothing',
      quantity: 4,
      storageLocationId: bedroomCloset.id,
      notes: 'Stored for next season',
    },
    {
      name: 'Aspirin',
      category: 'Medicine',
      quantity: 1,
      storageLocationId: bathroomCabinet.id,
      purchaseDate: new Date('2024-01-10'),
      expirationDate: new Date('2025-12-31'),
      notes: '100 tablets',
    },
    {
      name: 'Toothpaste',
      category: 'Toiletries',
      quantity: 2,
      storageLocationId: bathroomCabinet.id,
      purchaseDate: new Date('2024-02-05'),
      expirationDate: new Date('2025-12-31'),
    },
    {
      name: 'Rice',
      category: 'Food',
      quantity: 1,
      storageLocationId: kitchenPantry.id,
      purchaseDate: new Date('2024-02-10'),
      expirationDate: new Date('2025-12-31'),
      notes: '5kg bag',
    },
    {
      name: 'Batteries',
      category: 'Electronics',
      quantity: 8,
      storageLocationId: garageShelf1.id,
      purchaseDate: new Date('2024-01-25'),
      expirationDate: new Date('2026-12-31'),
      notes: 'AA and AAA mix',
    },
  ]

  for (const item of items) {
    await prisma.item.create({
      data: item,
    })
  }

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })


'use client'

import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Dashboard from '@/components/dashboard'
import ItemsList from '@/components/items-list'
import LocationsList from '@/components/locations-list'
import { Package, MapPin, LayoutDashboard } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">Household Inventory Tracker</h1>
          <p className="text-muted-foreground mt-2">
            Manage your household items and storage locations
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="items" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Items
            </TabsTrigger>
            <TabsTrigger value="locations" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Locations
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="mt-6">
            <Dashboard />
          </TabsContent>

          <TabsContent value="items" className="mt-6">
            <ItemsList />
          </TabsContent>

          <TabsContent value="locations" className="mt-6">
            <LocationsList />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}


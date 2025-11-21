'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, AlertTriangle, Calendar, TrendingUp } from 'lucide-react'
import { format } from 'date-fns'
import Image from 'next/image'

interface Stats {
  totalItems: number
  itemsByCategory: { category: string; count: number }[]
  lowStockItems: any[]
  expiringSoon: any[]
  recentlyAdded: any[]
  itemsByLocation: { id: string; name: string; room: string; count: number }[]
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading...</div>
  }

  if (!stats) {
    return <div className="text-center py-8">Failed to load statistics</div>
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalItems}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.lowStockItems.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.expiringSoon.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage Locations</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.itemsByLocation.length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Items by Category */}
        <Card>
          <CardHeader>
            <CardTitle>Items by Category</CardTitle>
            <CardDescription>Distribution of items across categories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stats.itemsByCategory.length > 0 ? (
                stats.itemsByCategory.map((item) => (
                  <div key={item.category} className="flex items-center justify-between">
                    <span className="text-sm">{item.category}</span>
                    <span className="text-sm font-medium">{item.count}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No categories yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Items by Location */}
        <Card>
          <CardHeader>
            <CardTitle>Items by Location</CardTitle>
            <CardDescription>Number of items in each storage location</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stats.itemsByLocation.length > 0 ? (
                stats.itemsByLocation.map((location) => (
                  <div key={location.id} className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium">{location.name}</span>
                      <span className="text-xs text-muted-foreground ml-2">({location.room})</span>
                    </div>
                    <span className="text-sm font-medium">{location.count}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No locations yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Items */}
      {stats.lowStockItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Low Stock Items</CardTitle>
            <CardDescription>Items with quantity of 2 or less</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.lowStockItems.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  {item.imageUrl && (
                    <div className="relative h-16 w-16 rounded-md overflow-hidden">
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.storageLocation.name} • Quantity: {item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Expiring Soon */}
      {stats.expiringSoon.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Expiring Soon</CardTitle>
            <CardDescription>Items expiring within the next 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.expiringSoon.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  {item.imageUrl && (
                    <div className="relative h-16 w-16 rounded-md overflow-hidden">
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.storageLocation.name} • Expires: {item.expirationDate ? format(new Date(item.expirationDate), 'MMM dd, yyyy') : 'N/A'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recently Added */}
      {stats.recentlyAdded.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recently Added</CardTitle>
            <CardDescription>Latest items added to your inventory</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentlyAdded.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  {item.imageUrl && (
                    <div className="relative h-16 w-16 rounded-md overflow-hidden">
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.category} • {item.storageLocation.name} • Added {format(new Date(item.createdAt), 'MMM dd, yyyy')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}


'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Edit, Trash2, MapPin } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface StorageLocation {
  id: string
  name: string
  room: string
  description: string | null
  _count: {
    items: number
  }
}

export default function LocationsList() {
  const [locations, setLocations] = useState<StorageLocation[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingLocation, setEditingLocation] = useState<StorageLocation | null>(null)
  const [deleteLocationId, setDeleteLocationId] = useState<string | null>(null)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: '',
    room: '',
    description: '',
  })

  useEffect(() => {
    fetchLocations()
  }, [])

  const fetchLocations = async () => {
    try {
      const response = await fetch('/api/locations')
      if (response.ok) {
        const data = await response.json()
        setLocations(data)
      }
    } catch (error) {
      console.error('Error fetching locations:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = editingLocation ? `/api/locations/${editingLocation.id}` : '/api/locations'
      const method = editingLocation ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: editingLocation ? 'Location updated' : 'Location created',
          description: `Successfully ${editingLocation ? 'updated' : 'created'} the storage location.`,
        })
        setIsDialogOpen(false)
        resetForm()
        fetchLocations()
      } else {
        throw new Error('Failed to save location')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save location. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const handleEdit = (location: StorageLocation) => {
    setEditingLocation(location)
    setFormData({
      name: location.name,
      room: location.room,
      description: location.description || '',
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!deleteLocationId) return

    try {
      const response = await fetch(`/api/locations/${deleteLocationId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast({
          title: 'Location deleted',
          description: 'The storage location has been successfully deleted.',
        })
        setIsDeleteDialogOpen(false)
        setDeleteLocationId(null)
        fetchLocations()
      } else {
        throw new Error('Failed to delete location')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete location. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      room: '',
      description: '',
    })
    setEditingLocation(null)
  }

  // Group locations by room
  const locationsByRoom = locations.reduce((acc, location) => {
    if (!acc[location.room]) {
      acc[location.room] = []
    }
    acc[location.room].push(location)
    return acc
  }, {} as Record<string, StorageLocation[]>)

  if (loading) {
    return <div className="text-center py-8">Loading...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Storage Locations</h2>
        <Button onClick={() => { resetForm(); setIsDialogOpen(true) }}>
          <Plus className="h-4 w-4 mr-2" />
          Add Location
        </Button>
      </div>

      {/* Locations by Room */}
      {Object.keys(locationsByRoom).length > 0 ? (
        <div className="space-y-6">
          {Object.entries(locationsByRoom).map(([room, roomLocations]) => (
            <div key={room}>
              <h3 className="text-xl font-semibold mb-4">{room}</h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {roomLocations.map((location) => (
                  <Card key={location.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{location.name}</CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">
                            {location._count.items} item(s)
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(location)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setDeleteLocationId(location.id)
                              setIsDeleteDialogOpen(true)
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {location.description && (
                        <p className="text-sm text-muted-foreground">{location.description}</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No storage locations found. Add your first location to get started.</p>
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        setIsDialogOpen(open)
        if (!open) resetForm()
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingLocation ? 'Edit Location' : 'Add New Location'}</DialogTitle>
            <DialogDescription>
              {editingLocation ? 'Update the storage location details below.' : 'Fill in the details to add a new storage location.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Kitchen Pantry, Garage Shelf 2"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="room">Room/Zone *</Label>
                <Input
                  id="room"
                  value={formData.room}
                  onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                  placeholder="e.g., Kitchen, Garage, Bedroom"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Optional description of this storage location"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => {
                setIsDialogOpen(false)
                resetForm()
              }}>
                Cancel
              </Button>
              <Button type="submit">{editingLocation ? 'Update' : 'Create'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the storage location and all items stored in it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}


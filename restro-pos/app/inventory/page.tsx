"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

type InventoryItem = {
  id: number
  name: string
  quantity: number
  unit: string
  lowStockThreshold: number
}

export default function Inventory() {
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [newItem, setNewItem] = useState<Omit<InventoryItem, "id">>({
    name: "",
    quantity: 0,
    unit: "",
    lowStockThreshold: 0,
  })
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null)

  useEffect(() => {
    // In a real application, this would fetch data from an API
    const mockData: InventoryItem[] = [
      { id: 1, name: "Wheat Flour", quantity: 50, unit: "kg", lowStockThreshold: 10 },
      { id: 2, name: "Potatoes", quantity: 30, unit: "kg", lowStockThreshold: 5 },
      { id: 3, name: "Paneer", quantity: 15, unit: "kg", lowStockThreshold: 3 },
    ]
    setInventory(mockData)
  }, [])

  const addItem = () => {
    const newId = Math.max(...inventory.map((item) => item.id), 0) + 1
    setInventory([...inventory, { id: newId, ...newItem }])
    setNewItem({ name: "", quantity: 0, unit: "", lowStockThreshold: 0 })
    toast.success("Item added successfully")
  }

  const updateItem = () => {
    if (editingItem) {
      setInventory(inventory.map((item) => (item.id === editingItem.id ? editingItem : item)))
      setEditingItem(null)
      toast.success("Item updated successfully")
    }
  }

  const deleteItem = (id: number) => {
    setInventory(inventory.filter((item) => item.id !== id))
    toast.success("Item deleted successfully")
  }

  const downloadInventory = (format: "pdf" | "excel" | "csv") => {
    // In a real application, this would generate and download the file
    toast.info(`Downloading inventory in ${format.toUpperCase()} format`)
  }

  return (
    <div className="p-8 bg-background">
      <ToastContainer />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-primary">Inventory Management</h1>
        <div className="space-x-2">
          <Button onClick={() => downloadInventory("pdf")}>Download PDF</Button>
          <Button onClick={() => downloadInventory("excel")}>Download Excel</Button>
          <Button onClick={() => downloadInventory("csv")}>Download CSV</Button>
        </div>
      </div>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Add New Item</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input
              placeholder="Item Name"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            />
            <Input
              type="number"
              placeholder="Quantity"
              value={newItem.quantity}
              onChange={(e) => setNewItem({ ...newItem, quantity: Number(e.target.value) })}
            />
            <Input
              placeholder="Unit"
              value={newItem.unit}
              onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
            />
            <Input
              type="number"
              placeholder="Low Stock Threshold"
              value={newItem.lowStockThreshold}
              onChange={(e) => setNewItem({ ...newItem, lowStockThreshold: Number(e.target.value) })}
            />
            <Button onClick={addItem}>Add Item</Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Current Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Low Stock Threshold</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventory.map((item) => (
                <TableRow key={item.id} className={item.quantity <= item.lowStockThreshold ? "bg-red-100" : ""}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.unit}</TableCell>
                  <TableCell>{item.lowStockThreshold}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" onClick={() => setEditingItem(item)}>
                            Edit
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Item</DialogTitle>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="name" className="text-right">
                                Name
                              </Label>
                              <Input
                                id="name"
                                value={editingItem?.name}
                                onChange={(e) =>
                                  setEditingItem(editingItem ? { ...editingItem, name: e.target.value } : null)
                                }
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="quantity" className="text-right">
                                Quantity
                              </Label>
                              <Input
                                id="quantity"
                                type="number"
                                value={editingItem?.quantity}
                                onChange={(e) =>
                                  setEditingItem(
                                    editingItem ? { ...editingItem, quantity: Number(e.target.value) } : null,
                                  )
                                }
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="unit" className="text-right">
                                Unit
                              </Label>
                              <Input
                                id="unit"
                                value={editingItem?.unit}
                                onChange={(e) =>
                                  setEditingItem(editingItem ? { ...editingItem, unit: e.target.value } : null)
                                }
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="lowStockThreshold" className="text-right">
                                Low Stock Threshold
                              </Label>
                              <Input
                                id="lowStockThreshold"
                                type="number"
                                value={editingItem?.lowStockThreshold}
                                onChange={(e) =>
                                  setEditingItem(
                                    editingItem ? { ...editingItem, lowStockThreshold: Number(e.target.value) } : null,
                                  )
                                }
                                className="col-span-3"
                              />
                            </div>
                          </div>
                          <Button onClick={updateItem}>Update Item</Button>
                        </DialogContent>
                      </Dialog>
                      <Button variant="destructive" onClick={() => deleteItem(item.id)}>
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}


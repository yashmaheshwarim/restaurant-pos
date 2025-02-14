"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useAuthContext } from "../AuthContext"
import { useRouter } from "next/navigation"
import { menuItems } from "../data/menu"
import { printReceipt } from "../utils/printer"
import Image from "next/image"

type OrderItem = {
  id: number
  name: string
  price: number
  quantity: number
}

export default function ParcelOrder() {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  const [customerName, setCustomerName] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [discount, setDiscount] = useState(0)
  const { isAuthenticated } = useAuthContext()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, router])

  const addItem = (item: { id: number; name: string; price: number }) => {
    const existingItem = orderItems.find((orderItem) => orderItem.id === item.id)
    if (existingItem) {
      setOrderItems(
        orderItems.map((orderItem) =>
          orderItem.id === item.id ? { ...orderItem, quantity: orderItem.quantity + 1 } : orderItem,
        ),
      )
    } else {
      setOrderItems([...orderItems, { ...item, quantity: 1 }])
    }
  }

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity === 0) {
      setOrderItems(orderItems.filter((item) => item.id !== id))
    } else {
      setOrderItems(orderItems.map((item) => (item.id === id ? { ...item, quantity } : item)))
    }
  }

  const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const total = subtotal - discount

  const handlePrint = async () => {
    const currentDate = new Date()
    const billNumber = Math.floor(Math.random() * 1000000)

    const receiptContent = `
Date: ${currentDate.toLocaleString()}
Bill No: ${billNumber}

Customer: ${customerName}
Phone: ${customerPhone}

--------------------------------
${orderItems
  .map(
    (item) =>
      `${item.name.padEnd(20)} ${item.quantity.toString().padEnd(3)} ${item.price.toFixed(2).padStart(8)} ${(item.price * item.quantity).toFixed(2).padStart(8)}`,
  )
  .join("\n")}
--------------------------------
Subtotal:               ${subtotal.toFixed(2).padStart(8)}
Discount:               ${discount.toFixed(2).padStart(8)}
--------------------------------
Total:                  ${total.toFixed(2).padStart(8)}

Thank you for dining with us!
`

    try {
      const printed = await printReceipt(receiptContent)
      if (!printed) {
        throw new Error("Printing failed")
      }

      // Store order data
      const currentDate = new Date().toISOString().split("T")[0]
      const salesData = JSON.parse(localStorage.getItem("salesData") || "{}")
      if (!salesData[currentDate]) {
        salesData[currentDate] = { daily: 0, orders: [] }
      }
      salesData[currentDate].daily += total
      salesData[currentDate].orders.push({
        customerName,
        customerPhone,
        items: orderItems,
        subtotal,
        discount,
        total,
        timestamp: new Date().toISOString(),
      })
      localStorage.setItem("salesData", JSON.stringify(salesData))

      toast.success("Order completed and bill printed successfully")

      // Reset form
      setOrderItems([])
      setCustomerName("")
      setCustomerPhone("")
      setDiscount(0)
    } catch (error) {
      toast.error("Failed to print bill. Please check printer connection.")
      console.error("Printing error:", error)
    }
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="p-8 bg-background">
      <ToastContainer />
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-primary">Parcel Order</h1>
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Virtual%20Hub%20logo.jpg-I1FlNMEUGjkmVz5tV2ky7mk5NhRupI.jpeg"
          alt="VertexHub Logo"
          width={100}
          height={40}
          className="opacity-80"
        />
      </div>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-2/3">
          <Card>
            <CardHeader>
              <CardTitle>Menu Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {menuItems.map((item) => (
                  <Button
                    key={item.id}
                    variant="outline"
                    onClick={() => addItem(item)}
                    className="h-auto py-4 flex flex-col"
                  >
                    <span>{item.name}</span>
                    <span className="text-sm">₹{item.price}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        <Card className="w-full md:w-1/3">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Label htmlFor="customerName">Customer Name:</Label>
                <Input id="customerName" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
              </div>
              <div className="flex items-center gap-4">
                <Label htmlFor="customerPhone">Customer Phone:</Label>
                <Input id="customerPhone" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} />
              </div>
            </div>
            <Table className="mt-4">
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orderItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.id, Number.parseInt(e.target.value))}
                        className="w-16"
                      />
                    </TableCell>
                    <TableCell>₹{(item.price * item.quantity).toFixed(2)}</TableCell>
                    <TableCell>
                      <Button variant="destructive" size="sm" onClick={() => updateQuantity(item.id, 0)}>
                        Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Discount:</span>
                <Input
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(Math.max(0, Math.min(subtotal, Number.parseFloat(e.target.value))))}
                  className="w-24"
                />
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>
            <Button className="mt-4 w-full" onClick={handlePrint} disabled={orderItems.length === 0}>
              Print Bill
            </Button>
            <div className="text-center text-sm text-muted-foreground mt-4">Developed by VertexHub</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


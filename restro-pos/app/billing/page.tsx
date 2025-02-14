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
import { printReceipt } from "../utils/printer"
import Image from "next/image"

const THALI_PRICE = 220

export default function Billing() {
  const [quantity, setQuantity] = useState(1)
  const [discountPercent, setDiscountPercent] = useState(0)
  const [customerName, setCustomerName] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const { isAuthenticated } = useAuthContext()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, router])

  const subtotal = THALI_PRICE * quantity
  const discountAmount = (subtotal * discountPercent) / 100
  const totalBeforeRound = subtotal - discountAmount
  const total = Math.round(totalBeforeRound) // Round to nearest rupee

  const handlePrint = async () => {
    const currentDate = new Date()
    const billNumber = Math.floor(Math.random() * 1000000)

    const receiptContent = `
Date: ${currentDate.toLocaleString()}
Bill No: ${billNumber}

Customer: ${customerName}
Phone: ${customerPhone}

--------------------------------
Item           Qty    Price   Total
Fixed Thali    ${quantity.toString().padEnd(3)} ${THALI_PRICE.toFixed(2).padStart(8)} ${(THALI_PRICE * quantity).toFixed(2).padStart(8)}
--------------------------------
Subtotal:               ${subtotal.toFixed(2).padStart(8)}
Discount (${discountPercent}%):    ${discountAmount.toFixed(2).padStart(8)}
--------------------------------
Total:                  ${totalBeforeRound.toFixed(2).padStart(8)}
Rounded Total:          ${total.toFixed(2).padStart(8)}

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
        quantity,
        subtotal,
        discountPercent,
        discountAmount,
        total,
        timestamp: new Date().toISOString(),
      })
      localStorage.setItem("salesData", JSON.stringify(salesData))

      toast.success("Bill printed successfully")

      // Reset form
      setQuantity(1)
      setDiscountPercent(0)
      setCustomerName("")
      setCustomerPhone("")
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
        <h1 className="text-3xl font-bold text-primary">Billing</h1>
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Virtual%20Hub%20logo.jpg-I1FlNMEUGjkmVz5tV2ky7mk5NhRupI.jpeg"
          alt="VertexHub Logo"
          width={100}
          height={40}
          className="opacity-80"
        />
      </div>
      <div className="flex flex-col md:flex-row gap-8">
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Fixed Thali - ₹{THALI_PRICE}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Label htmlFor="quantity">Quantity:</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number.parseInt(e.target.value)))}
                  className="w-20"
                />
              </div>
              <div className="flex items-center gap-4">
                <Label htmlFor="customerName">Customer Name:</Label>
                <Input id="customerName" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
              </div>
              <div className="flex items-center gap-4">
                <Label htmlFor="customerPhone">Customer Phone:</Label>
                <Input id="customerPhone" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} />
              </div>
              <div className="flex items-center gap-4">
                <Label htmlFor="discount">Discount %:</Label>
                <Input
                  id="discount"
                  type="number"
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(Math.max(0, Math.min(100, Number.parseFloat(e.target.value))))}
                  className="w-24"
                />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Fixed Thali</TableCell>
                  <TableCell>{quantity}</TableCell>
                  <TableCell>₹{(THALI_PRICE * quantity).toFixed(2)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Discount ({discountPercent}%):</span>
                <span>₹{discountAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Before Rounding:</span>
                <span>₹{totalBeforeRound.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Final Total:</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>
            <Button className="mt-4 w-full" onClick={handlePrint}>
              Print Bill
            </Button>
            <div className="text-center text-sm text-muted-foreground mt-4">Developed by VertexHub</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const INITIAL_ORDERS = [
  { id: 1, platform: "Zomato", items: 2, total: 440, status: "New" },
  { id: 2, platform: "Swiggy", items: 1, total: 220, status: "Preparing" },
  { id: 3, platform: "Zomato", items: 3, total: 660, status: "Ready" },
]

export default function OnlineOrders() {
  const [orders, setOrders] = useState(INITIAL_ORDERS)

  const updateStatus = (id: number, newStatus: string) => {
    setOrders(orders.map((order) => (order.id === id ? { ...order, status: newStatus } : order)))
  }

  const handlePrint = (order: (typeof INITIAL_ORDERS)[0]) => {
    const printContent = `
      <h1 style="text-align: center;">Raghuvanshi Parotha House (Chotilawala)</h1>
      <h2 style="text-align: center;">Online Order - ${order.platform}</h2>
      <p><strong>Order ID:</strong> ${order.id}</p>
      <p><strong>Items:</strong> ${order.items}</p>
      <p><strong>Total:</strong> ₹${order.total.toFixed(2)}</p>
      <p><strong>Status:</strong> ${order.status}</p>
      <p>Thank you for your order!</p>
    `

    const printWindow = window.open("", "_blank")
    printWindow?.document.write("<html><head><title>Print</title></head><body>")
    printWindow?.document.write(printContent)
    printWindow?.document.write("</body></html>")
    printWindow?.document.close()
    printWindow?.print()
  }

  return (
    <div className="p-8 bg-background">
      <h1 className="text-3xl font-bold mb-6 text-primary">Online Orders</h1>
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Platform</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.platform}</TableCell>
                  <TableCell>{order.items}</TableCell>
                  <TableCell>₹{order.total.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        order.status === "New" ? "default" : order.status === "Preparing" ? "secondary" : "success"
                      }
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => updateStatus(order.id, "Preparing")}>
                        Prepare
                      </Button>
                      <Button size="sm" onClick={() => updateStatus(order.id, "Ready")}>
                        Ready
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handlePrint(order)}>
                        Print
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


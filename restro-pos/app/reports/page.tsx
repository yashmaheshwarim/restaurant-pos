"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useAuthContext } from "../AuthContext"
import { useRouter } from "next/navigation"
import * as XLSX from "xlsx"
import { jsPDF } from "jspdf"
import "jspdf-autotable"

export default function Reports() {
  const [selectedReport, setSelectedReport] = useState("sales")
  const [dailySales, setDailySales] = useState(0)
  const [monthlySales, setMonthlySales] = useState(0)
  const { isAuthenticated } = useAuthContext()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/")
    } else {
      const salesData = JSON.parse(localStorage.getItem("salesData") || "{}") as SalesDataType
      const currentDate = new Date().toISOString().split("T")[0]
      const currentMonth = currentDate.substring(0, 7)
  
      const dailyTotal = salesData[currentDate]?.daily || 0
      const monthlyTotal = Object.entries(salesData)
        .filter(([date]) => date.startsWith(currentMonth))
        .reduce((sum, [, data]) => sum + (data as { daily: number }).daily, 0)
  
      setDailySales(dailyTotal)
      setMonthlySales(monthlyTotal)
    }
  }, [isAuthenticated, router])
  

  const generateReportData = () => {
    const salesData = JSON.parse(localStorage.getItem("salesData") || "{}")
    if (selectedReport === "sales") {
      return [
        ["Date", "Daily Sales"],
        ...Object.entries(salesData).map(([date, data]) => [date, data.daily.toFixed(2)]),
      ]
    } else if (selectedReport === "orders") {
      const allOrders = Object.values(salesData).flatMap((data) => data.orders)
      return [
        ["Timestamp", "Customer Name", "Phone", "Quantity", "Subtotal", "Discount", "Total"],
        ...allOrders.map((order) => [
          order.timestamp,
          order.customerName,
          order.customerPhone,
          order.quantity,
          order.subtotal.toFixed(2),
          order.discount.toFixed(2),
          order.total.toFixed(2),
        ]),
      ]
    }
    return []
  }

  const downloadPDF = () => {
    const doc = new jsPDF()
    const reportData = generateReportData()
    doc.text(`${selectedReport.charAt(0).toUpperCase() + selectedReport.slice(1)} Report`, 14, 15)
    doc.autoTable({
      head: [reportData[0]],
      body: reportData.slice(1),
      startY: 20,
    })
    doc.save(`${selectedReport}_report.pdf`)
    toast.success(`${selectedReport} report downloaded in PDF format`)
  }

  const downloadExcel = () => {
    const reportData = generateReportData()
    const ws = XLSX.utils.aoa_to_sheet(reportData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Report")
    XLSX.writeFile(wb, `${selectedReport}_report.xlsx`)
    toast.success(`${selectedReport} report downloaded in Excel format`)
  }

  const downloadCSV = () => {
    const reportData = generateReportData()
    const csv = reportData.map((row) => row.join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute("href", url)
      link.setAttribute("download", `${selectedReport}_report.csv`)
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
    toast.success(`${selectedReport} report downloaded in CSV format`)
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="p-8 bg-background">
      <ToastContainer />
      <h1 className="text-3xl font-bold mb-6 text-primary">Reports</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Generate Report</CardTitle>
          </CardHeader>
          <CardContent>
            <Select onValueChange={setSelectedReport} defaultValue={selectedReport}>
              <SelectTrigger>
                <SelectValue placeholder="Select report type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sales">Sales Report</SelectItem>
                <SelectItem value="orders">Order Details</SelectItem>
              </SelectContent>
            </Select>
            <div className="mt-4 space-y-2">
              <Button className="w-full" onClick={downloadPDF}>
                Download PDF
              </Button>
              <Button className="w-full" onClick={downloadExcel}>
                Download Excel
              </Button>
              <Button className="w-full" onClick={downloadCSV}>
                Download CSV
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Daily Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">₹{dailySales.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Monthly Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">₹{monthlySales.toFixed(2)}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


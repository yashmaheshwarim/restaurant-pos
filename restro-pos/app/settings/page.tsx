"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Settings() {
  const [settings, setSettings] = useState({
    restaurantName: "Raghuvanshi Parotha House (Chotilawala)",
    address: "123 Main St, City, State, 12345",
    phone: "+91 1234567890",
    gstNumber: "GSTIN1234567890",
    footerText: "Thank you for dining with us!",
    zomatoId: "ZOMATO123",
    swiggyId: "SWIGGY456",
    thaliPrice: "220",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSettings({ ...settings, [e.target.name]: e.target.value })
  }

  const saveSettings = () => {
    // In a real application, this would save the settings to a backend API
    alert("Settings saved!")
  }

  return (
    <div className="p-8 bg-background">
      <h1 className="text-3xl font-bold mb-6 text-primary">Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>Restaurant Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="restaurantName">Restaurant Name</Label>
              <Input
                id="restaurantName"
                name="restaurantName"
                value={settings.restaurantName}
                onChange={handleChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="address">Address</Label>
              <Textarea id="address" name="address" value={settings.address} onChange={handleChange} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" value={settings.phone} onChange={handleChange} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="gstNumber">GST Number</Label>
              <Input id="gstNumber" name="gstNumber" value={settings.gstNumber} onChange={handleChange} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="footerText">Bill Footer Text</Label>
              <Textarea id="footerText" name="footerText" value={settings.footerText} onChange={handleChange} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="zomatoId">Zomato ID</Label>
              <Input id="zomatoId" name="zomatoId" value={settings.zomatoId} onChange={handleChange} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="swiggyId">Swiggy ID</Label>
              <Input id="swiggyId" name="swiggyId" value={settings.swiggyId} onChange={handleChange} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="thaliPrice">Thali Price</Label>
              <Input id="thaliPrice" name="thaliPrice" value={settings.thaliPrice} onChange={handleChange} />
            </div>
          </div>
          <Button className="mt-4" onClick={saveSettings}>
            Save Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}


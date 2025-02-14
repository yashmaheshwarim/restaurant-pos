"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"
import { useAuthContext } from "../AuthContext"
import Image from "next/image"

export default function Login() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const { login } = useAuthContext()

  const handleLogin = () => {
    if (login(username, password)) {
      setUsername("")
      setPassword("")
    } else {
      alert("Invalid credentials")
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-background">
      <div className="absolute top-8 right-8">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Virtual%20Hub%20logo.jpg-I1FlNMEUGjkmVz5tV2ky7mk5NhRupI.jpeg"
          alt="VertexHub Logo"
          width={100}
          height={40}
          className="opacity-80"
        />
      </div>
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle className="text-center">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button className="w-full" onClick={handleLogin}>
              Login
            </Button>
          </div>
          <div className="text-center text-sm text-muted-foreground mt-4">Developed by VertexHub</div>
        </CardContent>
      </Card>
    </main>
  )
}


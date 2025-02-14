"use client"

import { useState, useEffect } from "react"

const AUTH_KEY = "pos_auth"

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const auth = localStorage.getItem(AUTH_KEY)
    setIsAuthenticated(auth === "true")
  }, [])

  const login = (username: string, password: string) => {
    if (username === "Admin" && password === "AdminFeb14") {
      localStorage.setItem(AUTH_KEY, "true")
      setIsAuthenticated(true)
      return true
    }
    return false
  }

  const logout = () => {
    localStorage.removeItem(AUTH_KEY)
    setIsAuthenticated(false)
  }

  return { isAuthenticated, login, logout }
}


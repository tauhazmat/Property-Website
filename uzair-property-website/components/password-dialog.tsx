"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock, Eye, EyeOff, X } from "lucide-react"

interface PasswordDialogProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function PasswordDialog({ isOpen, onClose, onSuccess }: PasswordDialogProps) {
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const correctPassword = "examplepassword" // Line 23

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Simulate a small delay for security
    await new Promise((resolve) => setTimeout(resolve, 500))

    if (password === correctPassword) {
      onSuccess()
      setPassword("")
      setError("")
    } else {
      setError("Incorrect password. Please try again.")
    }

    setIsLoading(false)
  }

  const handleClose = () => {
    setPassword("")
    setError("")
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="h-8 w-8 text-blue-600" />
          </div>
          <CardTitle className="text-xl">Admin Access Required</CardTitle>
          <CardDescription>Please enter the ADMIN PASS to access the property management panel.</CardDescription>    
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`pr-10 ${error ? "border-red-500" : ""}`}
                disabled={isLoading}
                autoFocus
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {error && (
              <div className="text-red-500 text-sm flex items-center">
                <X className="h-4 w-4 mr-1" />
                {error}
              </div>
            )}

            <div className="flex space-x-3">
              <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700" disabled={!password || isLoading}>
                {isLoading ? "Verifying..." : "Access Admin"}
              </Button>
              <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
                Cancel
              </Button>
            </div>
          </form>

          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 text-center">
              🔒 This area is protected. Only authorized ADMIN(s) can access the property management system.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Uzair Property House & Builders - Quality Construction & Real Estate",
  description:
    "Uzair Property House & Builders - Your trusted partner in creating exceptional residential and commercial spaces with quality construction and innovative designs since 2016.",
  keywords: "property development, construction, real estate, Pakistan, builders, residential, commercial",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}

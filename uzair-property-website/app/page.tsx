"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Building2,
  Home,
  Phone,
  Mail,
  MapPin,
  Clock,
  Users,
  Award,
  CheckCircle,
  Star,
  Menu,
  X,
  Plus,
  Loader2,
  Database,
  Send,
  AlertCircle,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { PropertyCarousel } from "@/components/property-carousel"
import { PropertyAdmin } from "@/components/property-admin"
import { PasswordDialog } from "@/components/password-dialog"
import { PropertyDetailsModal } from "@/components/property-details-modal"
import { type Property, subscribeToProperties, initializeSampleData } from "@/lib/firebase-service"

export default function UzairPropertyWebsite() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeContact, setActiveContact] = useState<string | null>(null)
  const [properties, setProperties] = useState<Property[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isConnected, setIsConnected] = useState(false)
  const [connectionError, setConnectionError] = useState<string | null>(null)
  const [showAdmin, setShowAdmin] = useState(false)
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false)

  // Property details modal state
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [showPropertyDetails, setShowPropertyDetails] = useState(false)

  // Contact form state
  const [contactForm, setContactForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [isSubmittingContact, setIsSubmittingContact] = useState(false)

  // Initialize Firebase and load properties
  useEffect(() => {
    const initializeFirebase = async () => {
      try {
        setIsLoading(true)
        setConnectionError(null)

        // Initialize sample data if needed
        await initializeSampleData()

        // Subscribe to real-time updates
        const unsubscribe = subscribeToProperties((fetchedProperties) => {
          setProperties(fetchedProperties)
          setIsConnected(true)
          setIsLoading(false)
          setConnectionError(null)
        })

        return unsubscribe
      } catch (error) {
        console.error("Failed to initialize Firebase:", error)
        setConnectionError("Database connection failed. Using demo data.")
        setIsConnected(false)
        setIsLoading(false)

        // Load demo data as fallback
        const demoProperties: Property[] = []
        setProperties(demoProperties)
      }
    }

    const unsubscribe = initializeFirebase()

    return () => {
      if (unsubscribe) {
        unsubscribe.then((unsub) => unsub && unsub())
      }
    }
  }, [])

  // Handle property details view
  const handleViewDetails = (property: Property) => {
    setSelectedProperty(property)
    setShowPropertyDetails(true)
  }

  const handleClosePropertyDetails = () => {
    setShowPropertyDetails(false)
    setSelectedProperty(null)
  }

  // Scroll to properties section
  const scrollToProperties = () => {
    const propertiesSection = document.getElementById("properties")
    if (propertiesSection) {
      propertiesSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  // Handle contact form submission
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmittingContact(true)

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactForm),
      })

      if (response.ok) {
        alert("Message sent successfully! We'll get back to you within 24 hours.")
        setContactForm({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        })
      } else {
        throw new Error("Failed to send message")
      }
    } catch (error) {
      console.error("Error sending message:", error)
      alert("Failed to send message. Please try again or contact us directly.")
    } finally {
      setIsSubmittingContact(false)
    }
  }

  const handleContactInputChange = (field: string, value: string) => {
    setContactForm((prev) => ({ ...prev, [field]: value }))
  }

  const services = [
    {
      icon: <Building2 className="h-6 w-6 sm:h-8 sm:w-8" />,
      title: "Property Development",
      description: "Complete property development from planning to completion with modern amenities.",
    },
    {
      icon: <Home className="h-6 w-6 sm:h-8 sm:w-8" />,
      title: "Construction Services",
      description: "High-quality construction services for residential and commercial projects.",
    },
    {
      icon: <Users className="h-6 w-6 sm:h-8 sm:w-8" />,
      title: "Real Estate Consultation",
      description: "Expert guidance for property investment and real estate decisions.",
    },
    {
      icon: <Award className="h-6 w-6 sm:h-8 sm:w-8" />,
      title: "Project Management",
      description: "End-to-end project management ensuring timely delivery and quality.",
    },
  ]

  const contactMethods = [
    {
      id: "phone",
      icon: <Phone className="h-5 w-5 sm:h-6 sm:w-6" />,
      title: "Phone",
      primary: "+92 300 1234567",
      secondary: "+92 321 7654321",
      action: "Call Now",
    },
    {
      id: "email",
      icon: <Mail className="h-5 w-5 sm:h-6 sm:w-6" />,
      title: "Email",
      primary: "info@uzairproperty.com",
      secondary: "sales@uzairproperty.com",
      action: "Send Email",
    },
    {
      id: "address",
      icon: <MapPin className="h-5 w-5 sm:h-6 sm:w-6" />,
      title: "Office Address",
      primary: "123 Main Street, Business District",
      secondary: "City Center, Pakistan",
      action: "Get Directions",
    },
    {
      id: "hours",
      icon: <Clock className="h-5 w-5 sm:h-6 sm:w-6" />,
      title: "Business Hours",
      primary: "Mon - Sat: 9:00 AM - 7:00 PM",
      secondary: "Sunday: 10:00 AM - 5:00 PM",
      action: "Schedule Visit",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Connection Status Banner */}
      {connectionError && (
        <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-2">
          <div className="container mx-auto flex items-center justify-center text-sm text-yellow-800">
            <AlertCircle className="h-4 w-4 mr-2" />
            {connectionError}
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="relative">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                  <Building2 className="h-5 w-5 sm:h-7 sm:w-7 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 sm:w-6 sm:h-6 bg-orange-500 rounded-full flex items-center justify-center">
                  <Home className="h-2 w-2 sm:h-3 sm:w-3 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-gray-900">Uzair Property</h1>
                <p className="text-xs text-gray-600">House & Builders</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
              <Link href="#home" className="text-gray-700 hover:text-blue-600 font-medium text-sm xl:text-base">
                Home
              </Link>
              <Link href="#properties" className="text-gray-700 hover:text-blue-600 font-medium text-sm xl:text-base">
                Properties
              </Link>
              <Link href="#services" className="text-gray-700 hover:text-blue-600 font-medium text-sm xl:text-base">
                Services
              </Link>
              <Link href="#about" className="text-gray-700 hover:text-blue-600 font-medium text-sm xl:text-base">
                About
              </Link>
              <Link href="#contact" className="text-gray-700 hover:text-blue-600 font-medium text-sm xl:text-base">
                Contact
              </Link>
            </nav>

            {/* Firebase Status & Admin Button */}
            <div className="hidden sm:flex items-center space-x-2">
              <div className="flex items-center space-x-1 text-xs">
                <div
                  className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : connectionError ? "bg-yellow-500" : "bg-red-500"}`}
                />
                <Database className="h-3 w-3 text-gray-500" />
                <span className="text-gray-500 hidden md:inline">
                  {isConnected ? "Connected" : connectionError ? "Demo Mode" : "Offline"}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (isAdminAuthenticated) {
                    setShowAdmin(!showAdmin)
                  } else {
                    setShowPasswordDialog(true)
                  }
                }}
                className="flex items-center space-x-1 text-xs sm:text-sm"
              >
                <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden md:inline">{isAdminAuthenticated ? "Admin Panel" : "Admin"}</span>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button className="lg:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
              {isMenuOpen ? <X className="h-5 w-5 sm:h-6 sm:w-6" /> : <Menu className="h-5 w-5 sm:h-6 sm:w-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="lg:hidden py-4 border-t">
              <nav className="flex flex-col space-y-4">
                <Link
                  href="#home"
                  className="text-gray-700 hover:text-blue-600 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="#properties"
                  className="text-gray-700 hover:text-blue-600 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Properties
                </Link>
                <Link
                  href="#services"
                  className="text-gray-700 hover:text-blue-600 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Services
                </Link>
                <Link
                  href="#about"
                  className="text-gray-700 hover:text-blue-600 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </Link>
                <Link
                  href="#contact"
                  className="text-gray-700 hover:text-blue-600 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact
                </Link>
                <div className="pt-4 border-t flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-xs">
                    <div
                      className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : connectionError ? "bg-yellow-500" : "bg-red-500"}`}
                    />
                    <Database className="h-3 w-3 text-gray-500" />
                    <span className="text-gray-500">
                      {isConnected ? "Connected" : connectionError ? "Demo" : "Offline"}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsMenuOpen(false)
                      if (isAdminAuthenticated) {
                        setShowAdmin(!showAdmin)
                      } else {
                        setShowPasswordDialog(true)
                      }
                    }}
                    className="flex items-center space-x-1 text-xs"
                  >
                    <Plus className="h-3 w-3" />
                    <span>{isAdminAuthenticated ? "Admin Panel" : "Admin"}</span>
                  </Button>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="relative bg-gradient-to-br from-blue-50 to-indigo-100 py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="text-center lg:text-left">
              <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-200 text-xs sm:text-sm">
                Trusted Property Developers
              </Badge>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4 sm:mb-6">
                Building Your
                <span className="text-blue-600 block">Dream Properties</span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Uzair Property House & Builders - Your trusted partner in creating exceptional residential and
                commercial spaces with quality construction and innovative designs.
              </p>
              <div className="flex justify-center lg:justify-start">
                <Button
                  size="lg"
                  onClick={scrollToProperties}
                  className="bg-blue-600 hover:bg-blue-700 text-sm sm:text-base"
                >
                  View Properties
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 sm:gap-8 mt-8 sm:mt-12 pt-8 border-t">
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-blue-600">50+</div>
                  <div className="text-xs sm:text-sm text-gray-600">Projects Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-blue-600">8+</div>
                  <div className="text-xs sm:text-sm text-gray-600">Years Experience</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-blue-600">500+</div>
                  <div className="text-xs sm:text-sm text-gray-600">Happy Clients</div>
                </div>
              </div>
            </div>

            <div className="relative mt-8 lg:mt-0">
              <Image
                src="/images/house-hero.jpeg"
                alt="Modern House Design"
                width={500}
                height={600}
                className="rounded-2xl shadow-2xl w-full h-auto max-w-md mx-auto lg:max-w-none"
                priority
              />
              <div className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 bg-white p-4 sm:p-6 rounded-xl shadow-lg max-w-[200px] sm:max-w-none">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 sm:h-6 sm:w-6 text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm sm:text-base">Quality Assured</div>
                    <div className="text-xs sm:text-sm text-gray-600">Premium Construction</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Properties Section */}
      <section id="properties" className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <Badge className="mb-4 bg-blue-100 text-blue-800 text-xs sm:text-sm">Our Projects</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Featured Properties</h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our premium residential and commercial projects designed with modern amenities and quality
              construction.
            </p>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
              <p className="text-gray-600">Loading properties...</p>
            </div>
          ) : properties.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Properties Yet</h3>
              <p className="text-gray-600 mb-6">
                Properties will appear here once they are added through the admin panel.
              </p>
              {isAdminAuthenticated && (
                <Button onClick={() => setShowAdmin(true)} className="bg-blue-600 hover:bg-blue-700">
                  Add First Property
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {properties.map((property) => (
                <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <PropertyCarousel images={property.images} title={property.title} />
                  <div className="absolute top-4 left-4 z-10">
                    <Badge className="bg-blue-600 text-white text-xs">{property.status}</Badge>
                  </div>
                  <CardHeader className="p-4 sm:p-6">
                    <CardTitle className="text-lg sm:text-xl line-clamp-2">{property.title}</CardTitle>
                    <CardDescription className="flex items-center text-gray-600 text-sm">
                      <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                      <span className="line-clamp-1">{property.location}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 pt-0">
                    <div className="text-xl sm:text-2xl font-bold text-blue-600 mb-4">{property.price}</div>
                    <div className="space-y-2 mb-4">
                      {property.features.slice(0, 3).map((feature, index) => (
                        <div key={index} className="flex items-center text-xs sm:text-sm text-gray-600">
                          <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 mr-2 flex-shrink-0" />
                          <span className="line-clamp-1">{feature}</span>
                        </div>
                      ))}
                      {property.features.length > 3 && (
                        <div className="text-xs text-gray-500">+{property.features.length - 3} more features</div>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 mb-4 line-clamp-2">{property.description}</p>
                    <Button
                      onClick={() => handleViewDetails(property)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-sm"
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <Badge className="mb-4 bg-orange-100 text-orange-800 text-xs sm:text-sm">Our Services</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">What We Offer</h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive property development and construction services tailored to your needs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {services.map((service, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow p-4 sm:p-6">
                <CardHeader className="pb-4">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                    {service.icon}
                  </div>
                  <CardTitle className="text-lg sm:text-xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-gray-600 text-sm sm:text-base">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="order-2 lg:order-1">
              <Badge className="mb-4 bg-green-100 text-green-800 text-xs sm:text-sm">About Us</Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
                8+ Years of Excellence in Property Development
              </h2>
              <p className="text-base sm:text-lg text-gray-600 mb-6">
                Uzair Property House & Builders has been a trusted name in the real estate industry, delivering quality
                construction and innovative property solutions since 2016.
              </p>
              <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 text-sm sm:text-base">
                    Quality construction with premium materials
                  </span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 text-sm sm:text-base">Timely project delivery and completion</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 text-sm sm:text-base">Transparent pricing and honest dealings</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 text-sm sm:text-base">After-sales support and maintenance</span>
                </div>
              </div>
              <Button
                size="lg"
                onClick={() => {
                  const contactSection = document.getElementById("contact")
                  if (contactSection) {
                    contactSection.scrollIntoView({ behavior: "smooth" })
                  }
                }}
                className="bg-blue-600 hover:bg-blue-700 text-sm sm:text-base"
              >
                Contact Us Today
              </Button>
            </div>

            <div className="relative order-1 lg:order-2">
              <Image
                src="/images/house-hero.jpeg"
                alt="Construction Excellence"
                width={600}
                height={500}
                className="rounded-2xl shadow-xl w-full h-auto"
              />
              <div className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6 bg-white p-3 sm:p-4 rounded-xl shadow-lg">
                <div className="flex items-center space-x-1 sm:space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-3 w-3 sm:h-5 sm:w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <div className="text-xs sm:text-sm font-semibold text-gray-900 mt-1">5.0 Rating</div>
                <div className="text-xs text-gray-600">From 200+ Reviews</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Contact Section */}
      <section id="contact" className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <Badge className="mb-4 bg-purple-100 text-purple-800 text-xs sm:text-sm">Get In Touch</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Ready to start your property journey? Get in touch with our expert team today.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Interactive Contact Cards */}
            <div className="space-y-4 sm:space-y-6">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">Reach Out to Us</h3>
              {contactMethods.map((method) => (
                <Card
                  key={method.id}
                  className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                    activeContact === method.id ? "ring-2 ring-blue-500 shadow-lg" : ""
                  }`}
                  onClick={() => setActiveContact(activeContact === method.id ? null : method.id)}
                >
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-start space-x-3 sm:space-x-4">
                      <div
                        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                          activeContact === method.id ? "bg-blue-600 text-white" : "bg-blue-100 text-blue-600"
                        }`}
                      >
                        {method.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">{method.title}</h4>
                        <p className="text-gray-600 mb-1 text-sm sm:text-base break-words">{method.primary}</p>
                        <p className="text-xs sm:text-sm text-gray-500 break-words">{method.secondary}</p>

                        {activeContact === method.id && (
                          <div className="mt-4 pt-4 border-t">
                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm">
                              {method.action}
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Contact Form */}
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl">Send us a Message</CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Fill out the form below and we'll get back to you within 24 hours.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs sm:text-sm font-medium text-gray-700 mb-2 block">First Name</label>
                      <Input
                        value={contactForm.firstName}
                        onChange={(e) => handleContactInputChange("firstName", e.target.value)}
                        className="text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs sm:text-sm font-medium text-gray-700 mb-2 block">Last Name</label>
                      <Input
                        value={contactForm.lastName}
                        onChange={(e) => handleContactInputChange("lastName", e.target.value)}
                        className="text-sm"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-gray-700 mb-2 block">Email</label>
                    <Input
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => handleContactInputChange("email", e.target.value)}
                      className="text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-gray-700 mb-2 block">Phone</label>
                    <Input
                      type="tel"
                      value={contactForm.phone}
                      onChange={(e) => handleContactInputChange("phone", e.target.value)}
                      className="text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-gray-700 mb-2 block">Subject</label>
                    <Input
                      value={contactForm.subject}
                      onChange={(e) => handleContactInputChange("subject", e.target.value)}
                      className="text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-gray-700 mb-2 block">Message</label>
                    <Textarea
                      value={contactForm.message}
                      onChange={(e) => handleContactInputChange("message", e.target.value)}
                      rows={4}
                      className="text-sm"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isSubmittingContact}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-sm sm:text-base"
                  >
                    {isSubmittingContact ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 sm:py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {/* Company Info */}
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center space-x-3 mb-4">
                <div className="relative">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                    <Building2 className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-orange-500 rounded-full flex items-center justify-center">
                    <Home className="h-2 w-2 sm:h-2.5 sm:w-2.5 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base">Uzair Property</h3>
                  <p className="text-xs text-gray-400">House & Builders</p>
                </div>
              </div>
              <p className="text-gray-400 text-xs sm:text-sm mb-4">
                Building dreams with quality construction and innovative property solutions since 2016.
              </p>
              {/* Social Media Links */}
              <div className="flex space-x-4">
                <a
                  href="https://www.tiktok.com/@uzairproperty"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                  </svg>
                </a>
                <a
                  href="https://www.youtube.com/@uzairproperty"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
                <a
                  href="https://www.instagram.com/uzairproperty"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987c6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.323C5.902 8.198 7.053 7.708 8.35 7.708s2.448.49 3.323 1.297c.897.875 1.387 2.026 1.387 3.323s-.49 2.448-1.297 3.323c-.875.897-2.026 1.387-3.323 1.387zM7.718 0c-1.297 0-2.448-.49-3.323-1.297c-.897-.875-1.387-2.026-1.387-3.323s.49-2.448 1.297-3.323c.875-.897 2.026-1.387 3.323-1.387s2.448.49 3.323 1.297c.897.875 1.387 2.026 1.387 3.323s-.49 2.448-1.297 3.323c-.875.897-2.026 1.387-3.323 1.387z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4 text-sm sm:text-base">Quick Links</h4>
              <ul className="space-y-2 text-xs sm:text-sm text-gray-400">
                <li>
                  <Link href="#home" className="hover:text-white">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="#properties" className="hover:text-white">
                    Properties
                  </Link>
                </li>
                <li>
                  <Link href="#services" className="hover:text-white">
                    Services
                  </Link>
                </li>
                <li>
                  <Link href="#about" className="hover:text-white">
                    About Us
                  </Link>
                </li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="font-semibold mb-4 text-sm sm:text-base">Services</h4>
              <ul className="space-y-2 text-xs sm:text-sm text-gray-400">
                <li>Property Development</li>
                <li>Construction Services</li>
                <li>Real Estate Consultation</li>
                <li>Project Management</li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="font-semibold mb-4 text-sm sm:text-base">Contact Info</h4>
              <div className="space-y-2 text-xs sm:text-sm text-gray-400">
                <div className="flex items-center">
                  <Phone className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
                  <span>+92 300 1234567</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
                  <span className="break-all">info@uzairproperty.com</span>
                </div>
                <div className="flex items-start">
                  <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-2 mt-0.5 flex-shrink-0" />
                  <span>123 Main Street, Business District, City Center</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-xs sm:text-sm text-gray-400">
            <p>&copy; {new Date().getFullYear()} Uzair Property House & Builders. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Property Details Modal */}
      <PropertyDetailsModal
        property={selectedProperty}
        isOpen={showPropertyDetails}
        onClose={handleClosePropertyDetails}
      />

      {/* Password Dialog */}
      <PasswordDialog
        isOpen={showPasswordDialog}
        onClose={() => setShowPasswordDialog(false)}
        onSuccess={() => {
          setIsAdminAuthenticated(true)
          setShowPasswordDialog(false)
          setShowAdmin(true)
        }}
      />

      {/* Admin Panel */}
      {showAdmin && (
        <PropertyAdmin
          properties={properties}
          onClose={() => setShowAdmin(false)}
          onLogout={() => {
            setIsAdminAuthenticated(false)
            setShowAdmin(false)
          }}
        />
      )}
    </div>
  )
}

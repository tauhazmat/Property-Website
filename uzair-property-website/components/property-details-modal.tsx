"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, MapPin, CheckCircle, Phone, Mail, Calendar, Home, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import type { Property } from "@/lib/firebase-service"

interface PropertyDetailsModalProps {
  property: Property | null
  isOpen: boolean
  onClose: () => void
}

export function PropertyDetailsModal({ property, isOpen, onClose }: PropertyDetailsModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  if (!isOpen || !property) return null

  const goToPreviousImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? property.images.length - 1 : prev - 1))
  }

  const goToNextImage = () => {
    setCurrentImageIndex((prev) => (prev === property.images.length - 1 ? 0 : prev + 1))
  }

  const handleInquiry = () => {
    const subject = `Inquiry about ${property.title}`
    const body = `Hi, I'm interested in learning more about the property: ${property.title} located at ${property.location}. Please provide more details.`
    const mailtoLink = `mailto:info@uzairproperty.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.open(mailtoLink, "_blank")
  }

  const handleCall = () => {
    window.open("tel:+923001234567", "_blank")
  }

  const handleWhatsApp = () => {
    const message = `Hi, I'm interested in the property: ${property.title}`
    const whatsappLink = `https://wa.me/923001234567?text=${encodeURIComponent(message)}`
    window.open(whatsappLink, "_blank")
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-4 sm:p-6 flex items-center justify-between z-10">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 line-clamp-1">{property.title}</h2>
            <div className="flex items-center text-gray-600 mt-1">
              <MapPin className="h-4 w-4 mr-1" />
              <span className="text-sm sm:text-base">{property.location}</span>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-4 sm:p-6">
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Image Gallery */}
            <div className="space-y-4">
              {property.images && property.images.length > 0 ? (
                <>
                  {/* Main Image */}
                  <div className="relative group">
                    <div className="relative w-full h-64 sm:h-80 overflow-hidden rounded-lg">
                      <Image
                        src={property.images[currentImageIndex] || "/placeholder.svg"}
                        alt={`${property.title} - Image ${currentImageIndex + 1}`}
                        fill
                        className="object-cover"
                      />

                      {/* Navigation Arrows */}
                      {property.images.length > 1 && (
                        <>
                          <Button
                            variant="secondary"
                            size="sm"
                            className="absolute left-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 h-8 w-8 p-0"
                            onClick={goToPreviousImage}
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 h-8 w-8 p-0"
                            onClick={goToNextImage}
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </>
                      )}

                      {/* Image Counter */}
                      {property.images.length > 1 && (
                        <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                          {currentImageIndex + 1} / {property.images.length}
                        </div>
                      )}
                    </div>

                    {/* Thumbnail Navigation */}
                    {property.images.length > 1 && (
                      <div className="flex space-x-2 mt-2 overflow-x-auto pb-2">
                        {property.images.map((image, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`relative flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-colors ${
                              index === currentImageIndex ? "border-blue-500" : "border-gray-200"
                            }`}
                          >
                            <Image
                              src={image || "/placeholder.svg"}
                              alt={`Thumbnail ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="w-full h-64 sm:h-80 bg-gray-200 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Home className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <span className="text-gray-500">No images available</span>
                  </div>
                </div>
              )}
            </div>

            {/* Property Details */}
            <div className="space-y-6">
              {/* Price and Status */}
              <div className="flex items-center justify-between">
                <div className="text-2xl sm:text-3xl font-bold text-blue-600">{property.price}</div>
                <Badge
                  className={`text-sm ${
                    property.status === "Available"
                      ? "bg-green-100 text-green-800"
                      : property.status === "Under Construction"
                        ? "bg-yellow-100 text-yellow-800"
                        : property.status === "Pre-Launch"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-red-100 text-red-800"
                  }`}
                >
                  {property.status}
                </Badge>
              </div>

              {/* Description */}
              {property.description && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-600 leading-relaxed">{property.description}</p>
                </div>
              )}

              {/* Features */}
              {property.features && property.features.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Features & Amenities</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {property.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Property Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Property Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center">
                    <Home className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">Property Type</span>
                  </div>
                  <div className="font-medium">Residential</div>

                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">Status</span>
                  </div>
                  <div className="font-medium">{property.status}</div>

                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">Location</span>
                  </div>
                  <div className="font-medium">{property.location}</div>
                </div>
              </div>

              {/* Contact Actions */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Interested? Get in Touch</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Button onClick={handleCall} className="bg-blue-600 hover:bg-blue-700 text-sm">
                    <Phone className="h-4 w-4 mr-2" />
                    Call Now
                  </Button>
                  <Button
                    onClick={handleWhatsApp}
                    variant="outline"
                    className="text-sm border-green-500 text-green-600 hover:bg-green-50"
                  >
                    <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                    </svg>
                    WhatsApp
                  </Button>
                  <Button onClick={handleInquiry} variant="outline" className="text-sm">
                    <Mail className="h-4 w-4 mr-2" />
                    Email Inquiry
                  </Button>
                </div>

                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <div className="text-sm text-blue-800">
                    <strong>Ready to visit?</strong> Contact us to schedule a property viewing at your convenience.
                  </div>
                  <div className="text-xs text-blue-600 mt-1">📞 +92 300 1234567 | 📧 info@uzairproperty.com</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

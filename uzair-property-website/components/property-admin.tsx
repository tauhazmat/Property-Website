"use client"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Trash2, Save, X, Loader2, Upload, ImageIcon } from "lucide-react"
import { type Property, addProperty, updateProperty, deleteProperty } from "@/lib/firebase-service"

interface PropertyAdminProps {
  properties: Property[]
  onClose: () => void
  onLogout?: () => void
}

export function PropertyAdmin({ properties, onClose, onLogout }: PropertyAdminProps) {
  const [editingProperty, setEditingProperty] = useState<Property | null>(null)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [uploadingImages, setUploadingImages] = useState<boolean[]>([])
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([])

  const [formData, setFormData] = useState<Partial<Property>>({
    title: "",
    location: "",
    price: "",
    images: [""],
    status: "Available",
    features: [""],
    description: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleArrayChange = (field: "images" | "features", index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field]?.map((item, i) => (i === index ? value : item)) || [],
    }))
  }

  const addArrayItem = (field: "images" | "features") => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...(prev[field] || []), ""],
    }))

    if (field === "images") {
      setUploadingImages((prev) => [...prev, false])
      fileInputRefs.current.push(null)
    }
  }

  const removeArrayItem = (field: "images" | "features", index: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field]?.filter((_, i) => i !== index) || [],
    }))

    if (field === "images") {
      setUploadingImages((prev) => prev.filter((_, i) => i !== index))
      fileInputRefs.current.splice(index, 1)
    }
  }

  const handleImageUpload = async (index: number, file: File) => {
    if (!file) return

    // Update uploading state
    setUploadingImages((prev) => prev.map((uploading, i) => (i === index ? true : uploading)))

    try {
      // Create a FormData object
      const formData = new FormData()
      formData.append("file", file)

      // In a real implementation, you would upload to a service like:
      // - Firebase Storage
      // - Cloudinary
      // - AWS S3
      // - Vercel Blob

      // For now, we'll create a local URL (this won't persist)
      const imageUrl = URL.createObjectURL(file)

      // Update the image URL in the form
      handleArrayChange("images", index, imageUrl)

      // Show success message
      alert("Image uploaded successfully! Note: In production, this would be uploaded to a cloud storage service.")
    } catch (error) {
      console.error("Error uploading image:", error)
      alert("Failed to upload image. Please try again.")
    } finally {
      // Reset uploading state
      setUploadingImages((prev) => prev.map((uploading, i) => (i === index ? false : uploading)))
    }
  }

  const triggerFileInput = (index: number) => {
    fileInputRefs.current[index]?.click()
  }

  const handleSave = async () => {
    if (!formData.title || !formData.location || !formData.price) {
      alert("Please fill in all required fields")
      return
    }

    setIsLoading(true)
    try {
      const cleanedData = {
        title: formData.title,
        location: formData.location,
        price: formData.price,
        status: formData.status || "Available",
        description: formData.description || "",
        images: formData.images?.filter((img) => img.trim() !== "") || [],
        features: formData.features?.filter((feature) => feature.trim() !== "") || [],
      }

      if (editingProperty) {
        // Update existing property
        await updateProperty(editingProperty.id, cleanedData)
        alert("Property updated successfully!")
      } else {
        // Add new property
        await addProperty(cleanedData)
        alert("Property added successfully!")
      }

      resetForm()
    } catch (error) {
      console.error("Error saving property:", error)
      alert("Error saving property. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (property: Property) => {
    setEditingProperty(property)
    setFormData(property)
    setIsAddingNew(false)

    // Initialize uploading states and file refs
    setUploadingImages(new Array(property.images?.length || 1).fill(false))
    fileInputRefs.current = new Array(property.images?.length || 1).fill(null)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this property?")) {
      setIsLoading(true)
      try {
        await deleteProperty(id)
        alert("Property deleted successfully!")
      } catch (error) {
        console.error("Error deleting property:", error)
        alert("Error deleting property. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }
  }

  const resetForm = () => {
    setEditingProperty(null)
    setIsAddingNew(false)
    setFormData({
      title: "",
      location: "",
      price: "",
      images: [""],
      status: "Available",
      features: [""],
      description: "",
    })
    setUploadingImages([false])
    fileInputRefs.current = [null]
  }

  const startAddingNew = () => {
    setIsAddingNew(true)
    setEditingProperty(null)
    setFormData({
      title: "",
      location: "",
      price: "",
      images: [""],
      status: "Available",
      features: [""],
      description: "",
    })
    setUploadingImages([false])
    fileInputRefs.current = [null]
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-lg w-full max-w-7xl max-h-[95vh] overflow-y-auto">
        <div className="p-4 sm:p-6 border-b flex items-center justify-between sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold">Property Management</h2>
            <p className="text-sm text-gray-600">Total Properties: {properties.length}</p>
          </div>
          <div className="flex items-center space-x-2">
            {onLogout && (
              <Button variant="outline" size="sm" onClick={onLogout} className="text-xs sm:text-sm">
                Logout
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Property List */}
            <div>
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-semibold">Current Properties</h3>
                <Button onClick={startAddingNew} size="sm" disabled={isLoading}>
                  <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span className="text-xs sm:text-sm">Add New</span>
                </Button>
              </div>

              <div className="space-y-3 sm:space-y-4 max-h-[60vh] overflow-y-auto">
                {properties.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 text-sm">No properties yet. Add your first property!</p>
                  </div>
                ) : (
                  properties.map((property) => (
                    <Card key={property.id} className="relative">
                      <CardHeader className="pb-2 p-3 sm:p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-base sm:text-lg line-clamp-1">{property.title}</CardTitle>
                            <CardDescription className="text-xs sm:text-sm line-clamp-1">
                              {property.location}
                            </CardDescription>
                          </div>
                          <Badge
                            variant={property.status === "Available" ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {property.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="p-3 sm:p-4 pt-0">
                        <div className="text-sm sm:text-lg font-semibold text-blue-600 mb-2 sm:mb-3">
                          {property.price}
                        </div>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(property)}
                            disabled={isLoading}
                            className="w-full sm:w-auto text-xs"
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(property.id)}
                            disabled={isLoading}
                            className="w-full sm:w-auto text-xs"
                          >
                            {isLoading ? (
                              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                            ) : (
                              <Trash2 className="h-3 w-3 mr-1" />
                            )}
                            Delete
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>

            {/* Property Form */}
            {(isAddingNew || editingProperty) && (
              <div className="space-y-4">
                <h3 className="text-lg sm:text-xl font-semibold">
                  {editingProperty ? "Edit Property" : "Add New Property"}
                </h3>

                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium mb-2">Title *</label>
                    <Input
                      value={formData.title || ""}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      placeholder="Property title"
                      disabled={isLoading}
                      className="text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium mb-2">Location *</label>
                    <Input
                      value={formData.location || ""}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                      placeholder="Property location"
                      disabled={isLoading}
                      className="text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium mb-2">Price *</label>
                    <Input
                      value={formData.price || ""}
                      onChange={(e) => handleInputChange("price", e.target.value)}
                      placeholder="Starting from $150,000"
                      disabled={isLoading}
                      className="text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium mb-2">Status</label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => handleInputChange("status", value)}
                      disabled={isLoading}
                    >
                      <SelectTrigger className="text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Available">Available</SelectItem>
                        <SelectItem value="Under Construction">Under Construction</SelectItem>
                        <SelectItem value="Pre-Launch">Pre-Launch</SelectItem>
                        <SelectItem value="Sold Out">Sold Out</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium mb-2">Description</label>
                    <Textarea
                      value={formData.description || ""}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      placeholder="Property description"
                      rows={3}
                      disabled={isLoading}
                      className="text-sm"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs sm:text-sm font-medium">Property Images</label>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => addArrayItem("images")}
                        disabled={isLoading}
                        className="text-xs"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Add Image
                      </Button>
                    </div>
                    {formData.images?.map((image, index) => (
                      <div key={index} className="space-y-2 mb-4 p-3 border rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Input
                            value={image}
                            onChange={(e) => handleArrayChange("images", index, e.target.value)}
                            placeholder="Image URL or upload an image"
                            disabled={isLoading || uploadingImages[index]}
                            className="text-sm flex-1"
                          />
                          {formData.images && formData.images.length > 1 && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => removeArrayItem("images", index)}
                              disabled={isLoading}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          )}
                        </div>

                        <div className="flex items-center space-x-2">
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => triggerFileInput(index)}
                            disabled={isLoading || uploadingImages[index]}
                            className="text-xs"
                          >
                            {uploadingImages[index] ? (
                              <>
                                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                Uploading...
                              </>
                            ) : (
                              <>
                                <Upload className="h-3 w-3 mr-1" />
                                Upload Image
                              </>
                            )}
                          </Button>

                          {image && (
                            <div className="flex items-center text-xs text-gray-500">
                              <ImageIcon className="h-3 w-3 mr-1" />
                              Image added
                            </div>
                          )}
                        </div>

                        <input
                          ref={(el) => (fileInputRefs.current[index] = el)}
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              handleImageUpload(index, file)
                            }
                          }}
                          className="hidden"
                        />
                      </div>
                    ))}
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs sm:text-sm font-medium">Features</label>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => addArrayItem("features")}
                        disabled={isLoading}
                        className="text-xs"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Add Feature
                      </Button>
                    </div>
                    {formData.features?.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2 mb-2">
                        <Input
                          value={feature}
                          onChange={(e) => handleArrayChange("features", index, e.target.value)}
                          placeholder="Property feature"
                          disabled={isLoading}
                          className="text-sm"
                        />
                        {formData.features && formData.features.length > 1 && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => removeArrayItem("features", index)}
                            disabled={isLoading}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 pt-4 border-t">
                  <Button onClick={handleSave} disabled={isLoading} className="w-full sm:w-auto text-sm">
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Property
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={resetForm}
                    disabled={isLoading}
                    className="w-full sm:w-auto text-sm"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

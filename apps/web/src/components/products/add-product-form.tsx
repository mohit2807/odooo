'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Upload, X, Package, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuthStore } from '@/store'
import { supabase, getImagePlaceholder } from '@/lib/supabase'
import { CATEGORIES } from '@/types'
import { productSchema, type ProductFormData } from '@/lib/validations'
import { toast } from 'sonner'
import Image from 'next/image'

export function AddProductForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [images, setImages] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const { user } = useAuthStore()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  })

  const watchedCategory = watch('category')

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || !user) return

    setIsUploading(true)
    const newImages: string[] = []

    try {
      for (const file of Array.from(files)) {
        if (file.size > 5 * 1024 * 1024) {
          toast.error('Image too large', {
            description: 'Please select images smaller than 5MB',
          })
          continue
        }

        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
        const filePath = `${user.id}/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, file)

        if (uploadError) {
          console.error('Upload error:', uploadError)
          toast.error('Upload failed', {
            description: uploadError.message,
          })
          continue
        }

        const { data } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath)

        newImages.push(data.publicUrl)
      }

      setImages(prev => [...prev, ...newImages])
    } catch (error) {
      console.error('Image upload error:', error)
      toast.error('Failed to upload images')
    } finally {
      setIsUploading(false)
    }
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const onSubmit = async (data: ProductFormData) => {
    if (!user) {
      toast.error('Please sign in to add a product')
      return
    }

    setIsLoading(true)
    
    try {
      const { error } = await supabase
        .from('products')
        .insert({
          owner_id: user.id,
          title: data.title,
          description: data.description,
          category: data.category,
          price_cents: Math.round(data.price * 100),
          images: images,
        })

      if (error) {
        throw new Error(error.message)
      }

      toast.success('Listing created!', {
        description: 'Your product is now live on EcoFinds',
        icon: <Sparkles className="w-4 h-4" />,
      })

      // Reset form
      reset()
      setImages([])
      router.push('/feed')
    } catch (error) {
      console.error('Error creating product:', error)
      toast.error('Failed to create listing', {
        description: error instanceof Error ? error.message : 'Please try again',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Package className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Add New Product</h1>
        <p className="text-gray-600">Share something sustainable with the community</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle>Product Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Product Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Vintage Leather Jacket"
                  {...register('title')}
                  className="h-12"
                />
                {errors.title && (
                  <p className="text-red-500 text-sm">{errors.title.message}</p>
                )}
              </div>

              {/* Category and Price */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select onValueChange={(value) => setValue('category', value as any)}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <p className="text-red-500 text-sm">{errors.category.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Price (₹) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...register('price', { valueAsNumber: true })}
                    className="h-12"
                  />
                  {errors.price && (
                    <p className="text-red-500 text-sm">{errors.price.message}</p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your product's condition, features, and why someone would love it... (minimum 20 characters)"
                  rows={4}
                  {...register('description')}
                  className="resize-none"
                />
                {errors.description && (
                  <p className="text-red-500 text-sm">{errors.description.message}</p>
                )}
              </div>

              {/* Images */}
              <div className="space-y-4">
                <Label>Product Images</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-emerald-500 transition-colors">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                    disabled={isUploading}
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">
                      {isUploading ? 'Uploading...' : 'Click to upload images'}
                    </p>
                    <p className="text-sm text-gray-500">
                      PNG, JPG up to 5MB each
                    </p>
                  </label>
                </div>

                {/* Image Preview */}
                {images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {images.map((image, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative group"
                      >
                        <div className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
                          <Image
                            src={image}
                            alt={`Product ${index + 1}`}
                            width={100}
                            height={100}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 w-6 h-6 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                )}

                {images.length === 0 && (
                  <div className="aspect-square max-w-xs mx-auto rounded-lg overflow-hidden border-2 border-gray-200">
                    <Image
                      src={getImagePlaceholder()}
                      alt="Product preview"
                      width={200}
                      height={200}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Selected Category Badge */}
              {watchedCategory && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Category:</span>
                  <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
                    {watchedCategory}
                  </Badge>
                </div>
              )}

              {/* Submit Button */}
              <motion.div whileTap={{ scale: 0.98 }}>
                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white text-lg font-medium shadow-lg"
                  disabled={isLoading || isUploading}
                >
                  {isLoading ? 'Creating Listing...' : 'Create Listing'}
                </Button>
              </motion.div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

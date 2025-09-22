import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card'
import { useAppForm, AppInputField } from '@workspace/ui/components/tanstack-form'
import { LoadingButton } from '@workspace/ui/components/loading-button'
import { useParams } from '@tanstack/react-router'
import { z } from 'zod'
import { useState, useRef } from 'react'
import { Button } from '@workspace/ui/components/button'
import { Label } from '@workspace/ui/components/label'
import { Input } from '@workspace/ui/components/input'

const storeDetailsSchema = z.object({
  name: z.string().min(1, { message: "Restaurant name is required" }),
  address: z.string().min(1, { message: "Address is required" }),
  fssaiNumber: z.string().min(1, { message: "FSSAI number is required" }),
  gstNumber: z.string().min(1, { message: "GST number is required" }),
  googleReviewLink: z.string().url({ message: "Please enter a valid URL" })
})

interface FileUploadProps {
  onFileSelect: (file: File | null) => void
  currentFile: File | null
  label: string
  description?: string
}

function FileUpload({ onFileSelect, currentFile, label, description }: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const fileInputId = `file-upload-${Math.random().toString(36).substr(2, 9)}`

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null
    onFileSelect(file)

    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setPreview(null)
    }
  }

  const handleRemoveFile = () => {
    onFileSelect(null)
    setPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      fileInputRef.current?.click()
    }
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={fileInputId}>{label}</Label>
      {description && (
        <p className="text-sm text-muted-foreground" id={`${fileInputId}-description`}>
          {description}
        </p>
      )}

      <div className="space-y-4">
        {preview && (
          <div className="relative inline-block">
            <img
              src={preview}
              alt="Restaurant logo preview"
              className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg border"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
              onClick={handleRemoveFile}
              aria-label="Remove uploaded logo"
            >
              ×
            </Button>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
          <Input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="sr-only"
            id={fileInputId}
            aria-describedby={description ? `${fileInputId}-description` : undefined}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={handleKeyDown}
            className="w-full sm:w-auto"
            aria-describedby={description ? `${fileInputId}-description` : undefined}
          >
            {currentFile ? 'Change Logo' : 'Upload Logo'}
          </Button>
          {currentFile && (
            <span className="text-sm text-muted-foreground break-all sm:break-normal">
              {currentFile.name}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export function StoreDetailsPage() {
  const { restaurantId } = useParams({ from: '/restaurant/manage/$restaurantId/store/details' })
  const [logoFile, setLogoFile] = useState<File | null>(null)

  const form = useAppForm({
    defaultValues: {
      name: '',
      address: '',
      fssaiNumber: '',
      gstNumber: '',
      googleReviewLink: ""
    },
    validators: {
      onBlur: storeDetailsSchema
    },
    onSubmit: async ({ value }) => {
      // TODO: Implement API call to save store details
      console.log('Store details:', value)
      console.log('Logo file:', logoFile)
      console.log('Restaurant ID:', restaurantId)

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
    },
  })

  return (
    <div className="container mx-auto py-4 px-4 sm:py-6 sm:px-6 space-y-4 sm:space-y-6 max-w-4xl">
      <div className="space-y-2">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Store Details</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Manage your restaurant's basic information and settings.
        </p>
      </div>

      <Card>
        <CardHeader className="pb-4 sm:pb-6">
          <CardTitle className="text-lg sm:text-xl">Basic Information</CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Update your restaurant's name, address, and other essential details.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              form.handleSubmit()
            }}
            className="space-y-4 sm:space-y-6"
            noValidate
            aria-label="Store details form"
            role="form"
          >
            {/* Restaurant Name Field */}
            <form.AppField
              name="name"
              children={AppInputField({
                label: 'Restaurant Name',
                placeholder: 'Enter your restaurant name',
                description: 'The name of your restaurant as it appears to customers',
              })}
            />

            {/* Address Field */}
            <form.AppField
              name="address"
              children={AppInputField({
                label: 'Address',
                placeholder: 'Enter your restaurant address',
                description: 'Full address including street, city, and postal code',
              })}
            />

            {/* FSSAI Number Field */}
            <form.AppField
              name="fssaiNumber"
              children={AppInputField({
                label: 'FSSAI Number',
                placeholder: 'Enter FSSAI license number',
                description: 'Food Safety and Standards Authority of India license number',
              })}
            />

            {/* GST Number Field */}
            <form.AppField
              name="gstNumber"
              children={AppInputField({
                label: 'GST Number',
                placeholder: 'Enter GST registration number',
                description: 'Goods and Services Tax registration number',
              })}
            />

            {/* Google Review Link Field */}
            <form.AppField
              name="googleReviewLink"
              children={AppInputField({
                label: 'Google Review Link (Optional)',
                placeholder: 'https://g.page/your-restaurant/review',
                description: 'Link to your Google Business profile for customer reviews',
              })}
            />

            {/* Logo Upload */}
            <FileUpload
              onFileSelect={setLogoFile}
              currentFile={logoFile}
              label="Restaurant Logo"
              description="Upload your restaurant logo (recommended size: 200x200px)"
            />

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 sm:pt-6">
              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
                children={([canSubmit, isFormSubmitting]) => (
                  <LoadingButton 
                    loading={!canSubmit || isFormSubmitting}
                    className="w-full sm:w-auto"
                    aria-describedby="save-button-description"
                  >
                    Save Store Details
                  </LoadingButton>
                )}
              />
              <div id="save-button-description" className="sr-only">
                Save all store details including name, address, FSSAI number, GST number, and logo
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
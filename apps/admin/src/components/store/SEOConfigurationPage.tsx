import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card'
import { useAppForm, AppInputField } from '@workspace/ui/components/tanstack-form'
import { LoadingButton } from '@workspace/ui/components/loading-button'
import { useParams } from '@tanstack/react-router'
import { z } from 'zod'

const seoConfigurationSchema = z.object({
  title: z.string()
    .min(1, { message: "Title is required" })
    .max(60, { message: "Title should be 60 characters or less for optimal SEO" }),
  description: z.string()
    .min(1, { message: "Description is required" })
    .max(160, { message: "Description should be 160 characters or less for optimal SEO" }),
  keywords: z.string()
    .min(1, { message: "Keywords are required" }),
  googleAnalyticsTag: z.string()
    .refine((val) => {
      if (!val || val.trim() === '') return true
      // Google Analytics 4 measurement ID format: G-XXXXXXXXXX
      // Universal Analytics format: UA-XXXXXXXX-X
      return /^(G-[A-Z0-9]{10}|UA-\d{8}-\d)$/.test(val)
    }, { message: "Please enter a valid Google Analytics tracking ID (G-XXXXXXXXXX or UA-XXXXXXXX-X)" }),
  facebookPixel: z.string()
    .refine((val) => {
      if (!val || val.trim() === '') return true
      // Facebook Pixel ID is typically 15-16 digits
      return /^\d{15,16}$/.test(val)
    }, { message: "Please enter a valid Facebook Pixel ID (15-16 digits)" })
})

interface CharacterCountFieldProps {
  field: any
  label: string
  placeholder: string
  description: string
  maxLength: number
  isTextarea?: boolean
}

function CharacterCountField({ field, label, placeholder, description, maxLength, isTextarea = false }: CharacterCountFieldProps) {
  const currentLength = (field.state.value as string || '').length
  const isOverLimit = currentLength > maxLength
  const fieldId = `field-${Math.random().toString(36).substr(2, 9)}`
  const descriptionId = `${fieldId}-description`
  const countId = `${fieldId}-count`
  
  return (
    <field.FormItem>
      <field.FormLabel htmlFor={fieldId}>{label}</field.FormLabel>
      <field.FormControl>
        {isTextarea ? (
          <field.Textarea
            id={fieldId}
            placeholder={placeholder}
            value={field.state.value as string || ''}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => field.handleChange(e.target.value)}
            onBlur={field.handleBlur}
            rows={3}
            aria-describedby={`${descriptionId} ${countId}`}
            aria-invalid={field.state.meta.errors.length > 0}
          />
        ) : (
          <field.Input
            id={fieldId}
            placeholder={placeholder}
            value={field.state.value as string || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => field.handleChange(e.target.value)}
            onBlur={field.handleBlur}
            aria-describedby={`${descriptionId} ${countId}`}
            aria-invalid={field.state.meta.errors.length > 0}
          />
        )}
      </field.FormControl>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-2">
        <field.FormDescription id={descriptionId} className="flex-1 text-sm">
          {description}
        </field.FormDescription>
        <span 
          id={countId}
          className={`text-sm ${isOverLimit ? 'text-destructive' : 'text-muted-foreground'}`}
          aria-live="polite"
          aria-label={`Character count: ${currentLength} of ${maxLength} characters`}
        >
          {currentLength}/{maxLength}
        </span>
      </div>
      {field.state.meta.errors.length > 0 && (
        <field.FormMessage role="alert">
          {field.state.meta.errors.join(', ')}
        </field.FormMessage>
      )}
    </field.FormItem>
  )
}

export function SEOConfigurationPage() {
  const { restaurantId } = useParams({ from: '/restaurant/manage/$restaurantId/store/seo' })

  const form = useAppForm({
    defaultValues: {
      title: '',
      description: '',
      keywords: '',
      googleAnalyticsTag: '',
      facebookPixel: ''
    },
    validators: {
      onBlur: seoConfigurationSchema
    },
    onSubmit: async ({ value }) => {
      // TODO: Implement API call to save SEO configuration
      console.log('SEO configuration:', value)
      console.log('Restaurant ID:', restaurantId)

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
    },
  })

  return (
    <div className="container mx-auto py-4 px-4 sm:py-6 sm:px-6 space-y-4 sm:space-y-6 max-w-4xl">
      <div className="space-y-2">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">SEO Configuration</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Configure search engine optimization settings for your restaurant.
        </p>
      </div>

      <Card>
        <CardHeader className="pb-4 sm:pb-6">
          <CardTitle className="text-lg sm:text-xl">Search Engine Optimization</CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Set up meta tags, analytics, and tracking codes to improve your online presence.
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
            aria-label="SEO configuration form"
            role="form"
          >
            {/* Title Field with Character Count */}
            <form.AppField
              name="title"
              children={(field: any) => (
                <CharacterCountField
                  field={field}
                  label="Page Title"
                  placeholder="Enter your restaurant's page title"
                  description="The title that appears in search engine results and browser tabs"
                  maxLength={60}
                />
              )}
            />

            {/* Description Field with Character Count */}
            <form.AppField
              name="description"
              children={(field: any) => (
                <CharacterCountField
                  field={field}
                  label="Meta Description"
                  placeholder="Enter a compelling description of your restaurant"
                  description="A brief description that appears in search engine results"
                  maxLength={160}
                  isTextarea={true}
                />
              )}
            />

            {/* Keywords Field */}
            <form.AppField
              name="keywords"
              children={AppInputField({
                label: 'Keywords',
                placeholder: 'restaurant, food, cuisine, delivery, takeaway',
                description: 'Comma-separated keywords that describe your restaurant and cuisine',
              })}
            />

            {/* Google Analytics Tag Field */}
            <form.AppField
              name="googleAnalyticsTag"
              children={AppInputField({
                label: 'Google Analytics Tracking ID (Optional)',
                placeholder: 'G-XXXXXXXXXX or UA-XXXXXXXX-X',
                description: 'Your Google Analytics measurement ID for tracking website visits',
              })}
            />

            {/* Facebook Pixel Field */}
            <form.AppField
              name="facebookPixel"
              children={AppInputField({
                label: 'Facebook Pixel ID (Optional)',
                placeholder: '123456789012345',
                description: 'Your Facebook Pixel ID for tracking conversions and creating audiences',
              })}
            />

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 sm:pt-6">
              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
                children={([canSubmit, isFormSubmitting]) => (
                  <LoadingButton 
                    loading={!canSubmit || isFormSubmitting}
                    className="w-full sm:w-auto"
                    aria-describedby="seo-save-button-description"
                  >
                    Save SEO Configuration
                  </LoadingButton>
                )}
              />
              <div id="seo-save-button-description" className="sr-only">
                Save SEO settings including title, description, keywords, and tracking codes
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card'
import { useAppForm, AppSelectField, AppCheckboxField } from '@workspace/ui/components/tanstack-form'
import { LoadingButton } from '@workspace/ui/components/loading-button'
import { Button } from '@workspace/ui/components/button'
import { useParams } from '@tanstack/react-router'
import { useState } from 'react'
import { Trash2, Plus } from 'lucide-react'


interface ContactSupportEntry {
  id: string
  name: string
  phoneNumber: string
}

const currencyOptions = [
  { value: 'INR', label: '₹ Indian Rupee (INR)' },
  { value: 'USD', label: '$ US Dollar (USD)' },
  { value: 'EUR', label: '€ Euro (EUR)' },
  { value: 'GBP', label: '£ British Pound (GBP)' },
  { value: 'AUD', label: 'A$ Australian Dollar (AUD)' },
  { value: 'CAD', label: 'C$ Canadian Dollar (CAD)' }
]

export function DeliverySettingsPage() {
  const { restaurantId } = useParams({ from: '/restaurant/manage/$restaurantId/store/delivery' })
  const [contactSupport, setContactSupport] = useState<ContactSupportEntry[]>([
    { id: '1', name: '', phoneNumber: '' }
  ])

  const form = useAppForm({
    defaultValues: {
      freeDelivery: false,
      customFee: {
        baseDistance: 2,
        baseCharge: 30,
        subsequentKmRate: 10
      },
      deliveryRadius: 10,
      averagePreparationTime: 30,
      currency: 'INR',
      serviceTypes: {
        delivery: true,
        takeaway: true,
        dineIn: false
      },
      contactSupport: [{ name: '', phoneNumber: '' }],
      cashOnDelivery: true
    },

    onSubmit: async ({ value }) => {
      // TODO: Implement API call to save delivery settings
      console.log('Delivery settings:', value)
      console.log('Restaurant ID:', restaurantId)
      console.log('Contact support entries:', contactSupport)

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
    },
  })

  const addContactSupport = () => {
    const newEntry: ContactSupportEntry = {
      id: Date.now().toString(),
      name: '',
      phoneNumber: ''
    }
    setContactSupport([...contactSupport, newEntry])
    
    // Update form state
    const currentContacts = form.getFieldValue('contactSupport') as Array<{name: string, phoneNumber: string}>
    form.setFieldValue('contactSupport', [...currentContacts, { name: '', phoneNumber: '' }])
  }

  const removeContactSupport = (id: string, index: number) => {
    if (contactSupport.length > 1) {
      setContactSupport(contactSupport.filter(entry => entry.id !== id))
      
      // Update form state
      const currentContacts = form.getFieldValue('contactSupport') as Array<{name: string, phoneNumber: string}>
      form.setFieldValue('contactSupport', currentContacts.filter((_, i) => i !== index))
    }
  }

  const updateContactSupport = (index: number, field: 'name' | 'phoneNumber', value: string) => {
    const updatedContacts = [...contactSupport]
    updatedContacts[index] = { ...updatedContacts[index], [field]: value }
    setContactSupport(updatedContacts)
    
    // Update form state
    const currentContacts = form.getFieldValue('contactSupport') as Array<{name: string, phoneNumber: string}>
    const updatedFormContacts = [...currentContacts]
    updatedFormContacts[index] = { ...updatedFormContacts[index], [field]: value }
    form.setFieldValue('contactSupport', updatedFormContacts)
  }

  return (
    <div className="container mx-auto py-4 px-4 sm:py-6 sm:px-6 space-y-4 sm:space-y-6 max-w-6xl">
      <div className="space-y-2">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Delivery Settings</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Configure delivery operations, pricing, and service options.
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
        className="space-y-4 sm:space-y-6"
        noValidate
        aria-label="Delivery settings form"
        role="form"
      >
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
          {/* Delivery Fee Configuration Card */}
          <Card>
            <CardHeader className="pb-4 sm:pb-6">
              <CardTitle className="text-lg sm:text-xl">Delivery Fee Configuration</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Set up delivery charges and free delivery options.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6 pt-0">
              {/* Free Delivery Toggle */}
              <form.AppField
                name="freeDelivery"
                children={AppCheckboxField({
                  label: 'Enable Free Delivery',
                  description: 'Toggle to offer free delivery to customers'
                })}
              />

              {/* Custom Fee Configuration - Conditional */}
              <form.Subscribe
                selector={(state) => state.values.freeDelivery}
                children={(freeDelivery) => (
                  !freeDelivery && (
                    <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                      <h4 className="font-medium text-sm">Custom Delivery Fee</h4>
                      
                      <form.AppField
                        name="customFee.baseDistance"
                        children={(field: any) => (
                          <field.FormItem>
                            <field.FormLabel>Base Distance (km)</field.FormLabel>
                            <field.FormControl>
                              <field.Input
                                type="number"
                                step="0.1"
                                min="0.1"
                                placeholder="2"
                                value={field.state.value || ''}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => field.handleChange(parseFloat(e.target.value) || 0)}
                                onBlur={field.handleBlur}
                              />
                            </field.FormControl>
                            <field.FormDescription>
                              Distance covered by base charge
                            </field.FormDescription>
                            {field.state.meta.errors.length > 0 && (
                              <field.FormMessage>
                                {field.state.meta.errors.join(', ')}
                              </field.FormMessage>
                            )}
                          </field.FormItem>
                        )}
                      />

                      <form.AppField
                        name="customFee.baseCharge"
                        children={(field: any) => (
                          <field.FormItem>
                            <field.FormLabel>Base Charge Amount</field.FormLabel>
                            <field.FormControl>
                              <field.Input
                                type="number"
                                min="0"
                                placeholder="30"
                                value={field.state.value || ''}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => field.handleChange(parseFloat(e.target.value) || 0)}
                                onBlur={field.handleBlur}
                              />
                            </field.FormControl>
                            <field.FormDescription>
                              Fixed charge for base distance
                            </field.FormDescription>
                            {field.state.meta.errors.length > 0 && (
                              <field.FormMessage>
                                {field.state.meta.errors.join(', ')}
                              </field.FormMessage>
                            )}
                          </field.FormItem>
                        )}
                      />

                      <form.AppField
                        name="customFee.subsequentKmRate"
                        children={(field: any) => (
                          <field.FormItem>
                            <field.FormLabel>Rate per Additional Km</field.FormLabel>
                            <field.FormControl>
                              <field.Input
                                type="number"
                                min="0"
                                placeholder="10"
                                value={field.state.value || ''}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => field.handleChange(parseFloat(e.target.value) || 0)}
                                onBlur={field.handleBlur}
                              />
                            </field.FormControl>
                            <field.FormDescription>
                              Charge per km beyond base distance
                            </field.FormDescription>
                            {field.state.meta.errors.length > 0 && (
                              <field.FormMessage>
                                {field.state.meta.errors.join(', ')}
                              </field.FormMessage>
                            )}
                          </field.FormItem>
                        )}
                      />
                    </div>
                  )
                )}
              />

              {/* Cash on Delivery Toggle */}
              <form.AppField
                name="cashOnDelivery"
                children={AppCheckboxField({
                  label: 'Accept Cash on Delivery',
                  description: 'Allow customers to pay with cash upon delivery'
                })}
              />
            </CardContent>
          </Card>

          {/* Delivery Operations Card */}
          <Card>
            <CardHeader className="pb-4 sm:pb-6">
              <CardTitle className="text-lg sm:text-xl">Delivery Operations</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Configure delivery radius, preparation time, and service types.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6 pt-0">
              {/* Delivery Radius */}
              <form.AppField
                name="deliveryRadius"
                children={(field: any) => (
                  <field.FormItem>
                    <field.FormLabel>Delivery Radius (km)</field.FormLabel>
                    <field.FormControl>
                      <field.Input
                        type="number"
                        min="1"
                        placeholder="10"
                        value={field.state.value || ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => field.handleChange(parseInt(e.target.value) || 0)}
                        onBlur={field.handleBlur}
                      />
                    </field.FormControl>
                    <field.FormDescription>
                      Maximum distance for delivery service
                    </field.FormDescription>
                    {field.state.meta.errors.length > 0 && (
                      <field.FormMessage>
                        {field.state.meta.errors.join(', ')}
                      </field.FormMessage>
                    )}
                  </field.FormItem>
                )}
              />

              {/* Average Preparation Time */}
              <form.AppField
                name="averagePreparationTime"
                children={(field: any) => (
                  <field.FormItem>
                    <field.FormLabel>Average Preparation Time (minutes)</field.FormLabel>
                    <field.FormControl>
                      <field.Input
                        type="number"
                        min="5"
                        placeholder="30"
                        value={field.state.value || ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => field.handleChange(parseInt(e.target.value) || 0)}
                        onBlur={field.handleBlur}
                      />
                    </field.FormControl>
                    <field.FormDescription>
                      Estimated time to prepare orders
                    </field.FormDescription>
                    {field.state.meta.errors.length > 0 && (
                      <field.FormMessage>
                        {field.state.meta.errors.join(', ')}
                      </field.FormMessage>
                    )}
                  </field.FormItem>
                )}
              />

              {/* Currency Selection */}
              <form.AppField
                name="currency"
                children={AppSelectField({
                  label: 'Currency',
                  placeholder: 'Select currency',
                  description: 'Currency for pricing and payments',
                  options: currencyOptions
                })}
              />

              {/* Service Types */}
              <div className="space-y-4">
                <h4 className="font-medium text-sm">Service Types</h4>
                <div className="space-y-3">
                  <form.AppField
                    name="serviceTypes.delivery"
                    children={AppCheckboxField({
                      label: 'Delivery Service',
                      description: 'Offer food delivery to customers'
                    })}
                  />

                  <form.AppField
                    name="serviceTypes.takeaway"
                    children={AppCheckboxField({
                      label: 'Takeaway Service',
                      description: 'Allow customers to pick up orders'
                    })}
                  />

                  <form.AppField
                    name="serviceTypes.dineIn"
                    children={AppCheckboxField({
                      label: 'Dine-in Service',
                      description: 'Accept customers for dining at restaurant'
                    })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Support Section - Full Width */}
        <Card>
          <CardHeader className="pb-4 sm:pb-6">
            <CardTitle className="text-lg sm:text-xl">Contact Support</CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Add contact information for customer support during delivery.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-0">
            <form.Subscribe
              selector={(state) => state.values.contactSupport}
              children={() => (
                <>
                  {contactSupport.map((contact, index) => (
                    <div key={contact.id} className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-end p-4 border rounded-lg">
                      <div className="flex-1 w-full sm:w-auto">
                        <label 
                          htmlFor={`contact-name-${contact.id}`}
                          className="text-sm font-medium block mb-1"
                        >
                          Contact Name
                        </label>
                        <input
                          id={`contact-name-${contact.id}`}
                          type="text"
                          placeholder="Enter contact name"
                          value={contact.name}
                          onChange={(e) => updateContactSupport(index, 'name', e.target.value)}
                          className="w-full px-3 py-2 border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                          aria-describedby={`contact-name-${contact.id}-description`}
                        />
                        <div id={`contact-name-${contact.id}-description`} className="sr-only">
                          Enter the name of the contact person for customer support
                        </div>
                      </div>
                      <div className="flex-1 w-full sm:w-auto">
                        <label 
                          htmlFor={`contact-phone-${contact.id}`}
                          className="text-sm font-medium block mb-1"
                        >
                          Phone Number
                        </label>
                        <input
                          id={`contact-phone-${contact.id}`}
                          type="tel"
                          placeholder="Enter phone number"
                          value={contact.phoneNumber}
                          onChange={(e) => updateContactSupport(index, 'phoneNumber', e.target.value)}
                          className="w-full px-3 py-2 border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                          aria-describedby={`contact-phone-${contact.id}-description`}
                        />
                        <div id={`contact-phone-${contact.id}-description`} className="sr-only">
                          Enter the phone number for customer support contact
                        </div>
                      </div>
                      {contactSupport.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeContactSupport(contact.id, index)}
                          className="text-destructive hover:text-destructive w-full sm:w-auto"
                          aria-label={`Remove contact ${contact.name || 'entry'}`}
                        >
                          <Trash2 className="h-4 w-4 sm:mr-0 mr-2" />
                          <span className="sm:hidden">Remove Contact</span>
                        </Button>
                      )}
                    </div>
                  ))}
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addContactSupport}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Contact Support
                  </Button>
                </>
              )}
            />
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 sm:pt-6">
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isFormSubmitting]) => (
              <LoadingButton 
                loading={!canSubmit || isFormSubmitting}
                className="w-full sm:w-auto"
                aria-describedby="delivery-save-button-description"
              >
                Save Delivery Settings
              </LoadingButton>
            )}
          />
          <div id="delivery-save-button-description" className="sr-only">
            Save all delivery settings including fees, operations, and contact support information
          </div>
        </div>
      </form>
    </div>
  )
}
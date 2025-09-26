import { Slot } from "@radix-ui/react-slot";
import * as React from "react";

import { Label } from "@workspace/ui/components/label";
import { cn } from "@workspace/ui/lib/utils";
import {
  createFormHook,
  createFormHookContexts,
  useStore,
} from "@tanstack/react-form";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@workspace/ui/components/select";
import { Textarea } from '@workspace/ui/components/textarea'
import { Checkbox } from "@workspace/ui/components/checkbox";
import { RadioGroup, RadioGroupItem } from "@workspace/ui/components/radio-group";
import { MultiSelect } from "@workspace/ui/components/multi-select";
import { ToggleGroup, ToggleGroupItem } from "./toggle-group.js";

const {
  fieldContext,
  formContext,
  useFieldContext: _useFieldContext,
  useFormContext,
} = createFormHookContexts();

const { useAppForm, withForm: _withForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    FormLabel,
    FormControl,
    FormDescription,
    FormMessage,
    FormItem,
    Input,
    FormSelect,
    FormCheckbox,
    FormRadioGroup,
    Textarea,
    MultiSelect
  },
  formComponents: {
    Button
  },
});

const withForm = _withForm as <T extends React.ComponentType<any>>(
  component: T
) => T;

type FormItemContextValue = {
  id: string;
};

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue,
);

function FormItem({ className, ...props }: React.ComponentProps<"div">) {
  const id = React.useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <div
        data-slot="form-item"
        className={cn("grid gap-2", className)}
        {...props}
      />
    </FormItemContext.Provider>
  );
}

const useFieldContext = (): any => {
  const { id } = React.useContext(FormItemContext);
  const { name, store, ...fieldContext } = _useFieldContext();

  const errors = useStore(store, (state) => state.meta.errors);
  if (!fieldContext) {
    throw new Error("useFieldContext should be used within <FormItem>");
  }

  return {
    id,
    name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    errors,
    store,
    ...fieldContext,
  };
};

function FormLabel({
  className,
  ...props
}: React.ComponentProps<typeof Label>) {
  const { formItemId, errors } = useFieldContext();

  return (
    <Label
      data-slot="form-label"
      data-error={!!errors.length}
      className={cn("data-[error=true]:text-destructive", className)}
      htmlFor={formItemId}
      {...props}
    />
  );
}

function FormControl({ ...props }: React.ComponentProps<typeof Slot>) {
  const { errors, formItemId, formDescriptionId, formMessageId } =
    useFieldContext();

  return (
    <Slot
      data-slot="form-control"
      id={formItemId}
      aria-describedby={
        !errors.length
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!errors.length}
      {...props}
    />
  );
}

function FormDescription({ className, ...props }: React.ComponentProps<"p">) {
  const { formDescriptionId } = useFieldContext();

  return (
    <p
      data-slot="form-description"
      id={formDescriptionId}
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

function FormMessage({ className, ...props }: React.ComponentProps<"p">) {
  const { errors, formMessageId } = useFieldContext();
  const body = errors.length
    ? String(errors.at(0)?.message ?? "")
    : props.children;
  if (!body) return null;

  return (
    <p
      data-slot="form-message"
      id={formMessageId}
      className={cn("text-destructive text-sm", className)}
      {...props}
    >
      {body}
    </p>
  );
}

interface FormSelectProps {
  placeholder?: string;
  children: React.ReactNode;
  onValueChange?: (value: string) => void;
  value?: string;
  disabled?: boolean;
}

function FormSelect({ 
  placeholder = "Select an option...", 
  children, 
  onValueChange, 
  value, 
  disabled,
  ...props 
}: FormSelectProps) {
  const { errors, formItemId, formDescriptionId, formMessageId } = useFieldContext();

  return (
    <Select 
      value={value} 
      onValueChange={onValueChange} 
      disabled={disabled}
      {...props}
    >
      <FormControl>
        <SelectTrigger
          id={formItemId}
          aria-describedby={
            !errors.length
              ? `${formDescriptionId}`
              : `${formDescriptionId} ${formMessageId}`
          }
          aria-invalid={!!errors.length}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
      </FormControl>
      <SelectContent>
        {children}
      </SelectContent>
    </Select>
  );
}

interface FormCheckboxProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

function FormCheckbox({ 
  checked, 
  onCheckedChange, 
  disabled, 
  className,
  ...props 
}: FormCheckboxProps) {
  const { errors, formItemId, formDescriptionId, formMessageId } = useFieldContext();

  return (
    <FormControl>
      <Checkbox
        id={formItemId}
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        className={className}
        aria-describedby={
          !errors.length
            ? `${formDescriptionId}`
            : `${formDescriptionId} ${formMessageId}`
        }
        aria-invalid={!!errors.length}
        {...props}
      />
    </FormControl>
  );
}

interface FormRadioGroupProps {
  value?: string;
  onValueChange?: (value: any) => void;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}

function FormRadioGroup({ 
  value, 
  onValueChange, 
  disabled, 
  className, 
  children,
  ...props 
}: FormRadioGroupProps) {
  const { errors, formItemId, formDescriptionId, formMessageId } = useFieldContext();

  return (
    <FormControl>
      <RadioGroup
        id={formItemId}
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        className={className}
        aria-describedby={
          !errors.length
            ? `${formDescriptionId}`
            : `${formDescriptionId} ${formMessageId}`
        }
        aria-invalid={!!errors.length}
        {...props}
      >
        {children}
      </RadioGroup>
    </FormControl>
  );
}

// Generic AppField components for common patterns
interface AppFieldProps {
  label: string;
  description?: string;
  placeholder?: string;
  type?: 'input' | 'textarea' | 'select' | 'checkbox' | 'radio';
  options?: Array<{ value: string; label: string }>;
  className?: string;
}

function AppInputField({ 
  label, 
  description, 
  placeholder, 
  className 
}: Omit<AppFieldProps, 'type' | 'options'>) {
  return (field: any) => (
    <field.FormItem className={className}>
      <field.FormLabel>{label}</field.FormLabel>
      <field.FormControl>
        <field.Input
          placeholder={placeholder}
          value={field.state.value as string || ''}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => field.handleChange(e.target.value)}
          onBlur={field.handleBlur}
        />
      </field.FormControl>
      {description && (
        <field.FormDescription>
          {description}
        </field.FormDescription>
      )}
      {field.state.meta.errors.length > 0 && (
        <field.FormMessage>
          {field.state.meta.errors.join(', ')}
        </field.FormMessage>
      )}
    </field.FormItem>
  );
}

function AppTextareaField({ 
  label, 
  description, 
  placeholder, 
  className 
}: Omit<AppFieldProps, 'type' | 'options'>) {
  return (field: any) => (
    <field.FormItem className={className}>
      <field.FormLabel>{label}</field.FormLabel>
      <field.FormControl>
        <field.Textarea
          placeholder={placeholder}
          value={field.state.value as string || ''}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => field.handleChange(e.target.value)}
          onBlur={field.handleBlur}
        />
      </field.FormControl>
      {description && (
        <field.FormDescription>
          {description}
        </field.FormDescription>
      )}
      {field.state.meta.errors.length > 0 && (
        <field.FormMessage>
          {field.state.meta.errors.join(', ')}
        </field.FormMessage>
      )}
    </field.FormItem>
  );
}

function AppSelectField({ 
  label, 
  description, 
  placeholder = "Select an option...", 
  options = [],
  className 
}: AppFieldProps) {
  return (field: any) => (
    <field.FormItem className={className}>
      <field.FormLabel>{label}</field.FormLabel>
      <field.FormControl>
        <field.FormSelect
          placeholder={placeholder}
          value={field.state.value as string}
          onValueChange={(value: string) => field.handleChange(value)}
        >
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </field.FormSelect>
      </field.FormControl>
      {description && (
        <field.FormDescription>
          {description}
        </field.FormDescription>
      )}
      {field.state.meta.errors.length > 0 && (
        <field.FormMessage>
          {field.state.meta.errors.join(', ')}
        </field.FormMessage>
      )}
    </field.FormItem>
  );
}

function AppCheckboxField({ 
  label, 
  description, 
  className 
}: Omit<AppFieldProps, 'type' | 'options' | 'placeholder'>) {
  return (field: any) => (
    <field.FormItem className={className}>
      <div className="flex items-center space-x-2">
        <field.FormControl>
          <field.FormCheckbox
            checked={field.state.value as boolean}
            onCheckedChange={(checked: boolean) => field.handleChange(checked)}
          />
        </field.FormControl>
        <field.FormLabel className="text-sm font-normal">
          {label}
        </field.FormLabel>
      </div>
      {description && (
        <field.FormDescription>
          {description}
        </field.FormDescription>
      )}
      {field.state.meta.errors.length > 0 && (
        <field.FormMessage>
          {field.state.meta.errors.join(', ')}
        </field.FormMessage>
      )}
    </field.FormItem>
  );
}

function AppRadioField({ 
  label, 
  description, 
  options = [],
  className 
}: Omit<AppFieldProps, 'type' | 'placeholder'>) {
  return (field: any) => (
    <field.FormItem className={className}>
      <field.FormLabel>{label}</field.FormLabel>
      <field.FormControl>
        <field.FormRadioGroup
          value={field.state.value as string}
          onValueChange={(value: string) => field.handleChange(value)}
        >
          {options.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <RadioGroupItem value={option.value} id={option.value} />
              <Label htmlFor={option.value}>{option.label}</Label>
            </div>
          ))}
        </field.FormRadioGroup>
      </field.FormControl>
      {description && (
        <field.FormDescription>
          {description}
        </field.FormDescription>
      )}
      {field.state.meta.errors.length > 0 && (
        <field.FormMessage>
          {field.state.meta.errors.join(', ')}
        </field.FormMessage>
      )}
    </field.FormItem>
  );
}

function AppMultiSelectField({ 
  label,
  variant,
  options = [],
  className 
}: Omit<AppFieldProps, 'type' | 'placeholder'> & {variant: 'default' | 'secondary'}) {
  return (field: any) => (
    <field.FormItem className={className}>
      <field.FormLabel>{label}</field.FormLabel>
      <field.FormControl>
        <MultiSelect
          value={field.state.value as string[]}
          options={options}
          variant={variant}
          defaultValue={field.state.value}
          onValueChange={(value: string[]) => field.handleChange(value)}
        />
      </field.FormControl>
      {field.state.meta.errors.length > 0 && (
        <field.FormMessage>
          {field.state.meta.errors.join(', ')}
        </field.FormMessage>
      )}
    </field.FormItem>
  );
}


function AppToggleGroupField({ 
  label,
  toggleType,
  options = [],
  className 
}: Omit<AppFieldProps, 'placeholder'> & {toggleType: "single"}) {
  return (field: any) => (
    <field.FormItem className={className}>
      <field.FormLabel>{label}</field.FormLabel>
      <field.FormControl>
        <ToggleGroup
          className="flex w-full"
          type={toggleType}
          value={field.state.value as string}
          onValueChange={value => field.handleChange(value)}
        >
          {
            options.map(option => <ToggleGroupItem className="" key={option.value} value={option.value}>{option.label}</ToggleGroupItem>)
          }
        </ToggleGroup>
      </field.FormControl>
      {field.state.meta.errors.length > 0 && (
        <field.FormMessage>
          {field.state.meta.errors.join(', ')}
        </field.FormMessage>
      )}
    </field.FormItem>
  );
}

export { 
  useAppForm, 
  useFormContext, 
  useFieldContext, 
  withForm,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormSelect,
  FormCheckbox,
  FormRadioGroup,
  AppInputField,
  AppTextareaField,
  AppSelectField,
  AppCheckboxField,
  AppRadioField,
  AppMultiSelectField,
  AppToggleGroupField
};

// Re-export UI components for convenience
export { 
  SelectItem, 
  SelectLabel, 
  SelectSeparator 
} from "@workspace/ui/components/select";
export { RadioGroupItem } from "@workspace/ui/components/radio-group";

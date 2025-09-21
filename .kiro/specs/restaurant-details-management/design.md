# Design Document

## Overview

The Restaurant Details Management system provides a comprehensive interface for restaurant owners to manage their establishment's information through a multi-page tabbed interface. The system is built using React with TanStack Router for navigation, TanStack Form for form management, and follows the existing UI component patterns established in the codebase.

The feature consists of four main sections accessible via sub-routes under `/restaurant/manage/$restaurantId/store`:
- Store Details (`/store/details`) - Basic restaurant information
- SEO Configuration (`/store/seo`) - Search engine optimization settings  
- Delivery Settings (`/store/delivery`) - Delivery operations and pricing
- Location Management (`/store/location`) - Interactive map for location setting

## Architecture

### Route Structure
```
/restaurant/manage/$restaurantId/store/
├── details (default)
├── seo
├── delivery
└── location
```

### Component Hierarchy
```
StoreManagementLayout
├── StoreNavigationTabs
├── Outlet (renders current page)
│   ├── StoreDetailsPage
│   ├── SEOConfigurationPage
│   ├── DeliverySettingsPage
│   └── LocationManagementPage
```

### State Management
- Form state managed by TanStack Form for each page
- Navigation state handled by TanStack Router
- Local component state for UI interactions (toggles, dynamic arrays)
- No global state management needed for this feature

## Components and Interfaces

### 1. StoreManagementLayout Component
**Purpose**: Main layout wrapper providing navigation tabs and outlet for child pages

**Props**:
```typescript
interface StoreManagementLayoutProps {
  restaurantId: string;
}
```

**Features**:
- Horizontal tab navigation between sections
- Active tab highlighting based on current route
- Responsive design for mobile/desktop
- Consistent header with restaurant context

### 2. StoreDetailsPage Component
**Purpose**: Manages basic restaurant information

**Form Schema**:
```typescript
interface StoreDetailsForm {
  name: string;
  address: string;
  fssaiNumber: string;
  gstNumber: string;
  googleReviewLink: string;
  logo?: File;
}
```

**Features**:
- File upload component for logo with preview
- Form validation for required fields
- Pre-population of existing data
- Save/cancel actions with loading states

### 3. SEOConfigurationPage Component
**Purpose**: Manages SEO and tracking settings

**Form Schema**:
```typescript
interface SEOConfigurationForm {
  title: string;
  description: string;
  keywords: string;
  googleAnalyticsTag: string;
  facebookPixel: string;
}
```

**Features**:
- Character count indicators for title/description
- Keyword tag input with comma separation
- Validation for tracking code formats
- Preview of how content appears in search results

### 4. DeliverySettingsPage Component
**Purpose**: Manages delivery operations and pricing

**Form Schema**:
```typescript
interface DeliverySettingsForm {
  // Delivery Fee Configuration
  freeDelivery: boolean;
  customFee: {
    baseDistance: number;
    baseCharge: number;
    subsequentKmRate: number;
  };
  
  // Delivery Operations
  deliveryRadius: number;
  averagePreparationTime: number;
  currency: string;
  serviceTypes: {
    delivery: boolean;
    takeaway: boolean;
    dineIn: boolean;
  };
  contactSupport: Array<{
    name: string;
    phoneNumber: string;
  }>;
  cashOnDelivery: boolean;
}
```

**Features**:
- Two main card sections for organization
- Dynamic array management for contact support
- Conditional field display based on toggles
- Currency selection dropdown
- Time input for preparation time

### 5. LocationManagementPage Component
**Purpose**: Interactive map for setting restaurant location

**Form Schema**:
```typescript
interface LocationForm {
  latitude: number;
  longitude: number;
  address?: string; // Auto-populated from coordinates
}
```

**Features**:
- Interactive map using a mapping library (e.g., Leaflet, Google Maps)
- Draggable marker for location selection
- Address geocoding and reverse geocoding
- Current location detection
- Map zoom and pan controls

## Data Models

### Restaurant Store Details
```typescript
interface RestaurantStoreDetails {
  id: string;
  restaurantId: string;
  name: string;
  address: string;
  fssaiNumber: string;
  gstNumber: string;
  googleReviewLink: string;
  logoUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Restaurant SEO Configuration
```typescript
interface RestaurantSEOConfig {
  id: string;
  restaurantId: string;
  title: string;
  description: string;
  keywords: string;
  googleAnalyticsTag: string;
  facebookPixel: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Restaurant Delivery Settings
```typescript
interface RestaurantDeliverySettings {
  id: string;
  restaurantId: string;
  freeDelivery: boolean;
  customFee?: {
    baseDistance: number;
    baseCharge: number;
    subsequentKmRate: number;
  };
  deliveryRadius: number;
  averagePreparationTime: number;
  currency: string;
  serviceTypes: {
    delivery: boolean;
    takeaway: boolean;
    dineIn: boolean;
  };
  contactSupport: Array<{
    id: string;
    name: string;
    phoneNumber: string;
  }>;
  cashOnDelivery: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Restaurant Location
```typescript
interface RestaurantLocation {
  id: string;
  restaurantId: string;
  latitude: number;
  longitude: number;
  address: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## Error Handling

### Form Validation
- Client-side validation using TanStack Form validators
- Real-time validation feedback on field blur
- Form submission prevention when validation fails
- Clear error messages for each field type

### File Upload Errors
- File size validation (max 5MB for logos)
- File type validation (images only)
- Upload progress indication
- Retry mechanism for failed uploads

### Network Error Handling
- Loading states during API calls
- Error toast notifications for failed operations
- Retry buttons for failed requests
- Offline state detection and messaging

### Map Integration Errors
- Fallback for failed map loading
- Geolocation permission handling
- Address geocoding failure handling
- Network timeout for map services

### Accessibility Tests
- Keyboard navigation support
- Screen reader compatibility
- Focus management between tabs
- ARIA labels and descriptions

## UI/UX Design Patterns

### Card-Based Layout
- Each major section organized in cards using existing Card components
- Consistent spacing and typography
- Clear visual hierarchy with headers and descriptions

### Form Design
- Leverages existing TanStack Form components
- Consistent field styling and validation display
- Logical grouping of related fields
- Progressive disclosure for advanced settings

### Navigation Design
- Tab-based navigation for easy section switching
- Active state indication
- Breadcrumb support for deep navigation
- Mobile-responsive tab design

### Interactive Elements
- Toggle switches for boolean settings
- Dynamic array management with add/remove buttons
- File upload with drag-and-drop support
- Interactive map with intuitive controls

## Technical Implementation Notes

### Dependencies
- TanStack Router for routing and navigation
- TanStack Form for form state management
- Existing UI component library (@workspace/ui)
- Map library (to be selected: Leaflet or Google Maps)
- File upload utility (existing or new)

### Performance Considerations
- Lazy loading of map components
- Image optimization for logo uploads
- Form state persistence during navigation
- Debounced validation for better UX

### Responsive Design
- Mobile-first approach
- Collapsible navigation on smaller screens
- Touch-friendly interactive elements
- Optimized map controls for mobile

### Security Considerations
- File upload validation and sanitization
- Input sanitization for all form fields
- CSRF protection for form submissions
- Secure handling of tracking codes
# Design Document

## Overview

The restaurant management feature implements a post-authentication flow that guides users through restaurant selection or creation. The system leverages existing organization and restaurant APIs to determine the appropriate user experience based on their organizational memberships and associated restaurants.

## Architecture

### Flow Architecture

```mermaid
graph TD
    A[User Login/Register] --> B[Restaurant Selector Page]
    B --> C{Fetch Organizations}
    C --> D{Organization Count}
    D -->|0 Organizations| E[Redirect to /restaurant/add]
    D -->|1+ Organizations| F[Fetch Restaurant Data]
    F --> G{Restaurant Count}
    G -->|0 Restaurants| H[Show Add Restaurant Option]
    G -->|1+ Restaurants| I[Show Restaurant Selection]
    H --> J[Navigate to /restaurant/add]
    I --> K[Navigate to /restaurant/{id}]
    E --> L[Restaurant Creation Form]
    J --> L
    L --> M[Create Restaurant & Redirect]
```

### Route Structure

- `/restaurant/selector` - Main restaurant selection page
- `/restaurant/add` - Restaurant creation page
- `/restaurant/{id}` - Existing restaurant management (already exists)

## Components and Interfaces

### Core Components

#### RestaurantSelector Component
- **Location**: `apps/admin/src/routes/restaurant/selector.tsx`
- **Purpose**: Main orchestration component for restaurant selection flow
- **Responsibilities**:
  - Fetch user organizations using `useFindManyOrganization`
  - Fetch restaurants linked to organizations using `useFindManyRestaurant`
  - Handle conditional routing based on data
  - Display loading and error states

#### RestaurantSelectionList Component
- **Location**: `apps/admin/src/components/restaurant/RestaurantSelectionList.tsx`
- **Purpose**: Display available restaurants for selection
- **Props**:
  - `restaurants: Restaurant[]`
  - `onSelect: (restaurantId: string) => void`

#### RestaurantAddPlaceholder Component
- **Location**: `apps/admin/src/routes/restaurant/add.tsx`
- **Purpose**: Placeholder interface for restaurant creation
- **Initial Implementation**: Simple placeholder with form structure

### Data Interfaces

#### Organization Data Structure
```typescript
interface OrganizationWithRestaurants {
  id: string
  name: string
  restaurants: Restaurant[]
}
```

#### Restaurant Selection State
```typescript
interface RestaurantSelectionState {
  organizations: Organization[]
  restaurants: Restaurant[]
  loading: boolean
  error: string | null
}
```

### API Integration

#### Organization Queries
- Use existing `useFindManyOrganization` hook
- Filter by current user membership
- Include restaurant relationships in query

#### Restaurant Queries  
- Use existing `useFindManyRestaurant` hook
- Filter by organization IDs from user's memberships
- Include necessary restaurant details (name, id, organization)

## Data Models

### Query Parameters

#### Organization Query
```typescript
const organizationQuery = {
  where: {
    members: {
      some: {
        userId: currentUser.id
      }
    }
  },
  include: {
    restaurants: true
  }
}
```

#### Restaurant Query
```typescript
const restaurantQuery = {
  where: {
    organizationId: {
      in: organizationIds
    }
  },
  include: {
    organization: {
      select: {
        name: true
      }
    }
  }
}
```

## Error Handling

### Error States

#### Network Errors
- Display retry button with clear error message
- Fallback to cached data if available
- Graceful degradation to manual navigation

#### Authorization Errors
- Redirect to authentication if session expired
- Display appropriate permissions message

#### Data Inconsistency
- Handle cases where organizations exist but API fails
- Provide manual navigation options as fallback

### Loading States

#### Progressive Loading
1. Show skeleton for organization loading
2. Show skeleton for restaurant loading
3. Render final interface

#### Timeout Handling
- 10-second timeout for API calls
- Fallback interface with manual options

## Testing Strategy

### Unit Tests

#### Component Testing
- Test RestaurantSelector with different data scenarios
- Test conditional rendering based on organization/restaurant counts
- Test error state handling and recovery

#### Hook Testing
- Test data fetching logic
- Test error handling in API calls
- Test loading state management

### Integration Tests

#### Flow Testing
- Test complete authentication → selection flow
- Test navigation between different states
- Test API integration with mock data

#### Route Testing
- Test route parameter handling
- Test navigation redirects
- Test route guards and authentication

### Test Scenarios

#### Happy Path Scenarios
1. User with multiple restaurants selects one
2. User with no organizations gets redirected to add restaurant
3. User with organizations but no restaurants sees add option

#### Edge Case Scenarios
1. API failures during organization fetch
2. API failures during restaurant fetch
3. User with organizations but no restaurant permissions
4. Network connectivity issues

#### Error Recovery Scenarios
1. Retry failed API calls
2. Navigate manually when auto-redirect fails
3. Handle session expiration during flow

## Implementation Notes

### Authentication Integration
- Modify sign-in redirect from `/dashboard` to `/restaurant/selector`
- Ensure authentication state is available in restaurant selector
- Handle unauthenticated access to restaurant routes

### Navigation Integration
- Update existing navigation to handle restaurant selection state
- Ensure restaurant-based navigation works after selection
- Maintain restaurant context throughout application

### Performance Considerations
- Implement query caching for organization/restaurant data
- Use suspense boundaries for loading states
- Optimize re-renders during data fetching

### Accessibility
- Ensure keyboard navigation for restaurant selection
- Provide screen reader support for loading states
- Include proper ARIA labels for interactive elements
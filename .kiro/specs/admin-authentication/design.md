# Design Document

## Overview

The admin authentication system will integrate Better Auth with the existing admin application to provide secure user registration, sign-in, and session management. The design leverages the existing Better Auth UI components and integrates seamlessly with the current navigation structure using TanStack Router.

The system will enhance the existing Topbar component to show authentication state-aware navigation, replacing static buttons with dynamic authentication controls that respond to user session status.

## Architecture

### Authentication Flow
```mermaid
graph TD
    A[User Access] --> B{Authenticated?}
    B -->|No| C{On Auth Page?}
    B -->|Yes| D{On Auth Page?}
    C -->|No| E[Redirect to Sign In]
    C -->|Yes| F[Show Auth Page + Hide Sidebar]
    D -->|Yes| G[Redirect to Dashboard]
    D -->|No| H[Show App + Sidebar + Account Menu]
    E --> F
    F --> I[Better Auth UI Sign In/Up]
    I --> J{Valid Credentials?}
    J -->|No| K[Show Error]
    J -->|Yes| L[Establish Session]
    K --> I
    L --> M[Redirect to Dashboard]
    H --> N[Account Dropdown]
    N --> O[Account/Logout Options]
    O --> P{Action?}
    P -->|Account| Q[Navigate to Account Page]
    P -->|Logout| R[Better Auth Logout]
    R --> S[Clear Session]
    S --> T[Redirect to Sign In]
```

### Component Architecture
```mermaid
graph TD
    A[AuthProvider] --> B[RootLayout]
    A --> C[Auth Routes]
    B --> D[AuthGuard]
    B --> E[LayoutController]
    D --> F{Authenticated?}
    F -->|No| G[Redirect to Auth]
    F -->|Yes| H[Allow Access]
    E --> I{On Auth Page?}
    I -->|Yes| J[Hide Sidebar + Show Auth Layout]
    I -->|No| K[Show Full Layout + Sidebar]
    K --> L[Topbar with AuthenticatedNav]
    J --> M[Topbar with UnauthenticatedNav]
    C --> N[SignInPage]
    C --> O[RegisterPage]
    N --> P[Better Auth UI SignIn]
    O --> Q[Better Auth UI SignUp]
    L --> R[AccountDropdown]
    R --> S[AccountButton]
    R --> T[LogoutButton]
```

## Components and Interfaces

### 1. Enhanced Topbar Component
**Location:** `apps/admin/src/components/layout/Topbar.tsx`

The Topbar will be enhanced to show authentication-aware navigation:
- **Unauthenticated State:** Shows "Sign In" button
- **Authenticated State:** Shows account dropdown with user options

**Key Features:**
- Uses Better Auth's `useSession` hook to determine authentication state
- Renders different UI based on session status
- Integrates with existing sidebar trigger and settings

### 2. Authentication Navigation Components
**Location:** `apps/admin/src/components/auth/`

#### AuthenticatedNav Component
- Displays user account dropdown
- Shows "Account" and "Logout" options
- Handles logout functionality using Better Auth client

#### UnauthenticatedNav Component  
- Displays "Sign In" button
- Navigates to `/auth/signin` when clicked

#### AccountDropdown Component
- Dropdown menu for authenticated users
- Contains account management and logout options
- Uses existing UI components for consistency

### 3. Enhanced Auth Routes
**Existing Files:** 
- `apps/admin/src/routes/auth/signin.tsx`
- `apps/admin/src/routes/auth/register.tsx`

**Enhancements:**
- Add proper redirect handling for authenticated users
- Improve styling and layout consistency
- Add navigation links between signin and register pages
- Implement proper error handling and loading states

### 4. Authentication Hooks
**Location:** `apps/admin/src/hooks/useAuth.ts`

Custom hook that wraps Better Auth functionality:
- Provides authentication state
- Handles login/logout operations
- Manages session persistence
- Provides loading and error states

### 5. Route Protection and Layout Control
**Location:** `apps/admin/src/lib/routeGuards.ts`

Utility functions for protecting routes:
- Redirect unauthenticated users to sign-in
- Redirect authenticated users away from auth pages
- Handle session expiration

**Location:** `apps/admin/src/components/layout/AuthGuard.tsx`

Component that wraps protected routes:
- Uses Better Auth's `useSession` hook to check authentication
- Provides loading states during session checks
- Handles redirects for unauthenticated access

**Location:** `apps/admin/src/components/layout/LayoutController.tsx`

Component that controls sidebar visibility:
- Detects when user is on auth pages (`/auth/*`)
- Conditionally renders sidebar based on current route
- Manages layout transitions between auth and app views

## Data Models

### User Session
```typescript
interface UserSession {
  id: string
  email: string
  name?: string
  createdAt: Date
  expiresAt: Date
}
```

### Authentication State
```typescript
interface AuthState {
  isAuthenticated: boolean
  user: UserSession | null
  isLoading: boolean
  error: string | null
}
```

### Navigation State
```typescript
interface NavigationAuthState {
  showSignIn: boolean
  showAccountMenu: boolean
  user: UserSession | null
}
```

### Layout State
```typescript
interface LayoutState {
  showSidebar: boolean
  isAuthPage: boolean
  isLoading: boolean
}
```

## Error Handling

### Authentication Errors
- **Invalid Credentials:** Display user-friendly error message on sign-in form
- **Registration Conflicts:** Show specific error for existing email addresses
- **Network Errors:** Display retry options and fallback messaging
- **Session Expiration:** Automatically redirect to sign-in with informative message

### Navigation Errors
- **Route Protection:** Graceful redirects for unauthorized access attempts
- **State Synchronization:** Handle cases where auth state and navigation state become inconsistent

### Error Display Strategy
- Use Better Auth UI's built-in error handling for form validation
- Implement toast notifications for session-related errors
- Provide clear feedback for all user actions

## Layout and UI Considerations

### Sidebar Management
- **Auth Pages:** Sidebar is completely hidden, content uses full width
- **Protected Pages:** Sidebar is visible with normal layout
- **Transition Handling:** Smooth transitions between auth and app layouts
- **Responsive Behavior:** Layout adapts properly on different screen sizes

### Authentication UI Integration
- Better Auth UI components integrate seamlessly with existing design system
- Auth pages maintain consistent styling with the rest of the application
- Loading states are handled gracefully during authentication checks
- Error messages are displayed using consistent UI patterns

### Route-Based Layout Control
- Layout changes are determined by current route path
- Auth routes (`/auth/*`) trigger sidebar hiding automatically
- Non-auth routes restore full layout with sidebar
- Layout state is managed at the root level for consistency

## Security Considerations

### Session Management
- Leverage Better Auth's secure session handling
- Implement proper session expiration and renewal
- Use secure HTTP-only cookies for session storage

### Route Protection
- Implement client-side route guards for UX
- Ensure server-side validation for all protected endpoints
- Handle authentication state synchronization
- Protect all non-auth routes from unauthenticated access

### Input Validation
- Use Better Auth UI's built-in validation
- Implement additional client-side validation for UX
- Ensure proper sanitization of user inputs

### Error Information
- Avoid exposing sensitive information in error messages
- Log security events for monitoring
- Implement rate limiting for authentication attempts
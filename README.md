# Restaurant Management System

A comprehensive restaurant management platform built with modern web technologies, featuring both admin and customer-facing applications in a monorepo structure.

## 🍽️ What This Project Does

This restaurant management system provides a complete solution for restaurant operations, featuring:

### 🎯 Core Features

**Admin Dashboard (`/apps/admin`)**
- **Order Management**: Real-time order tracking with status updates (Pending, Confirmed, Preparing, Ready, Completed, Cancelled)
- **Menu Management**: Create, edit, and organize menu items with categories and subcategories
- **Restaurant Operations**: Manage multiple restaurant locations and settings
- **Interactive Order Interface**: Click-to-select orders with visual feedback and URL-based state management
- **Drag & Drop Menu Editor**: Intuitive menu organization with drag-and-drop functionality

**Customer Web App (`/apps/web`)**
- **Online Ordering**: Browse menu and place orders
- **Restaurant Discovery**: Find and explore restaurant locations
- **Order Tracking**: Real-time order status updates

**Backend Server (`/server`)**
- **API Gateway**: Express.js server with authentication and authorization
- **Database Integration**: Prisma ORM with PostgreSQL
- **Real-time Updates**: WebSocket support for live order updates
- **Authentication**: Better Auth integration for secure user management

### 🏗️ Architecture

**Monorepo Structure** powered by:
- **Frontend**: React 19 + TypeScript + TanStack Router
- **UI Library**: shadcn/ui components with Tailwind CSS
- **Backend**: Node.js + Express + Prisma
- **Database**: PostgreSQL with ZenStack for enhanced Prisma experience
- **Authentication**: Better Auth for secure user sessions
- **Package Manager**: pnpm with workspace configuration
- **Build System**: Turbo for optimized builds

### 📁 Project Structure

```
├── apps/
│   ├── admin/          # Restaurant admin dashboard
│   └── web/            # Customer-facing web app
├── packages/
│   ├── db/             # Database schema and hooks
│   ├── ui/             # Shared UI components
│   ├── eslint-config/  # Shared ESLint configuration
│   └── typescript-config/ # Shared TypeScript configuration
├── server/             # Backend API server
└── package.json        # Root workspace configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm 8+
- PostgreSQL database

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd restaurant-interface
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy environment files and configure your database
   cp server/.env.example server/.env
   # Update database URL and other configuration
   ```

4. **Initialize database**
   ```bash
   cd server
   pnpm db:push
   pnpm db:seed
   ```

### Development

**Start all applications:**
```bash
pnpm dev
```

**Start specific applications:**
```bash
# Admin dashboard
pnpm dev --filter admin

# Customer web app
pnpm dev --filter web

# Backend server
pnpm dev --filter server
```

### Building

```bash
# Build all packages
pnpm build

# Build specific package
pnpm build --filter admin
```

## 🛠️ Tech Stack

- **Frontend Framework**: React 19 with TypeScript
- **Routing**: TanStack Router with file-based routing
- **UI Components**: shadcn/ui + Radix UI primitives
- **Styling**: Tailwind CSS with CSS-in-JS support
- **State Management**: TanStack Query + Zustand
- **Backend**: Node.js + Express.js
- **Database**: PostgreSQL + Prisma ORM + ZenStack
- **Authentication**: Better Auth
- **Build Tool**: Vite for frontend, tsx for backend
- **Monorepo**: pnpm workspaces + Turbo
- **Type Safety**: Full TypeScript coverage

## 📱 Features in Detail

### Order Management
- Visual order cards with status indicators
- Click-to-select with green border highlighting
- URL-based state management for shareable links
- Automatic first-order selection
- Real-time status updates
- Infinite scroll pagination

### Menu Management
- Drag-and-drop menu organization
- Category and subcategory management
- Item availability controls
- Pricing and description management

### Authentication & Security
- Secure user authentication with Better Auth
- Role-based access control
- Session management
- Protected routes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🔧 Development Commands

```bash
# Install dependencies
pnpm install

# Start development servers
pnpm dev

# Build all packages
pnpm build

# Run tests
pnpm test

# Lint code
pnpm lint

# Format code
pnpm format

# Database operations
pnpm db:push    # Push schema changes
pnpm db:seed    # Seed database
pnpm db:studio  # Open Prisma Studio
```

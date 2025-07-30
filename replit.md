# Prolits - Property Management System

## Overview

Prolits is a modern, full-stack property management application built with React, Express, and PostgreSQL. The system provides comprehensive property management capabilities including property oversight, tenant management, financial tracking, maintenance requests, and communication tools.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Framework**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design system variables
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for client-side routing
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM with PostgreSQL
- **Authentication**: Replit OAuth integration with session management
- **File Storage**: Google Cloud Storage integration with Uppy for file uploads

### Database Architecture
- **Database**: PostgreSQL (Neon Database)
- **Schema Management**: Drizzle Kit for migrations
- **Session Storage**: PostgreSQL-based session store using connect-pg-simple

## Key Components

### Authentication System
- Replit OAuth integration for user authentication
- Session-based authentication with PostgreSQL session storage
- Role-based access control (admin, manager, tenant, owner, staff)
- Passport.js strategy for OpenID Connect

### Data Models
The system includes comprehensive data models for:
- Users with role-based permissions
- Properties with type classification (residential, commercial, mixed_use)
- Units within properties
- Leases with status tracking
- Maintenance requests with priority levels
- Messages with delivery status
- Payments and financial tracking
- Document management

### User Interface
- Responsive design with mobile-first approach
- Dark/light theme support
- Dashboard with real-time statistics
- Property management interface
- Tenant management system
- Financial reporting and tracking
- Maintenance request system
- Communication center
- Document management

### File Management
- Google Cloud Storage integration for document and image storage
- Uppy-based file upload system with drag-and-drop support
- Multiple upload methods (dashboard, drag-drop, file input)

## Data Flow

### Client-Server Communication
1. Frontend makes authenticated API requests to Express backend
2. Backend validates user sessions and permissions
3. Database operations performed through Drizzle ORM
4. Results returned as JSON responses
5. Frontend updates UI using React Query cache

### Authentication Flow
1. User initiates login through Replit OAuth
2. Backend validates OAuth token and creates session
3. Session stored in PostgreSQL with TTL
4. Subsequent requests authenticated via session cookies
5. Unauthorized requests redirect to login

### File Upload Flow
1. Client selects files through Uppy interface
2. Files uploaded directly to Google Cloud Storage
3. Metadata stored in PostgreSQL documents table
4. References linked to relevant entities (properties, maintenance requests, etc.)

## External Dependencies

### Core Infrastructure
- **Neon Database**: PostgreSQL hosting and management
- **Google Cloud Storage**: File and document storage
- **Replit Auth**: OAuth authentication provider

### Key Libraries
- **@neondatabase/serverless**: Database connection with WebSocket support
- **@tanstack/react-query**: Data fetching and caching
- **@radix-ui/***: Accessible UI component primitives
- **drizzle-orm**: Type-safe database operations
- **uppy**: File upload handling
- **zod**: Runtime type validation
- **react-hook-form**: Form state management

### Development Tools
- **TypeScript**: Type safety and developer experience
- **Vite**: Fast development server and build tool
- **Tailwind CSS**: Utility-first styling
- **ESBuild**: Production bundling for server code

## Deployment Strategy

### Build Process
1. Frontend built using Vite with React plugin
2. Backend bundled using ESBuild for Node.js target
3. TypeScript compilation with strict mode enabled
4. Database schema pushed using Drizzle Kit

### Environment Configuration
- Development mode runs with tsx for hot reloading
- Production serves static files and API from single Express server
- Database migrations managed through Drizzle Kit
- Environment variables for database connection and OAuth configuration

### Production Deployment
- Single Node.js process serves both API and static assets
- Session persistence through PostgreSQL
- File uploads handled asynchronously through Google Cloud Storage
- Error handling with graceful fallbacks and user feedback

The application follows modern full-stack patterns with clear separation of concerns, type safety throughout, and scalable architecture suitable for property management workflows.

## Recent Changes

### January 30, 2025
- **Enhanced Authentication UI**: Implemented comprehensive sign-up, login, and logout functionalities
  - Created reusable LoginButton component with Replit Auth integration
  - Added SignupButton component for new user registration
  - Enhanced TopBar with user profile dropdown showing user avatar and info
  - Integrated LogoutButton with proper session termination
  - Updated landing page with improved call-to-action buttons
  - User profile displays name, email, and profile image from Replit Auth
  - Added Google and Microsoft OAuth authentication options
  - Created AuthSection component with multiple sign-in providers
  - Implemented server-side OAuth strategies for Google and Microsoft
  - Authentication system gracefully handles missing OAuth credentials
  - Added manual email/password signup and login functionality
  - Created SignupForm and LoginForm components with validation
  - Implemented bcrypt password hashing and local authentication strategy
  - Enhanced users table with passwordHash and authProvider fields
  
- **Modal-Based Dashboard Interface**: Refactored quick actions to use modal system
  - Created separate modal components (PropertyModal, TenantInviteModal, DocumentUploadModal)
  - Replaced embedded forms with clean action buttons
  - Improved user experience with organized modal dialogs
  - Forms automatically close modals on successful completion
  
- **Application Tour System**: Added comprehensive onboarding tour for new users
  - Interactive step-by-step guide through all major features
  - First-visit detection and automatic tour launch
  - Manual tour activation via help button in header
  - Progress tracking and tour completion storage
  - Covers: Dashboard, Properties, Tenants, Maintenance, Financials, Documents, Communication, Reports, AI Assistant, and Notifications
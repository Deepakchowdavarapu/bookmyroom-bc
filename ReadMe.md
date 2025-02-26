# Hotel & Restaurant Booking System

## Backend (NestJS)

### Architecture
- Fully modular design using NestJS decorators and dependency injection
- TypeORM for database management with PostgreSQL
- JWT-based authentication
- Role-based access control (RBAC)

### Core Modules
- **Auth**: Handles user authentication and authorization
- **Users**: User management and profiles
- **Listings**: Hotel and restaurant listing management
- **Bookings**: Reservation handling
- **Reviews**: Customer feedback system

### Entities
- **User**: Stores user data with role-based access (Customer, Vendor, Admin)
- **Listing**: Represents hotels and restaurants
- **Unit**: Individual rooms or tables within listings
- **Booking**: Reservation records
- **Review**: Customer feedback and ratings

### Security Features
- Password hashing with bcrypt
- JWT token authentication
- Role-based guards
- Request validation using class-validator

## Frontend (React)

### Technology Choices
- **Vite**: For fast development and optimized builds
- **React Query**: For efficient server state management
- **TailwindCSS**: For responsive and maintainable styling
- **React Router**: For client-side routing
- **TypeScript**: For type safety

### Architecture
- Role-based routing system
- Context-based auth state management
- Modular component structure
- Responsive layouts

### Key Features
#### Role-specific dashboards:
- Customer: Booking management and reviews
- Vendor: Listing management and booking requests
- Admin: User management and system overview

#### Listing Management:
- Search and filter
- Detailed views
- Booking system
- Review system

### UI Components
- Reusable layout components
- Form components with validation
- Loading states and error handling
- Toast notifications

### State Management
- React Query for server state
- Context API for auth state
- Local state for UI interactions

## Integration

### API Communication
- Axios for HTTP requests
- Centralized API client configuration
- Error handling and interceptors
- JWT token management

### Type Safety
- Shared TypeScript interfaces
- Enum synchronization between frontend and backend
- Strict type checking

## Development Features

### Backend
- Hot reload
- TypeORM migrations
- Environment configuration
- Validation pipes
- Exception filters

### Frontend
- Hot module replacement
- Environment variables
- Path aliases
- Development proxy
- Code splitting

## Architecture Benefits
- Clear separation of concerns
- Type safety across the stack
- Scalable and maintainable codebase
- Secure authentication and authorization
- Efficient state management
- Responsive and user-friendly interface
- Role-based access control
- Real-time updates using React Query
- Optimized performance with Vite

> The project follows best practices for both NestJS and React development, making it suitable for production use while maintaining developer productivity.
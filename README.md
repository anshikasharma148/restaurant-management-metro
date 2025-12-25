# Metro Restaurant Management System

A comprehensive restaurant management system built for Metro Hotel, featuring order management, kitchen display, billing, reporting, and settings management.

## Features

- **Order Management**: Create and manage dine-in and takeaway orders
- **Kitchen Display**: Real-time order tracking with status updates
- **Billing System**: Process payments with multiple payment methods
- **Reports & Analytics**: Sales reports, top items, and category-wise sales
- **Settings Management**: Configure restaurant details, tax rates, and operating hours
- **Role-Based Access**: Different access levels for Admin, Manager, Cashier, and Kitchen staff

## Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui components
- React Router
- TanStack Query

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcrypt for password hashing

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/anshikasharma148/restaurant-management-metro.git
cd restaurant-management-system-demo
```

2. Install frontend dependencies:
```bash
npm install
```

3. Install backend dependencies:
```bash
cd backend
npm install
```

4. Set up environment variables:

Create a `.env` file in the `backend` directory:
```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/metro-restaurant
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:8080
```

Create a `.env` file in the root directory for frontend:
```env
VITE_API_URL=http://localhost:3000/api
```

5. Seed the database:
```bash
cd backend
npm run seed
```

This will create:
- Default users (admin, manager, cashier, kitchen)
- Sample menu items and categories
- Tables
- Settings

Default login credentials:
- Admin: admin@metro.com / admin123
- Manager: manager@metro.com / manager123
- Cashier: cashier@metro.com / cashier123
- Kitchen: kitchen@metro.com / kitchen123

6. Start the backend server:
```bash
cd backend
npm run dev
```

7. Start the frontend development server (in a new terminal):
```bash
npm run dev
```

The application will be available at:
- Frontend: http://localhost:8080
- Backend API: http://localhost:3000

## Project Structure

```
├── backend/
│   ├── src/
│   │   ├── config/          # Database and JWT configuration
│   │   ├── controllers/      # Route controllers
│   │   ├── middleware/       # Auth and error middleware
│   │   ├── models/           # MongoDB models
│   │   ├── routes/           # API routes
│   │   ├── utils/            # Helper functions and seed script
│   │   └── server.js         # Express server entry point
│   ├── .env.example
│   └── package.json
├── src/
│   ├── components/           # React components
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utilities and API client
│   ├── pages/               # Page components
│   └── main.tsx            # React entry point
└── package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Menu
- `GET /api/menu/items` - Get all menu items
- `GET /api/menu/categories` - Get all categories
- `POST /api/menu/items` - Create menu item (Admin/Manager)
- `PUT /api/menu/items/:id` - Update menu item (Admin/Manager)
- `DELETE /api/menu/items/:id` - Delete menu item (Admin)

### Orders
- `GET /api/orders` - Get orders (with filters)
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/status` - Update order status
- `PUT /api/orders/:id` - Update order (Admin/Manager)
- `DELETE /api/orders/:id` - Cancel order (Admin)

### Tables
- `GET /api/tables` - Get all tables
- `PUT /api/tables/:id/status` - Update table status

### Payments
- `POST /api/payments` - Process payment
- `GET /api/payments` - Get payments (with filters)

### Reports
- `GET /api/reports/sales` - Sales summary
- `GET /api/reports/top-items` - Top selling items
- `GET /api/reports/category-sales` - Sales by category
- `GET /api/reports/dashboard` - Dashboard statistics

### Settings
- `GET /api/settings` - Get settings
- `PUT /api/settings` - Update settings (Admin)

## Development

### Running in Development Mode

Frontend:
```bash
npm run dev
```

Backend:
```bash
cd backend
npm run dev
```

### Building for Production

Frontend:
```bash
npm run build
```

Backend:
```bash
cd backend
npm start
```

## License

ISC

## Support

For issues and questions, please open an issue on the GitHub repository.

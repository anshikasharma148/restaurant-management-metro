# Environment Variables Setup Guide

## Backend `.env` File

Create a `.env` file in the `backend/` directory with the following variables:

### Required Variables

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# MongoDB Configuration
# Local MongoDB
MONGODB_URI=mongodb://localhost:27017/metro-restaurant

# MongoDB Atlas (Cloud) - Example:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/metro-restaurant?retryWrites=true&w=majority

# JWT Authentication
# Generate a strong secret: openssl rand -base64 32
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-characters
JWT_EXPIRE=7d

# CORS Configuration
FRONTEND_URL=http://localhost:8080
```

### Optional but Recommended Variables

```env
# Rate Limiting (if you add rate limiting middleware)
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
LOG_FILE=logs/app.log

# Email Service (for notifications/password reset)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=noreply@metrorestaurant.com

# File Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_PATH=uploads

# Session Configuration
SESSION_SECRET=your-session-secret-key

# Timezone
TZ=America/New_York

# Database Connection Pool Settings
DB_POOL_SIZE=10
DB_POOL_MIN=2
DB_POOL_MAX=10
```

### Production-Specific Variables

```env
# Production Environment
NODE_ENV=production
PORT=3000

# Production MongoDB (use MongoDB Atlas)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/metro-restaurant?retryWrites=true&w=majority

# Strong JWT Secret (generate with: openssl rand -base64 32)
JWT_SECRET=your-very-strong-production-secret-key-minimum-32-characters-long

# Production Frontend URLs (comma-separated for multiple)
FRONTEND_URL=https://yourdomain.com,https://www.yourdomain.com
```

## Frontend `.env` File

Create a `.env` file in the root directory with:

### Required Variables

```env
# Backend API URL
VITE_API_URL=http://localhost:3000/api
```

### Production Example

```env
VITE_API_URL=https://api.yourdomain.com/api
```

### Optional Variables

```env
# Application Configuration
VITE_APP_NAME=Metro Restaurant Management System
VITE_APP_VERSION=1.0.0

# Feature Flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_ERROR_TRACKING=false

# External Service Keys (if needed)
VITE_STRIPE_PUBLIC_KEY=pk_test_...
VITE_GOOGLE_MAPS_API_KEY=...
```

## Security Best Practices

1. **Never commit `.env` files to version control**
   - `.env` is already in `.gitignore`
   - Use `.env.example` as a template

2. **Generate Strong Secrets**
   ```bash
   # Generate JWT secret
   openssl rand -base64 32
   
   # Generate session secret
   openssl rand -base64 32
   ```

3. **Use Different Secrets for Each Environment**
   - Development: Use simple secrets for local testing
   - Production: Use strong, randomly generated secrets

4. **Protect MongoDB Credentials**
   - Use MongoDB Atlas in production
   - Never expose connection strings in code
   - Use environment variables only

5. **CORS Configuration**
   - In development: `http://localhost:8080`
   - In production: Only your actual domain(s)
   - Never use `*` (wildcard) in production

## Quick Setup Commands

```bash
# Backend
cd backend
cp .env.example .env
# Edit .env with your values

# Frontend (root directory)
cp .env.example .env
# Edit .env with your values
```

## Environment-Specific Examples

### Development
```env
# backend/.env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/metro-restaurant
JWT_SECRET=dev-secret-key-change-in-production
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:8080
```

### Production
```env
# backend/.env
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/metro-restaurant
JWT_SECRET=<generated-strong-secret-32-chars-min>
JWT_EXPIRE=1d
FRONTEND_URL=https://metrorestaurant.com,https://www.metrorestaurant.com
```

## Notes

- All `VITE_*` variables in frontend are exposed to the browser
- Never put sensitive keys (like JWT_SECRET) in frontend `.env`
- Use different MongoDB databases for development and production
- Rotate secrets periodically in production
- Use environment-specific `.env` files (`.env.development`, `.env.production`)


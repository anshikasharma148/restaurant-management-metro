# Metro Restaurant Backend API

Backend API for Metro Restaurant Management System built with Node.js, Express.js, and MongoDB.

## Environment Variables

Create a `.env` file in the `backend/` directory with the following variables:

### Required Variables

```env
# Server
PORT=3000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/metro-restaurant

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# CORS
FRONTEND_URL=http://localhost:8080
```

### Optional Variables

See `.env.example` for a complete list of optional configuration variables including:
- Rate limiting settings
- Logging configuration
- Email service (SMTP)
- File upload settings
- External API keys
- Database connection pool settings

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Seed the database:
```bash
npm run seed
```

4. Start the server:
```bash
# Development
npm run dev

# Production
npm start
```

## API Documentation

See the main README.md for complete API endpoint documentation.

## Security Notes

- **Never commit `.env` file to version control**
- Use strong, unique `JWT_SECRET` in production (minimum 32 characters)
- Use MongoDB Atlas or secure MongoDB instance in production
- Set `NODE_ENV=production` in production
- Configure proper CORS origins for production
- Use HTTPS in production

## Database

The application uses MongoDB. You can use:
- Local MongoDB instance
- MongoDB Atlas (cloud)
- Docker MongoDB container

Update `MONGODB_URI` in `.env` accordingly.


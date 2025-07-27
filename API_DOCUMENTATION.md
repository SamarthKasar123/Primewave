# 📡 Primewave API Documentation

## Base URL
- **Development**: `http://localhost:5000/api`
- **Production**: `https://primewave-backend.onrender.com/api`

## Authentication
All protected routes require a JWT token in the request header:
```
x-auth-token: your_jwt_token_here
```

## Response Format
All API responses follow this structure:
```json
{
  "success": true,
  "message": "Success message",
  "data": {}, // Response data
  "token": "jwt_token" // For auth endpoints
}
```

Error responses:
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error description"
}
```

---

## 🔐 Authentication Endpoints

### Client Registration
**POST** `/auth/client/register`

Register a new client account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "whatsappNumber": "+1234567890"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "client"
  }
}
```

**Status Codes:**
- `201` - Successfully created
- `400` - Invalid input or user already exists
- `500` - Server error

---

### Client Login
**POST** `/auth/client/login`

Authenticate a client user.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "client"
  }
}
```

**Status Codes:**
- `200` - Successfully authenticated
- `401` - Invalid credentials
- `500` - Server error

---

### Manager Login
**POST** `/auth/manager/login`

Authenticate a manager user.

**Request Body:**
```json
{
  "username": "siddharth",
  "password": "Siddharth@123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "manager_id",
    "username": "siddharth",
    "role": "manager"
  }
}
```

**Status Codes:**
- `200` - Successfully authenticated
- `401` - Invalid credentials
- `500` - Server error

---

### Manager Registration (Development Only)
**POST** `/auth/manager/register`

Register a new manager account (for testing purposes).

**Request Body:**
```json
{
  "username": "newmanager",
  "email": "manager@primewave.com",
  "password": "SecurePassword123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "manager_id",
    "username": "newmanager",
    "email": "manager@primewave.com",
    "role": "manager"
  }
}
```

---

## 🏥 Health & Utility Endpoints

### Health Check
**GET** `/health`

Check the server and database status.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-01-27T10:30:00.000Z",
  "dbConnected": true,
  "environment": "development"
}
```

---

### Debug Routes
**GET** `/debug/routes`

List all registered API routes (development only).

**Response:**
```json
{
  "routes": [
    {
      "path": "/auth/client/login",
      "methods": ["post"]
    },
    {
      "path": "/auth/client/register",
      "methods": ["post"]
    }
  ],
  "timestamp": "2025-01-27T10:30:00.000Z"
}
```

---

### Test Auth Route
**POST** `/auth/test`

Test authentication route availability.

**Response:**
```json
{
  "message": "Auth route is working",
  "timestamp": "2025-01-27T10:30:00.000Z"
}
```

---

## 🔧 Error Handling

### Common Error Codes

| Status Code | Description |
|-------------|-------------|
| `400` | Bad Request - Invalid input data |
| `401` | Unauthorized - Invalid or missing token |
| `403` | Forbidden - Insufficient permissions |
| `404` | Not Found - Resource doesn't exist |
| `409` | Conflict - Resource already exists |
| `429` | Too Many Requests - Rate limit exceeded |
| `500` | Internal Server Error - Server malfunction |

### Error Response Examples

**Validation Error (400):**
```json
{
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

**Authentication Error (401):**
```json
{
  "message": "Invalid credentials"
}
```

**Server Error (500):**
```json
{
  "message": "Server error",
  "error": "Database connection failed"
}
```

---

## 🔒 Security Features

### JWT Token Structure
```json
{
  "id": "user_id",
  "email": "user@example.com", // For clients
  "username": "username",      // For managers
  "role": "client|manager",
  "iat": 1643284800,          // Issued at
  "exp": 1643371200           // Expires at (24h)
}
```

### Password Requirements
- Minimum 6 characters
- At least one uppercase letter (recommended)
- At least one number (recommended)
- At least one special character (recommended)

### Rate Limiting
- 100 requests per 15-minute window per IP
- Authentication endpoints: 5 attempts per minute

---

## 📋 Default Manager Accounts

For testing purposes, the following manager accounts are pre-seeded:

| Username | Password | Email |
|----------|----------|-------|
| `siddharth` | `Siddharth@123` | siddharth@primewave.com |
| `abhinav` | `Abhinav@123` | abhinav@primewave.com |

---

## 🚀 Usage Examples

### JavaScript/Axios
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://primewave-backend.onrender.com/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Client registration
const registerClient = async (userData) => {
  try {
    const response = await api.post('/auth/client/register', userData);
    localStorage.setItem('token', response.data.token);
    return response.data;
  } catch (error) {
    console.error('Registration failed:', error.response.data);
  }
};

// Authenticated request
const makeAuthenticatedRequest = async () => {
  const token = localStorage.getItem('token');
  try {
    const response = await api.get('/protected-route', {
      headers: {
        'x-auth-token': token
      }
    });
    return response.data;
  } catch (error) {
    console.error('Request failed:', error.response.data);
  }
};
```

### cURL Examples
```bash
# Client registration
curl -X POST https://primewave-backend.onrender.com/api/auth/client/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securePassword123",
    "whatsappNumber": "+1234567890"
  }'

# Manager login
curl -X POST https://primewave-backend.onrender.com/api/auth/manager/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "siddharth",
    "password": "Siddharth@123"
  }'

# Health check
curl https://primewave-backend.onrender.com/api/health
```

---

## 📞 Support

For API-related questions or issues:
- **GitHub Issues**: [Create an issue](https://github.com/SamarthKasar123/Primewave/issues)
- **Documentation**: [README.md](../README.md)
- **Security**: [SECURITY.md](../SECURITY.md)

---

**Last Updated**: January 27, 2025  
**API Version**: 1.0.0

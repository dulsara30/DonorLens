# DonorLens Authentication System

Production-grade authentication system for the DonorLens NGO donation platform using Node.js, Express, MongoDB (Mongoose), and JWT.

## 🎯 Features

- ✅ **Secure Login Flow** with JWT Access & Refresh Tokens
- ✅ **HttpOnly Cookies** for refresh token storage (XSS protection)
- ✅ **bcrypt Password Hashing** for secure password storage
- ✅ **Role-Based Access Control** (USER, NGO_ADMIN)
- ✅ **Clean Architecture** (Controller → Usecase → Model)
- ✅ **Production-Ready Security** (Helmet, CORS, input validation)
- ✅ **Token Expiry Management** (15m access, 14d refresh)
- ✅ **Account Status Checking** (active/inactive users)

## 📁 Project Structure

```
donorlens-backend/
├── src/
│   ├── app.js                          # Express app configuration
│   ├── config/
│   │   └── db.js                       # MongoDB connection
│   ├── controllers/
│   │   └── auth/
│   │       └── LoginController.js      # HTTP request/response handling
│   ├── middleware/
│   │   └── auth.middleware.js          # JWT authentication & authorization
│   ├── models/
│   │   └── user/
│   │       └── User.js                 # User model with password methods
│   ├── routes/
│   │   └── auth/
│   │       └── auth.route.js           # Authentication routes
│   ├── usecases/
│   │   └── auth/
│   │       └── LoginUsecase.js         # Login business logic
│   └── utils/
│       ├── jwt.util.js                 # JWT generation & verification
│       └── cookie.util.js              # Cookie configuration
├── scripts/
│   └── createTestUser.js               # Create test users with hashed passwords
├── .env                                # Environment variables
├── server.js                           # Server entry point
├── package.json
├── USAGE_EXAMPLES.js                   # Complete API usage documentation
└── README.md                           # This file
```

## 🔐 Authentication Flow

### Login Process

1. **Client sends credentials** (email + password) to `POST /api/auth/login`
2. **Controller** extracts data and calls LoginUsecase
3. **Usecase validates**:
   - Email format
   - User exists in database
   - Account is active
   - Password matches using bcrypt
4. **Tokens generated**:
   - Access Token (JWT, 15 minutes)
   - Refresh Token (JWT, 14 days)
5. **Response**:
   - Access token in JSON body
   - Refresh token in HttpOnly cookie
   - User data (no password)

### Protected Routes

1. Client includes access token in `Authorization: Bearer <token>` header
2. `authenticateToken` middleware verifies token
3. Token decoded → `req.user` contains `{ userId, role }`
4. `authorizeRoles` middleware checks user role
5. Route handler executes with authenticated user context

## 🚀 Setup & Installation

### Prerequisites

- Node.js v18+
- MongoDB Atlas account or local MongoDB
- npm or yarn

### Installation Steps

1. **Install dependencies**:

```bash
cd donorlens-backend
npm install
```

2. **Configure environment variables** (`.env`):

```env
CLIENT_URL=http://localhost:5173
PORT=5000
MONGO_URI=your_mongodb_connection_string

# JWT Configuration - CHANGE THESE IN PRODUCTION!
JWT_ACCESS_SECRET=your_super_secure_access_secret_min_32_chars
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_SECRET=your_super_secure_refresh_secret_min_32_chars
JWT_REFRESH_EXPIRY=14d

NODE_ENV=development
```

⚠️ **IMPORTANT**: Generate strong, random secrets for production:

```bash
# Generate secrets using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

3. **Create test users**:

```bash
node scripts/createTestUser.js
```

This creates two test accounts:

- **Regular User**: `test@donorlens.com` / `Password123!`
- **Admin User**: `admin@donorlens.com` / `Admin123!`

4. **Start the server**:

```bash
# Development
npm run dev

# Production
npm start
```

Server runs on: `http://localhost:5000`

## 📡 API Endpoints

### POST `/api/auth/login`

Authenticate user and receive JWT tokens.

**Request:**

```json
{
  "email": "test@donorlens.com",
  "password": "Password123!"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "fullName": "Test User",
      "email": "test@donorlens.com",
      "role": "USER",
      "isActive": true,
      "createdAt": "2026-01-15T10:30:00.000Z"
    }
  }
}
```

**Sets Cookie:**

```
refreshToken=<token>; HttpOnly; Secure; SameSite=Strict; Max-Age=1209600; Path=/
```

**Error Responses:**

- `400` - Email/password missing or invalid format
- `401` - Invalid credentials
- `403` - Account deactivated
- `500` - Internal server error

### GET `/health`

Health check endpoint.

**Response (200):**

```json
{
  "success": true,
  "message": "DonorLens API is running",
  "timestamp": "2026-02-09T12:00:00.000Z"
}
```

## 🛡️ Security Features

### Implemented Security Measures

| Feature                    | Description                                                                  |
| -------------------------- | ---------------------------------------------------------------------------- |
| **HttpOnly Cookies**       | Refresh tokens stored in cookies inaccessible to JavaScript (XSS protection) |
| **Secure Flag**            | Cookies sent only over HTTPS in production                                   |
| **SameSite**               | CSRF protection via `SameSite=Strict` cookie attribute                       |
| **bcrypt Hashing**         | Passwords hashed with bcrypt (10 rounds, salt)                               |
| **Password Select: false** | Passwords never returned in queries by default                               |
| **JWT Expiry**             | Access tokens expire in 15 minutes, refresh in 14 days                       |
| **Generic Errors**         | No information leakage in error messages (prevents enumeration)              |
| **Input Validation**       | Email format and required field validation                                   |
| **Helmet**                 | Security headers (XSS, clickjacking, etc.)                                   |
| **CORS**                   | Configured to allow credentials from specific origin only                    |
| **Account Status**         | Checks if user account is active before login                                |

### Password Security

- Passwords hashed using bcrypt with salt rounds of 10
- Plain text passwords never stored or logged
- `passwordHash` field has `select: false` in schema
- Must explicitly select `+passwordHash` to access
- Password comparison done in model method

### Token Management

**Access Token:**

- Contains: `{ userId, role }`
- Expiry: 15 minutes (configurable)
- Used for: API authentication
- Stored: Client memory or state management (NOT localStorage)

**Refresh Token:**

- Contains: `{ userId }`
- Expiry: 14 days (configurable)
- Used for: Generating new access tokens
- Stored: HttpOnly cookie (secure)

## 🔧 Usage Examples

### Frontend (JavaScript/React)

```javascript
// Login function
async function login(email, password) {
  const response = await fetch("http://localhost:5000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // Important: allows cookies
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (data.success) {
    // Store access token in memory/state (NOT localStorage)
    return { accessToken: data.data.accessToken, user: data.data.user };
  }
  throw new Error(data.message);
}

// Make authenticated request
async function fetchProtectedData(accessToken) {
  const response = await fetch("http://localhost:5000/api/protected-route", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  return response.json();
}
```

### cURL

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@donorlens.com","password":"Password123!"}' \
  -c cookies.txt

# Use access token
curl -X GET http://localhost:5000/api/protected-route \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -b cookies.txt
```

### Postman

1. **Login:**
   - Method: `POST`
   - URL: `http://localhost:5000/api/auth/login`
   - Body (JSON):
     ```json
     {
       "email": "test@donorlens.com",
       "password": "Password123!"
     }
     ```
   - Copy `accessToken` from response

2. **Protected Route:**
   - Method: `GET`
   - URL: `http://localhost:5000/api/protected-route`
   - Authorization: Bearer Token
   - Token: `<paste accessToken>`
   - Settings: Enable cookies

## 🔐 Protecting Routes

### Basic Authentication

Require user to be logged in:

```javascript
import { authenticateToken } from "../middleware/auth.middleware.js";

router.get("/profile", authenticateToken, (req, res) => {
  // req.user contains { userId, role }
  res.json({ user: req.user });
});
```

### Role-Based Authorization

Restrict to specific roles:

```javascript
import {
  authenticateToken,
  authorizeRoles,
} from "../middleware/auth.middleware.js";

// Only NGO_ADMIN can access
router.get(
  "/admin/dashboard",
  authenticateToken,
  authorizeRoles("NGO_ADMIN"),
  (req, res) => {
    res.json({ message: "Admin dashboard" });
  },
);

// Multiple roles allowed
router.get(
  "/reports",
  authenticateToken,
  authorizeRoles("USER", "NGO_ADMIN"),
  (req, res) => {
    res.json({ reports: [] });
  },
);
```

## 🧪 Testing

### Manual Testing with Test Users

After running `createTestUser.js`:

**Regular User:**

- Email: `test@donorlens.com`
- Password: `Password123!`
- Role: `USER`

**Admin User:**

- Email: `admin@donorlens.com`
- Password: `Admin123!`
- Role: `NGO_ADMIN`

### Creating Additional Users

Use MongoDB Compass or the provided script to create users with hashed passwords.

**Important:** Passwords must be hashed with bcrypt before insertion:

```javascript
const bcrypt = require("bcryptjs");
const passwordHash = await bcrypt.hash("plainPassword", 10);
```

## 🐛 Common Issues & Solutions

### Issue: "Invalid email or password"

**Causes:**

- User doesn't exist in database
- Wrong password
- Email case mismatch (emails are lowercase in DB)

**Solution:** Verify user exists and password is correct

### Issue: "Access token required"

**Causes:**

- Missing `Authorization` header
- Token not prefixed with "Bearer "

**Solution:** Include header: `Authorization: Bearer <token>`

### Issue: "Invalid or expired access token"

**Causes:**

- Access token expired (15 minutes)
- Invalid token format
- Wrong JWT secret

**Solution:** Re-login or implement token refresh

### Issue: "Access forbidden: insufficient permissions"

**Causes:**

- User role doesn't match required role
- USER trying to access NGO_ADMIN route

**Solution:** Check user role or request access elevation

### Issue: "Account is deactivated"

**Causes:**

- User's `isActive` field is `false`

**Solution:** Activate account in database:

```javascript
db.users.updateOne({ email: "user@example.com" }, { $set: { isActive: true } });
```

### Issue: MongoDB connection timeout

**Causes:**

- IP not whitelisted in MongoDB Atlas
- Wrong connection string
- Network issues

**Solution:**

1. Add your IP to MongoDB Atlas whitelist (Network Access)
2. Verify `MONGO_URI` in `.env`
3. Check internet connection

## 📚 Architecture Details

### Clean Architecture Layers

```
┌─────────────────────────────────────┐
│         HTTP Request/Response        │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│          CONTROLLER LAYER            │
│   - Extract request data             │
│   - Call usecase                     │
│   - Set cookies                      │
│   - Return response                  │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│          USECASE LAYER               │
│   - Business logic                   │
│   - Validate credentials             │
│   - Compare passwords                │
│   - Generate tokens                  │
│   - Update last login                │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│          MODEL LAYER                 │
│   - Database schema                  │
│   - Password comparison method       │
│   - Data transformation              │
└─────────────────────────────────────┘
```

### Separation of Concerns

- **Controller**: HTTP layer only, no business logic
- **Usecase**: All authentication business logic
- **Model**: Database schema and data methods
- **Utils**: Reusable helper functions (JWT, cookies)
- **Middleware**: Cross-cutting concerns (auth, errors)

## 🚀 Production Deployment Checklist

Before deploying to production:

- [ ] Change JWT secrets to strong, random 32+ character strings
- [ ] Set `NODE_ENV=production` in environment
- [ ] Use HTTPS for all connections
- [ ] Configure MongoDB Atlas IP whitelist
- [ ] Set restrictive CORS origin (not `*`)
- [ ] Enable MongoDB connection pooling
- [ ] Add rate limiting middleware
- [ ] Implement token refresh endpoint
- [ ] Add request logging
- [ ] Set up error monitoring (Sentry, etc.)
- [ ] Configure reverse proxy (nginx)
- [ ] Enable MongoDB authentication
- [ ] Backup database regularly
- [ ] Implement logout endpoint (clear cookies)
- [ ] Add refresh token rotation
- [ ] Store refresh tokens in database (optional)

## 📝 Future Enhancements

Potential improvements for the authentication system:

1. **Token Refresh Endpoint** - `/api/auth/refresh` to get new access token
2. **Logout Endpoint** - Clear refresh token cookie
3. **Forgot Password** - Password reset flow with email
4. **Email Verification** - Verify email before allowing login
5. **2FA (Two-Factor Auth)** - TOTP or SMS-based
6. **Session Management** - Track active sessions per user
7. **Login History** - Log all login attempts
8. **Account Lockout** - Lock account after N failed attempts
9. **OAuth Integration** - Google, GitHub, etc.
10. **Refresh Token Rotation** - Rotate tokens on each refresh

## 📄 License

This project is part of the DonorLens NGO donation platform.

## 👥 Support

For issues or questions:

1. Check [USAGE_EXAMPLES.js](./USAGE_EXAMPLES.js) for detailed examples
2. Review error messages and common issues above
3. Ensure environment variables are correctly configured
4. Verify MongoDB connection and user data

---

**Built with ❤️ for DonorLens** - Empowering NGOs through transparent donations

# SheryStore — Authentication & Product CRUD APIs

> Sheryians Coding School Assignment | Full-Stack Application

A complete, production-quality full-stack e-commerce application featuring JWT authentication, product CRUD APIs, input validation, and a modern React frontend.

---

## Features

- **JWT Authentication** — Short-lived access tokens + long-lived refresh tokens
- **Secure Cookies** — Refresh token stored in httpOnly cookie (XSS-safe)
- **Password Hashing** — bcrypt with minimum 10 salt rounds
- **Token Rotation** — Refresh token is rotated on each refresh call
- **Product CRUD** — Create, Read, Update, Delete with proper validation
- **express-validator** — Field-level validation on all routes
- **Protected Routes** — Write routes require a valid access token
- **Axios Interceptors** — Auto-refresh on 401 with request queue
- **React Router** — Client-side routing with protected routes
- **Toast Notifications** — Success/error/warning feedback
- **Responsive UI** — Works on mobile, tablet, and desktop

---

## Tech Stack

| Layer     | Technology                                  |
|-----------|---------------------------------------------|
| Frontend  | React 18, Vite, Tailwind CSS, Axios, Lucide  |
| Backend   | Node.js, Express.js, MongoDB, Mongoose       |
| Auth      | JWT (jsonwebtoken), bcrypt                   |
| Validation| express-validator                            |
| Database  | MongoDB                                      |

---

## Folder Structure

```
shery_app/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                # MongoDB connection
│   │   ├── controllers/
│   │   │   ├── auth.controller.js   # Auth logic
│   │   │   └── product.controller.js
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js   # JWT verification
│   │   │   └── error.middleware.js  # Centralized error handler
│   │   ├── models/
│   │   │   ├── User.js              # User schema
│   │   │   └── Product.js           # Product schema
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   └── product.routes.js
│   │   ├── validators/
│   │   │   ├── auth.validator.js
│   │   │   └── product.validator.js
│   │   ├── utils/
│   │   │   └── jwt.js               # Token helpers
│   │   ├── app.js                   # Express setup
│   │   └── server.js                # Entry point
│   ├── .env
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/              # Reusable UI components
│   │   ├── context/                 # AuthContext, ToastContext
│   │   ├── layouts/                 # PublicLayout, DashboardLayout
│   │   ├── pages/                   # All page components
│   │   ├── routes/                  # ProtectedRoute
│   │   ├── services/                # api.js, authService.js, productService.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

---

## Installation

### Prerequisites

- Node.js v18+
- MongoDB (local installation or MongoDB Atlas)
- npm

---

### 1. Clone and Navigate

```bash
git clone <your-repo-url>
cd shery_app
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

**Create environment file:**

```bash
cp .env.example .env
```

Edit `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/shery_app
ACCESS_TOKEN_SECRET=your_strong_access_secret_here
REFRESH_TOKEN_SECRET=your_strong_refresh_secret_here
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

> Use strong, random values for secrets in production (e.g., `openssl rand -hex 64`)

**Start backend:**

```bash
npm run dev
```

Backend runs at: `http://localhost:5000`

---

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

### 4. MongoDB Setup

If using local MongoDB:

```bash
# Start MongoDB
mongod

# The database "shery_app" is created automatically on first request
```

For MongoDB Atlas: update `MONGO_URI` in `.env` with your connection string.

---

## Environment Variables

| Variable               | Description                              | Required |
|------------------------|------------------------------------------|----------|
| `PORT`                 | Backend server port (default: 5000)      | Yes      |
| `MONGO_URI`            | MongoDB connection string                | Yes      |
| `ACCESS_TOKEN_SECRET`  | Secret key for signing access tokens     | Yes      |
| `REFRESH_TOKEN_SECRET` | Secret key for signing refresh tokens    | Yes      |
| `CLIENT_URL`           | Frontend URL for CORS                    | Yes      |
| `NODE_ENV`             | `development` or `production`            | Yes      |

---

## API Endpoints

### Auth

| Method | Endpoint                  | Access         | Description                         |
|--------|---------------------------|----------------|-------------------------------------|
| POST   | `/api/auth/register`      | Public         | Create a new user account           |
| POST   | `/api/auth/login`         | Public         | Login and receive access token      |
| POST   | `/api/auth/refresh-token` | Cookie (RT)    | Issue a new access token            |
| POST   | `/api/auth/logout`        | Public         | Invalidate refresh token            |
| GET    | `/api/auth/me`            | Authenticated  | Get current user profile            |

### Products

| Method | Endpoint              | Access        | Description                    |
|--------|-----------------------|---------------|--------------------------------|
| GET    | `/api/products`       | Public        | List all products (+ search)   |
| GET    | `/api/products/:id`   | Public        | Get a single product           |
| POST   | `/api/products`       | Authenticated | Create a product               |
| PUT    | `/api/products/:id`   | Authenticated | Update a product               |
| DELETE | `/api/products/:id`   | Authenticated | Delete a product               |

---

## Authentication Flow

```
1. Register  → POST /api/auth/register → User created (no tokens returned)
2. Login     → POST /api/auth/login    → Access token (body) + Refresh token (httpOnly cookie)
3. Request   → Authorization: Bearer <access_token>
4. Expired?  → POST /api/auth/refresh-token → New access token
5. Logout    → POST /api/auth/logout   → Refresh token invalidated + cookie cleared
```

**Why this design?**
- Access token stored in memory (not localStorage) — XSS safe
- Refresh token in httpOnly cookie — JavaScript cannot read it
- Token rotation on each refresh — limits replay attacks
- Stored refresh token in DB — can be revoked on logout

---

## Product CRUD Flow

```
Frontend → Axios (with Bearer token) → Express Router
       → express-validator (validates input)
       → auth.middleware (verifies JWT for writes)
       → product.controller (business logic)
       → Product model (Mongoose)
       → MongoDB
       → Response → Frontend
```

---

## Validation Error Format

All validation errors return HTTP 400 with this structure:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Please enter a valid email"
    }
  ]
}
```

---

## Pages

| Page              | Route                          | Access        |
|-------------------|--------------------------------|---------------|
| Home              | `/`                            | Public        |
| Products          | `/products`                    | Public        |
| Product Detail    | `/products/:id`                | Public        |
| Login             | `/login`                       | Public        |
| Register          | `/register`                    | Public        |
| Dashboard         | `/dashboard`                   | Authenticated |
| Manage Products   | `/dashboard/products`          | Authenticated |
| Add Product       | `/dashboard/products/add`      | Authenticated |
| Edit Product      | `/dashboard/products/:id/edit` | Authenticated |
| Profile           | `/dashboard/profile`           | Authenticated |

---

## Security Notes

- Passwords hashed with bcrypt (min. 10 salt rounds) — never stored in plain text
- JWT secrets stored in `.env` — never committed to git
- Refresh tokens stored server-side for revocation
- httpOnly cookies prevent JavaScript access to refresh tokens
- Generic error messages on login (don't reveal which field is wrong)
- Stack traces not exposed in production

---

## Screenshots

_Add screenshots of your running application here._

---

## Deployment

**Backend (e.g., Railway, Render):**
1. Set all environment variables in the hosting platform
2. Set `NODE_ENV=production`
3. Use your MongoDB Atlas URI as `MONGO_URI`
4. Deploy with `npm start`

**Frontend (e.g., Vercel, Netlify):**
1. Set `VITE_API_URL` if not using a proxy
2. Build: `npm run build`
3. Deploy the `dist/` folder

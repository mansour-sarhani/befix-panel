# Quick Setup Guide: Database Authentication

## Prerequisites

- ✅ MongoDB running (local or Atlas)
- ✅ `.env.local` configured with required variables

## Required Environment Variables

Ensure these are in your `.env.local`:

```env
# MongoDB
MONGO_URI=mongodb://localhost:27017/befix-admin-panel

# JWT (REQUIRED!)
JWT_SECRET=your-super-secret-key-here
JWT_EXPIRES_IN=7d
```

### Generate JWT Secret

Run this command to generate a secure JWT secret:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copy the output and add it as `JWT_SECRET` in `.env.local`.

## Setup Steps

### 1. Create First Admin User

Run the seed script:

```bash
npm run seed:admin
```

This will create an admin user with:
- **Email:** `admin@befix.com`
- **Password:** `Admin@123`

### 2. Start Development Server

```bash
npm run dev
```

### 3. Test Login

1. Go to: http://localhost:3000/login
2. Login with the admin credentials above
3. You should be redirected to the dashboard!

## What Was Implemented

### ✅ User Model (`src/models/User.js`)
- Complete Mongoose schema with validation
- Automatic password hashing with bcrypt
- Password comparison method for login
- Last login tracking

### ✅ JWT Utilities (`src/lib/jwt.js`)
- Token generation with 7-day expiration
- Token verification and decoding
- Secure signature validation

### ✅ Real Database Login (`src/app/api/auth/login/route.js`)
- MongoDB user lookup
- Bcrypt password verification
- JWT token generation
- httpOnly cookie storage
- Last login update

### ✅ Real Auth Check (`src/app/api/auth/check/route.js`)
- JWT token verification
- Fresh user data from database
- Account status validation

### ✅ Admin Seed Script (`src/scripts/seedAdmin.js`)
- Creates first admin user
- Prevents duplicates
- Automatic password hashing

## Security Features

- 🔒 Passwords hashed with bcrypt (10 salt rounds)
- 🔒 JWT tokens signed and verified
- 🔒 httpOnly cookies (XSS protection)
- 🔒 Account status checking
- 🔒 No passwords in API responses
- 🔒 7-day token expiration

## Troubleshooting

**Problem:** "JWT_SECRET is not defined"
- **Solution:** Add `JWT_SECRET` to `.env.local` (see above for generator)

**Problem:** "Cannot connect to MongoDB"
- **Solution:** Ensure MongoDB is running and `MONGO_URI` is correct

**Problem:** "Duplicate key error" when seeding
- **Solution:** Admin already exists, you're good to go!

## Next Steps

Now that authentication is working:
1. Create other Mongoose models (Company, Transaction, etc.)
2. Implement service layer for API calls
3. Create mock data for development
4. Build feature pages (Users, Companies, etc.)

---

📖 For detailed documentation, see: [PHASE_4_STEP_2_DATABASE_AUTH.md](./PHASE_4_STEP_2_DATABASE_AUTH.md)


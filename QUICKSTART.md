# Quick Start Guide - Gift Platform

Get the Gift Platform up and running in 10 minutes!

## Prerequisites Check

Before starting, ensure you have:
- [ ] Node.js v16 or higher installed
- [ ] Git installed
- [ ] A code editor (VS Code recommended)

## Step 1: Clone & Install (2 minutes)

```bash
# Clone the repository
git clone https://github.com/anikamustudy/gift.git
cd gift

# Install all dependencies
npm run install-all
```

## Step 2: Setup MongoDB (3 minutes)

### Option A: MongoDB Atlas (Recommended - Free)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up / Log in
3. Create a new FREE cluster
4. Click "Connect" → "Connect your application"
5. Copy the connection string

### Option B: Local MongoDB

```bash
# Install MongoDB locally (if not already installed)
# macOS: brew install mongodb-community
# Ubuntu: sudo apt install mongodb
# Windows: Download from mongodb.com

# Start MongoDB
# macOS/Linux: brew services start mongodb-community
# Windows: net start MongoDB
```

## Step 3: Setup Environment Variables (3 minutes)

### Backend Configuration

```bash
# Copy example file
cp backend/.env.example backend/.env

# Edit backend/.env
# Minimum required for testing:
NODE_ENV=development
PORT=5000
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=any-random-string-min-32-chars

# Optional (for full functionality):
# EMAIL_HOST=smtp.gmail.com
# EMAIL_USER=your-email@gmail.com
# EMAIL_PASSWORD=your-app-password
# STRIPE_SECRET_KEY=sk_test_your_key
# CLOUDINARY_CLOUD_NAME=your-cloud-name
```

### Frontend Configuration

```bash
# Copy example file
cp frontend/.env.example frontend/.env

# Edit frontend/.env (usually works as-is for local dev)
VITE_API_URL=http://localhost:5000/api
```

## Step 4: Seed Database (1 minute)

```bash
cd backend
npm run seed
cd ..
```

This creates 3 sample gift packages you can browse!

## Step 5: Start Development (1 minute)

```bash
# Start both backend and frontend together
npm run dev
```

Or start them separately:

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## Step 6: Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

## Quick Test Flow

### 1. Register a New User
1. Go to http://localhost:5173
2. Click "Sign Up"
3. Fill in the registration form
4. Check console for OTP (if email not configured)
5. Enter OTP to verify

### 2. Browse Gifts
1. Click "Browse Gifts"
2. See the 3 seeded gift packages
3. Use filters to test functionality

### 3. View Gift Details
1. Click on any gift package
2. Customize items (if available)
3. See dynamic price changes

### 4. Place an Order (with Stripe test mode)
1. Click "Order Now"
2. Fill recipient information
3. Choose gift type (Anonymous/Public/Reveal Later)
4. Use Stripe test card: `4242 4242 4242 4242`
5. Use any future expiry date and CVC

## Troubleshooting

### Port Already in Use
```bash
# Find and kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Or change port in backend/.env
PORT=5001
```

### MongoDB Connection Error
- Check MONGODB_URI is correct
- Ensure MongoDB is running (if local)
- Check IP whitelist (if Atlas)

### Module Not Found
```bash
# Reinstall dependencies
cd backend && rm -rf node_modules && npm install
cd ../frontend && rm -rf node_modules && npm install
```

### Cannot Send Emails
- OTPs will appear in backend console logs if email not configured
- For testing, you can skip email setup initially

## Next Steps

### For Development
- Read [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines
- Check [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for API reference
- Review code structure in project files

### For Testing
- Create test accounts
- Try all gift types
- Test payment flow with Stripe test cards
- Explore the public feed

### For Deployment
- Follow [DEPLOYMENT.md](DEPLOYMENT.md) for production setup
- Setup third-party services:
  - MongoDB Atlas
  - Cloudinary (for images)
  - Stripe (for payments)
  - Email service (for OTP)

## Common Commands

```bash
# Root directory
npm run dev              # Start both backend and frontend
npm run install-all      # Install all dependencies

# Backend
cd backend
npm run dev              # Start with nodemon (auto-reload)
npm start                # Start production server
npm run seed             # Seed database with sample data

# Frontend
cd frontend
npm run dev              # Start development server
npm run build            # Build for production
npm run preview          # Preview production build
```

## Default Seeded Gift Packages

After running `npm run seed`, you'll have:

1. **Birthday Celebration Package** - $49.99
   - Birthday Cake (customizable)
   - Balloons
   - Birthday Card
   - Party Hat

2. **Anniversary Romance Package** - $89.99
   - Red Roses Bouquet (customizable)
   - Chocolate Box
   - Champagne
   - Greeting Card

3. **Thank You Appreciation Package** - $34.99
   - Flower Arrangement (customizable)
   - Gourmet Cookies
   - Thank You Card
   - Gift Wrap

## Stripe Test Cards

For testing payment:
- **Success**: 4242 4242 4242 4242
- **Decline**: 4000 0000 0000 0002
- **Requires Auth**: 4000 0025 0000 3155

Use any future date for expiry and any 3-digit CVC.

## Support

Need help? Check:
- [README.md](README.md) - Full documentation
- [API_DOCUMENTATION.md](API_DOCUMENTATION.md) - API reference
- [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment guide
- GitHub Issues - Report bugs or ask questions

## Success Checklist

- [ ] Repository cloned
- [ ] Dependencies installed
- [ ] MongoDB connected
- [ ] Environment variables configured
- [ ] Database seeded
- [ ] Both servers running
- [ ] Can access frontend at localhost:5173
- [ ] Can register a new user
- [ ] Can browse gift packages
- [ ] Ready to develop! 🎉

---

**Estimated Setup Time**: 10 minutes  
**Difficulty**: Beginner-friendly  
**Next**: Start exploring the codebase or begin development!

Happy coding! 🎁

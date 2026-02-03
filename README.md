# Gift Platform - Membership-Based Gifting Platform

A production-ready MERN stack application for sending gifts worldwide to Nepal. Users can send gifts anonymously or publicly, receive gifts, post reactions, and contribute to community impact programs.

## 🎁 Features

### Phase 1 Scope
- **Location**: Launch within Kathmandu Valley
- **Delivery**: Limited daily deliveries (configurable)
- **Packages**: 3 preset gift packages with customization options
- **Feed**: Public feed v1 (moderated)
- **Impact**: Love Impact Rewards program

### Key Features

#### Authentication & User Profiles
- User signup/login with JWT authentication
- Email verification via OTP
- Profile customization with privacy options
- Member dashboard with statistics

#### Gift Catalog
- Browse predefined gift packages
- Photo galleries for each package
- Itemized product descriptions
- Customizable items with dynamic pricing
- Category-based filtering
- Price range filtering
- Search functionality

#### Gift Transaction Flow
- **Anonymous Gifts**: Send gifts without revealing identity
- **Reveal Later**: Schedule reveal date for surprise
- **Public Gifts**: Show sender information
- Secure payment processing via Stripe
- Order tracking
- Love Impact contribution (2% to community programs)

#### Community Features
- Public feed showing gift exchanges
- Post reactions from recipients
- Like and comment functionality
- Moderated content

## 🚀 Tech Stack

### Frontend
- **React** 18.2.0 - UI framework
- **Tailwind CSS** 3.3.3 - Styling
- **Framer Motion** 10.16.0 - Animations
- **React Router** 6.15.0 - Navigation
- **Axios** - API communication
- **Stripe.js** - Payment processing
- **Vite** - Build tool

### Backend
- **Node.js** - Runtime environment
- **Express** 4.18.2 - Web framework
- **MongoDB** with Mongoose 7.5.0 - Database
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Nodemailer** - Email sending (OTP)
- **Stripe** - Payment processing
- **Cloudinary** - Media storage
- **Helmet** - Security headers
- **Express Rate Limit** - Rate limiting

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account
- Cloudinary account
- Stripe account
- Email service (Gmail recommended)

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/anikamustudy/gift.git
cd gift
```

2. **Install root dependencies**
```bash
npm install
```

3. **Install backend dependencies**
```bash
cd backend
npm install
```

4. **Install frontend dependencies**
```bash
cd ../frontend
npm install
```

5. **Configure Backend Environment**

Create `/backend/.env` file:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/gift-platform

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Delivery Configuration
MAX_DAILY_DELIVERIES=50
DELIVERY_ZONE=kathmandu-valley
```

6. **Configure Frontend Environment**

Create `/frontend/.env` file:
```env
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

## 🏃 Running the Application

### Development Mode

**Option 1: Run both frontend and backend together**
```bash
npm run dev
```

**Option 2: Run separately**

Backend:
```bash
cd backend
npm run dev
```

Frontend:
```bash
cd frontend
npm run dev
```

### Production Mode

Backend:
```bash
cd backend
npm start
```

Frontend:
```bash
cd frontend
npm run build
npm run preview
```

## 📁 Project Structure

```
gift/
├── backend/
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   │   ├── database.js
│   │   │   ├── cloudinary.js
│   │   │   └── stripe.js
│   │   ├── controllers/    # Route controllers
│   │   │   ├── authController.js
│   │   │   ├── userController.js
│   │   │   ├── giftController.js
│   │   │   ├── orderController.js
│   │   │   └── feedController.js
│   │   ├── models/         # Database models
│   │   │   ├── User.js
│   │   │   ├── GiftPackage.js
│   │   │   ├── Order.js
│   │   │   └── FeedPost.js
│   │   ├── routes/         # API routes
│   │   │   ├── authRoutes.js
│   │   │   ├── userRoutes.js
│   │   │   ├── giftRoutes.js
│   │   │   ├── orderRoutes.js
│   │   │   └── feedRoutes.js
│   │   ├── middleware/     # Custom middleware
│   │   │   ├── auth.js
│   │   │   └── errorHandler.js
│   │   ├── utils/          # Utility functions
│   │   │   ├── jwt.js
│   │   │   ├── email.js
│   │   │   └── otp.js
│   │   └── server.js       # Entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   │   ├── Navbar.jsx
│   │   │   ├── GiftCard.jsx
│   │   │   └── PrivateRoute.jsx
│   │   ├── pages/          # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── GiftCatalog.jsx
│   │   │   ├── GiftDetail.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── OrderHistory.jsx
│   │   │   ├── Feed.jsx
│   │   │   └── Profile.jsx
│   │   ├── services/       # API services
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   └── index.js
│   │   ├── context/        # React context
│   │   │   └── AuthContext.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── public/
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
└── package.json
```

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/verify-otp` - Verify email with OTP
- `POST /api/auth/resend-otp` - Resend OTP
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Users
- `GET /api/users/profile` - Get user profile (protected)
- `PUT /api/users/profile` - Update profile (protected)
- `POST /api/users/profile-image` - Upload profile image (protected)
- `GET /api/users/dashboard` - Get dashboard data (protected)

### Gifts
- `GET /api/gifts` - Get all gift packages
- `GET /api/gifts/:id` - Get single gift package
- `POST /api/gifts` - Create gift package (protected)
- `PUT /api/gifts/:id` - Update gift package (protected)
- `DELETE /api/gifts/:id` - Delete gift package (protected)
- `POST /api/gifts/:id/images` - Upload gift images (protected)

### Orders
- `POST /api/orders` - Create order (protected)
- `POST /api/orders/:id/payment` - Create payment intent (protected)
- `POST /api/orders/:id/confirm-payment` - Confirm payment (protected)
- `GET /api/orders` - Get user orders (protected)
- `GET /api/orders/:id` - Get single order (protected)
- `POST /api/orders/:id/reaction` - Add reaction to gift

### Feed
- `GET /api/feed` - Get public feed
- `POST /api/feed/:id/like` - Like post (protected)
- `POST /api/feed/:id/comment` - Comment on post (protected)

## 🎨 Design Features

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Smooth Animations**: Framer Motion for engaging user experience
- **Modern UI**: Clean and intuitive interface
- **Accessibility**: Semantic HTML and ARIA labels

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Email verification via OTP
- Rate limiting on API endpoints
- Helmet for security headers
- Input validation
- CORS configuration
- Protected routes

## 💳 Payment Integration

- Stripe payment processing
- Secure payment intents
- Order confirmation workflow
- Love Impact contribution (2% of each purchase)

## 📸 Media Management

- Cloudinary integration for image uploads
- Optimized image delivery
- Support for multiple images per gift package
- Profile image uploads

## 🌟 Love Impact Rewards

- Users earn points with each gift sent
- Points contribute to community programs
- Transparent tracking of contributions
- 2% of each purchase goes to community impact

## 📧 Email Features

- OTP-based email verification
- Password reset emails (template ready)
- Order confirmation emails (template ready)
- Gift delivery notifications (template ready)

## 🚦 Daily Delivery Limits

- Configurable maximum daily deliveries
- Phase 1 limited to Kathmandu Valley
- Order validation against daily limits
- Queue management for high-demand periods

## 🔄 Future Enhancements (Post-Phase 1)

- Random gift exchanges
- Membership tiers (Premium, Gold)
- Multiple delivery zones
- Mobile app
- Advanced analytics dashboard
- Gift recommendations
- Social sharing features
- Bulk gift orders
- Corporate gifting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👥 Support

For support, email support@giftplatform.com or open an issue in the repository.

## 🙏 Acknowledgments

- MongoDB Atlas for database hosting
- Cloudinary for media storage
- Stripe for payment processing
- All contributors and testers

---

Made with ❤️ for spreading love across borders

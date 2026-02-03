# API Documentation - Gift Platform

Base URL: `http://localhost:5000/api` (Development)

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Response Format

### Success Response
```json
{
  "message": "Success message",
  "data": { ... }
}
```

### Error Response
```json
{
  "message": "Error message",
  "stack": "Error stack trace (development only)"
}
```

---

## Auth Endpoints

### Register User
**POST** `/auth/register`

Creates a new user account and sends OTP for verification.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+977-9841234567",
  "address": {
    "street": "Thamel",
    "city": "Kathmandu",
    "zipCode": "44600"
  }
}
```

**Response:** `201 Created`
```json
{
  "message": "User registered successfully. Please verify your email with the OTP sent.",
  "userId": "64a1b2c3d4e5f6g7h8i9j0k1"
}
```

---

### Verify OTP
**POST** `/auth/verify-otp`

Verifies email with the OTP sent during registration.

**Request Body:**
```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```

**Response:** `200 OK`
```json
{
  "message": "Email verified successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64a1b2c3d4e5f6g7h8i9j0k1",
    "name": "John Doe",
    "email": "john@example.com",
    "isVerified": true
  }
}
```

---

### Resend OTP
**POST** `/auth/resend-otp`

Resends OTP to user's email.

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Response:** `200 OK`
```json
{
  "message": "OTP sent successfully"
}
```

---

### Login
**POST** `/auth/login`

Authenticates user and returns JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** `200 OK`
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64a1b2c3d4e5f6g7h8i9j0k1",
    "name": "John Doe",
    "email": "john@example.com",
    "membershipStatus": "free",
    "profileImage": "",
    "loveImpactPoints": 0
  }
}
```

---

### Get Current User
**GET** `/auth/me` 🔒

Returns current authenticated user's information.

**Response:** `200 OK`
```json
{
  "user": {
    "id": "64a1b2c3d4e5f6g7h8i9j0k1",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+977-9841234567",
    "address": { ... },
    "membershipStatus": "free",
    "loveImpactPoints": 0
  }
}
```

---

## User Endpoints

### Get Profile
**GET** `/users/profile` 🔒

Returns user's profile information.

**Response:** `200 OK`
```json
{
  "user": {
    "id": "64a1b2c3d4e5f6g7h8i9j0k1",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+977-9841234567",
    "address": { ... },
    "profileImage": "https://cloudinary.com/...",
    "membershipStatus": "free",
    "privacySettings": { ... },
    "loveImpactPoints": 0
  }
}
```

---

### Update Profile
**PUT** `/users/profile` 🔒

Updates user's profile information.

**Request Body:**
```json
{
  "name": "John Updated",
  "phone": "+977-9841234567",
  "address": {
    "street": "New Street",
    "city": "Kathmandu",
    "zipCode": "44600"
  },
  "privacySettings": {
    "showProfile": true,
    "showGiftsReceived": false,
    "allowAnonymousGifts": true
  }
}
```

**Response:** `200 OK`
```json
{
  "message": "Profile updated successfully",
  "user": { ... }
}
```

---

### Upload Profile Image
**POST** `/users/profile-image` 🔒

Uploads profile image to Cloudinary.

**Request:** `multipart/form-data`
- Field: `image` (file)

**Response:** `200 OK`
```json
{
  "message": "Profile image updated",
  "imageUrl": "https://res.cloudinary.com/..."
}
```

---

### Get Dashboard
**GET** `/users/dashboard` 🔒

Returns dashboard statistics.

**Response:** `200 OK`
```json
{
  "user": {
    "name": "John Doe",
    "email": "john@example.com",
    "membershipStatus": "free",
    "loveImpactPoints": 50,
    "profileImage": ""
  },
  "stats": {
    "sentGifts": 5,
    "receivedGifts": 3,
    "loveImpactPoints": 50
  }
}
```

---

## Gift Endpoints

### Get All Gifts
**GET** `/gifts`

Returns list of available gift packages with optional filtering.

**Query Parameters:**
- `category` (optional): Filter by category (birthday, anniversary, etc.)
- `minPrice` (optional): Minimum price filter
- `maxPrice` (optional): Maximum price filter
- `search` (optional): Search in name, description, tags

**Example:** `/gifts?category=birthday&minPrice=30&maxPrice=100&search=cake`

**Response:** `200 OK`
```json
{
  "giftPackages": [
    {
      "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
      "name": "Birthday Celebration Package",
      "description": "Perfect for birthday celebrations...",
      "category": "birthday",
      "basePrice": 49.99,
      "images": [
        {
          "url": "https://cloudinary.com/...",
          "publicId": "sample-1"
        }
      ],
      "items": [ ... ],
      "availability": true,
      "tags": ["birthday", "celebration", "cake"]
    }
  ],
  "count": 1
}
```

---

### Get Single Gift
**GET** `/gifts/:id`

Returns detailed information about a specific gift package.

**Response:** `200 OK`
```json
{
  "giftPackage": {
    "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
    "name": "Birthday Celebration Package",
    "description": "Perfect for birthday celebrations...",
    "category": "birthday",
    "basePrice": 49.99,
    "images": [ ... ],
    "items": [
      {
        "name": "Birthday Cake",
        "description": "Delicious chocolate cake (1 kg)",
        "isCustomizable": true,
        "options": [
          { "name": "Chocolate", "priceAdjustment": 0 },
          { "name": "Vanilla", "priceAdjustment": 0 },
          { "name": "Red Velvet", "priceAdjustment": 5 }
        ]
      }
    ],
    "availability": true,
    "stock": 50,
    "tags": ["birthday", "celebration"]
  }
}
```

---

### Create Gift Package
**POST** `/gifts` 🔒

Creates a new gift package (Admin functionality).

**Request Body:**
```json
{
  "name": "Custom Package",
  "description": "A custom gift package",
  "category": "custom",
  "basePrice": 75.00,
  "items": [
    {
      "name": "Item 1",
      "description": "Description",
      "isCustomizable": true,
      "options": [
        { "name": "Option A", "priceAdjustment": 0 },
        { "name": "Option B", "priceAdjustment": 10 }
      ]
    }
  ],
  "tags": ["custom", "special"],
  "stock": 100
}
```

**Response:** `201 Created`
```json
{
  "message": "Gift package created",
  "giftPackage": { ... }
}
```

---

## Order Endpoints

### Create Order
**POST** `/orders` 🔒

Creates a new gift order.

**Request Body:**
```json
{
  "recipient": {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "phone": "+977-9841234567",
    "address": {
      "street": "Patan",
      "city": "Lalitpur",
      "zipCode": "44700",
      "country": "Nepal"
    }
  },
  "giftPackageId": "64a1b2c3d4e5f6g7h8i9j0k1",
  "customizations": [
    {
      "itemName": "Birthday Cake",
      "selectedOption": "Red Velvet",
      "priceAdjustment": 5
    }
  ],
  "giftType": "anonymous",
  "message": "Happy Birthday!",
  "scheduledDeliveryDate": "2024-12-25"
}
```

**Response:** `201 Created`
```json
{
  "message": "Order created successfully",
  "order": {
    "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
    "orderNumber": "GFT170000000011",
    "totalAmount": 54.99,
    "loveImpactContribution": 1.10,
    "paymentStatus": "pending",
    "deliveryStatus": "pending"
  },
  "clientSecret": null
}
```

---

### Create Payment Intent
**POST** `/orders/:id/payment` 🔒

Creates a Stripe payment intent for the order.

**Response:** `200 OK`
```json
{
  "clientSecret": "pi_xxx_secret_xxx"
}
```

---

### Confirm Payment
**POST** `/orders/:id/confirm-payment` 🔒

Confirms payment after successful Stripe payment.

**Response:** `200 OK`
```json
{
  "message": "Payment confirmed",
  "order": {
    "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
    "paymentStatus": "completed",
    "deliveryStatus": "processing"
  }
}
```

---

### Get User Orders
**GET** `/orders` 🔒

Returns all orders placed by the authenticated user.

**Response:** `200 OK`
```json
{
  "orders": [
    {
      "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
      "orderNumber": "GFT170000000011",
      "giftPackage": {
        "name": "Birthday Package",
        "images": [ ... ],
        "basePrice": 49.99
      },
      "totalAmount": 54.99,
      "recipient": { ... },
      "deliveryStatus": "delivered",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

---

### Get Single Order
**GET** `/orders/:id` 🔒

Returns detailed information about a specific order.

**Response:** `200 OK`
```json
{
  "order": {
    "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
    "orderNumber": "GFT170000000011",
    "sender": { ... },
    "recipient": { ... },
    "giftPackage": { ... },
    "customizations": [ ... ],
    "giftType": "anonymous",
    "message": "Happy Birthday!",
    "totalAmount": 54.99,
    "paymentStatus": "completed",
    "deliveryStatus": "delivered"
  }
}
```

---

### Add Reaction
**POST** `/orders/:id/reaction`

Allows recipient to add a reaction to received gift.

**Request Body:**
```json
{
  "type": "love",
  "message": "Thank you so much! This made my day!",
  "verificationCode": "optional-code"
}
```

**Response:** `200 OK`
```json
{
  "message": "Reaction added successfully",
  "order": { ... }
}
```

---

## Feed Endpoints

### Get Public Feed
**GET** `/feed`

Returns approved feed posts.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)

**Response:** `200 OK`
```json
{
  "feedPosts": [
    {
      "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
      "sender": {
        "name": "John Doe",
        "profileImage": "..."
      },
      "recipient": {
        "name": "Jane Doe"
      },
      "giftPackage": {
        "name": "Birthday Package",
        "images": [ ... ]
      },
      "message": "Happy Birthday!",
      "reaction": {
        "type": "love",
        "message": "Thank you!"
      },
      "isAnonymous": false,
      "likes": 15,
      "comments": [ ... ],
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "totalPages": 5,
  "currentPage": 1
}
```

---

### Like Post
**POST** `/feed/:id/like` 🔒

Likes a feed post.

**Response:** `200 OK`
```json
{
  "message": "Post liked",
  "likes": 16
}
```

---

### Comment on Post
**POST** `/feed/:id/comment` 🔒

Adds a comment to a feed post.

**Request Body:**
```json
{
  "text": "Beautiful gift!"
}
```

**Response:** `200 OK`
```json
{
  "message": "Comment added",
  "feedPost": { ... }
}
```

---

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 429 | Too Many Requests |
| 500 | Internal Server Error |

---

## Rate Limiting

API endpoints are rate-limited to:
- **100 requests per 15 minutes** per IP address

Exceeding this limit will result in a `429 Too Many Requests` response.

---

## Notes

🔒 = Protected endpoint (requires authentication)

- All dates are in ISO 8601 format
- Prices are in USD
- File uploads limited to 5MB per file
- Maximum 5 images per gift package

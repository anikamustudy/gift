# Deployment Guide - Gift Platform

This guide covers deploying the Gift Platform to production environments.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Backend Deployment](#backend-deployment)
3. [Frontend Deployment](#frontend-deployment)
4. [Database Setup](#database-setup)
5. [Third-Party Services](#third-party-services)
6. [Post-Deployment](#post-deployment)

## Prerequisites

- Node.js 16+ installed
- MongoDB Atlas account
- Cloudinary account
- Stripe account
- Domain name (optional)
- Hosting service accounts (Heroku, Vercel, Railway, etc.)

## Database Setup

### MongoDB Atlas

1. **Create a Cluster**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a new cluster (Free tier available)
   - Choose a region close to your users

2. **Configure Network Access**
   - Add IP whitelist: `0.0.0.0/0` (or specific IPs)
   - Create database user with read/write permissions

3. **Get Connection String**
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database password

## Third-Party Services

### Cloudinary Setup

1. Sign up at [Cloudinary](https://cloudinary.com)
2. Get your credentials:
   - Cloud Name
   - API Key
   - API Secret
3. Create folder structure: `gift-platform/profiles` and `gift-platform/gifts`

### Stripe Setup

1. Sign up at [Stripe](https://stripe.com)
2. Get your API keys:
   - Publishable Key (pk_test_...)
   - Secret Key (sk_test_...)
3. For production, use live keys (pk_live_..., sk_live_...)

### Email Service (Gmail)

1. Enable 2FA on your Gmail account
2. Generate an App Password:
   - Google Account → Security → App Passwords
   - Select "Mail" and "Other"
   - Copy the generated password

## Backend Deployment

### Option 1: Heroku

1. **Install Heroku CLI**
```bash
npm install -g heroku
heroku login
```

2. **Create Heroku App**
```bash
cd backend
heroku create gift-platform-api
```

3. **Set Environment Variables**
```bash
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI="your-mongodb-uri"
heroku config:set JWT_SECRET="your-jwt-secret"
heroku config:set EMAIL_HOST="smtp.gmail.com"
heroku config:set EMAIL_USER="your-email@gmail.com"
heroku config:set EMAIL_PASSWORD="your-app-password"
heroku config:set STRIPE_SECRET_KEY="your-stripe-secret"
heroku config:set CLOUDINARY_CLOUD_NAME="your-cloud-name"
heroku config:set CLOUDINARY_API_KEY="your-api-key"
heroku config:set CLOUDINARY_API_SECRET="your-api-secret"
heroku config:set FRONTEND_URL="https://your-frontend-url.com"
heroku config:set MAX_DAILY_DELIVERIES=50
```

4. **Deploy**
```bash
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

### Option 2: Railway

1. **Install Railway CLI**
```bash
npm install -g @railway/cli
railway login
```

2. **Create New Project**
```bash
cd backend
railway init
```

3. **Set Environment Variables**
   - Go to Railway dashboard
   - Add all environment variables from `.env.example`

4. **Deploy**
```bash
railway up
```

### Option 3: DigitalOcean/VPS

1. **SSH into Server**
```bash
ssh root@your-server-ip
```

2. **Install Dependencies**
```bash
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install -g pm2
```

3. **Clone Repository**
```bash
git clone https://github.com/your-username/gift.git
cd gift/backend
npm install
```

4. **Setup Environment**
```bash
cp .env.example .env
nano .env  # Edit with your values
```

5. **Start with PM2**
```bash
pm2 start src/server.js --name gift-api
pm2 startup
pm2 save
```

6. **Setup Nginx (Optional)**
```bash
sudo apt install nginx
sudo nano /etc/nginx/sites-available/gift-api
```

Add configuration:
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/gift-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Frontend Deployment

### Option 1: Vercel

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Deploy**
```bash
cd frontend
vercel
```

3. **Set Environment Variables**
   - Go to Vercel dashboard
   - Settings → Environment Variables
   - Add:
     - `VITE_API_URL`: Your backend URL
     - `VITE_STRIPE_PUBLISHABLE_KEY`: Your Stripe key

4. **Deploy to Production**
```bash
vercel --prod
```

### Option 2: Netlify

1. **Install Netlify CLI**
```bash
npm install -g netlify-cli
```

2. **Build Project**
```bash
cd frontend
npm run build
```

3. **Deploy**
```bash
netlify deploy --prod --dir=dist
```

4. **Set Environment Variables**
   - Netlify dashboard → Site settings → Build & deploy
   - Add environment variables

### Option 3: AWS S3 + CloudFront

1. **Build Project**
```bash
cd frontend
npm run build
```

2. **Create S3 Bucket**
   - Enable static website hosting
   - Upload `dist` folder contents

3. **Setup CloudFront**
   - Create CloudFront distribution
   - Point to S3 bucket
   - Configure custom domain (optional)

## Post-Deployment

### 1. Seed Initial Data

```bash
# On your server or locally with production DB
cd backend
node seed.js
```

### 2. Test the Application

- Test user registration and OTP verification
- Test gift browsing and filtering
- Test complete checkout flow
- Test payment processing
- Test order tracking

### 3. Setup Monitoring

**Backend Monitoring:**
- Use PM2 monitoring: `pm2 monit`
- Setup error tracking (Sentry, LogRocket)
- Configure uptime monitoring (UptimeRobot)

**Frontend Monitoring:**
- Google Analytics
- Sentry for error tracking
- Performance monitoring

### 4. Security Checklist

- ✓ All environment variables set
- ✓ HTTPS enabled
- ✓ Rate limiting configured
- ✓ CORS properly configured
- ✓ Database secured with strong password
- ✓ API keys not exposed in frontend
- ✓ Security headers enabled (Helmet)

### 5. Backup Strategy

**Database Backups:**
```bash
# Create backup
mongodump --uri="your-mongodb-uri" --out=backup-$(date +%Y%m%d)

# Restore backup
mongorestore --uri="your-mongodb-uri" backup-folder/
```

**Automated Backups:**
- MongoDB Atlas: Enable automated backups
- Use cron jobs for regular backups
- Store backups in S3 or similar service

### 6. Domain Configuration

**Backend Domain:**
1. Point A record to server IP
2. Configure SSL certificate (Let's Encrypt)
3. Update CORS settings

**Frontend Domain:**
1. Configure DNS settings
2. Enable HTTPS
3. Update API URL in environment variables

### 7. Performance Optimization

**Backend:**
- Enable gzip compression
- Implement Redis caching (future)
- Optimize database queries
- Use CDN for static assets

**Frontend:**
- Enable code splitting
- Optimize images
- Use lazy loading
- Implement service workers (PWA)

## Troubleshooting

### Common Issues

**Connection Refused:**
- Check firewall rules
- Verify PORT is correct
- Check server is running

**CORS Errors:**
- Verify FRONTEND_URL in backend .env
- Check CORS configuration in server.js

**Payment Failures:**
- Verify Stripe keys are correct
- Check webhook configuration
- Review Stripe dashboard for errors

**Email Not Sending:**
- Verify Gmail app password
- Check email configuration
- Review nodemailer logs

## Maintenance

### Regular Tasks

**Daily:**
- Monitor error logs
- Check payment processing
- Review order fulfillment

**Weekly:**
- Review performance metrics
- Check disk space
- Update dependencies

**Monthly:**
- Database cleanup
- Security updates
- Backup verification
- Performance optimization

## Support

For deployment issues:
- Check server logs: `pm2 logs gift-api`
- Review error messages
- Check third-party service status
- Contact support if needed

---

**Production Checklist:**
- [ ] Database configured and seeded
- [ ] Backend deployed and running
- [ ] Frontend deployed and accessible
- [ ] Environment variables set
- [ ] SSL certificates installed
- [ ] Third-party services configured
- [ ] Monitoring setup
- [ ] Backups configured
- [ ] Domain configured
- [ ] Security hardened
- [ ] Performance optimized
- [ ] Documentation updated

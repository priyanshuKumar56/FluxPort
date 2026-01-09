# FluxPort Backend - Render Deployment Guide

## Setup Instructions

### 1. Neon PostgreSQL Setup
1. Create a Neon account at [neon.tech](https://neon.tech)
2. Create a new database project
3. Copy the connection string from the Neon dashboard
4. Update your environment variables with the Neon connection details

### 2. Environment Variables
Copy `.env.example` to `.env` and update with your Neon PostgreSQL credentials:

```bash
DATABASE_URL=postgresql://username:password@ep-xxx-xxx.us-east-1.aws.neon.tech/dbname?sslmode=require
```

### 3. Render Deployment
1. Connect your GitHub repository to Render
2. Render will automatically detect the `render.yaml` configuration
3. The database will be created and connected automatically

### 4. Production Environment Variables
Render will automatically set:
- `DATABASE_URL` from the connected Neon database
- `NODE_ENV=production`
- `JWT_SECRET` (auto-generated)

You need to set:
- `FRONTEND_URL` to your frontend's Render URL

## Dependencies Added
- `helmet` - Security middleware
- `compression` - Response compression for performance

## Features
- SSL-enabled database connections for production
- Security headers via Helmet
- Response compression for better performance
- CORS configuration for frontend integration

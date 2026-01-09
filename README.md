# FluxPort 2.0 - API Gateway

A professional API Gateway application with Express backend and Next.js frontend.

## Architecture

- **Frontend**: Next.js 16 with React 19, Redux Toolkit for state management
- **Backend**: Express.js with PostgreSQL database
- **Authentication**: JWT-based authentication

## Setup

### Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the server directory:
```env
PORT=3001
FRONTEND_URL=http://localhost:3000
JWT_SECRET=your-secret-key-change-this
DB_HOST=localhost
DB_PORT=5432
DB_NAME=fluxport
DB_USER=postgres
DB_PASSWORD=your-password
```

4. Start the backend server:
```bash
npm run dev
```

### Frontend Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

3. Start the development server:
```bash
npm run dev
```

## Database Schema

The application uses the following PostgreSQL tables:
- `User` - User accounts
- `Collection` - Request collections
- `Folder` - Folders within collections
- `SavedRequest` - Saved API requests
- `ApiLog` - API request logs
- `InterceptorRule` - Request interception rules

## Features

- User authentication (register/login)
- API request builder and testing
- Request history and collections
- Interceptor rules management
- Real-time API logs
- Dashboard with analytics

## Development

- Backend runs on `http://localhost:3001`
- Frontend runs on `http://localhost:3000`


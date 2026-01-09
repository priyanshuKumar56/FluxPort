# FluxPort 2.0 - System Architecture

FluxPort 2.0 is a modern API Gateway and development platform designed for high performance and extensibility.

## System Overview

The project is split into a **Next.js Frontend** and an **Express.js Backend**.

### High-Level Architecture

```
[ Client Browser ] <------> [ Next.js Frontend ] 
                                   |
                                   v
[ Target API Server ] <--- [ Smart Relay (Proxy) ] <--- [ Express Backend ]
                                   |
                                   v
                           [ PostgreSQL DB ]
```

## Key Components

### 1. The Smart Relay (Proxy Engine)
Located in `lib/proxy-engine-v2.ts`. This is the core logic that allows FluxPort to act as an interceptor. It handles:
- **CORS Bypass**: Allows clients to reach APIs that don't have CORS enabled.
- **Rule Evaluation**: Checks incoming requests against "Interceptor Rules" (Redirects, Mocking, Headers).
- **Latency Simulation**: Can artificially slow down responses for testing.
- **Header Sanitization**: Removes conflicting headers like `accept-encoding` to ensure consistent data delivery.

### 2. API Client Dashboard
Located in `app/dashboard/client`. A Postman-like interface that supports:
- **Variable Injection**: `{{variable}}` syntax for environment-based testing.
- **Tabbed Browsing**: Work on multiple requests simultaneously.
- **Live Preview**: Render HTML responses directly in the dashboard.
- **Interception Visualizers**: Clearly shows when a rule has modified a request.

### 3. Gateway Analytics
A real-time monitoring system that logs all requests passing through the gateway, providing insights into:
- Performance (latency metrics).
- Reliability (status code distribution).
- Throughput.

## Data Model

We use **PostgreSQL** as the primary datastore:
- **Users**: Authentication and profile management.
- **Collections/Folders**: Organization of saved requests.
- **InterceptorRules**: User-defined logic for the Smart Relay.
- **ApiLogs**: Historical data for analytics.

## Technology Stack

- **Frontend**: React 19, Next.js 16, Tailwind CSS, Redux Toolkit, Lucide Icons.
- **Backend**: Express.js, TypeScript.
- **Database**: PostgreSQL (Prisma or raw queries depending on the implementation).
- **Interception**: Custom "Smart Relay" implementation using Fetch API.

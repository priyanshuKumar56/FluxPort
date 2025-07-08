# 🚀 Smart Fluxport Dashboard

A comprehensive Fluxport Dashboard that combines the best features of Postman and Kong UI with advanced observability and token control. Built with modern web technologies for enterprise-grade API management.

## ✨ Features

### 🌐 API Manager

- **CRUD Operations**: Create, read, update, and delete API routes
- **Method Configuration**: Support for GET, POST, PUT, DELETE, PATCH methods
- **Schema Definition**: Define request/response schemas and headers
- **Route Management**: Organize and categorize API endpoints

### ⚡ Request Tester (Postman-like Interface)

- **Multi-tab Interface**: Test multiple APIs simultaneously
- **HTTP Methods**: Support for all standard HTTP methods
- **Headers Management**: Add, edit, and remove custom headers
- **Request Body**: JSON, XML, and raw text support
- **Response Preview**: Formatted JSON response with status codes
- **Request History**: Save and replay previous requests

### 🔐 Token Management

- **JWT Tokens**: Generate and manage JSON Web Tokens
- **API Keys**: Create and manage API keys with custom permissions
- **Token Expiry**: Set custom expiration dates and auto-renewal
- **Access Logs**: Track token usage and access patterns
- **Revocation**: Instantly revoke compromised tokens

### 📊 Rate Limiting Dashboard

- **Per-endpoint Limits**: Configure rate limits for specific endpoints
- **User-based Limits**: Set limits per user or API key
- **Redis Integration**: Fast, distributed rate limiting with Redis
- **Real-time Analytics**: Live charts showing request rates and 429 errors
- **Automatic Blocking**: Temporary IP blocking for limit violations

### 📚 OpenAPI Integration

- **Spec Upload**: Import OpenAPI 3.0 specifications (JSON/YAML)
- **URL Import**: Fetch specs from remote URLs
- **Auto-generation**: Generate API routes from OpenAPI specs
- **Interactive Docs**: Built-in Swagger UI for API documentation
- **Schema Validation**: Validate requests against OpenAPI schemas

### 🛡️ Security & Logging

- **IP Blocking**: Block suspicious IP addresses automatically
- **Geo-blocking**: Block requests from specific countries/regions
- **Security Rules**: Custom security policies and conditions
- **Event Logging**: Comprehensive security event tracking
- **Audit Trail**: Complete audit log of system changes

## 🛠️ Tech Stack

### Frontend

- **React 18** with TypeScript
- **Next.js 14** (App Router)
- **Tailwind CSS** for styling
- **shadcn/ui** component library
- **Zustand** for state management
- **Recharts** for data visualization

### Backend (Planned)

- **Node.js** with Express
- **TypeScript** for type safety
- **Redis** for rate limiting and caching
- **PostgreSQL** for data persistence
- **JWT** for authentication

### Infrastructure

- **NGINX** as reverse proxy and load balancer
- **Docker** for containerization
- **Vercel** for deployment

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Redis (for rate limiting)
- PostgreSQL (for data storage)

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/yourusername/api-gateway-dashboard.git
   cd api-gateway-dashboard
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up environment variables**
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`

4. **Run the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Usage

### API Management

1. Navigate to the **API Manager** tab
2. Click **"Add Route"** to create a new API endpoint
3. Configure the HTTP method, path, and description
4. Save and activate the route

### Testing APIs

1. Go to the **Request Tester** tab
2. Enter your API URL and select the HTTP method
3. Add headers and request body as needed
4. Click **"Send"** to execute the request
5. View the formatted response with status codes

### Token Management

1. Access the **Token Management** section
2. Click **"Generate Token"** to create new JWT or API key
3. Set expiration dates and permissions
4. Copy the token for use in your applications

### Rate Limiting

1. Open the **Rate Limiting Dashboard**
2. Click **"Add Limit"** to create a new rate limit rule
3. Configure the endpoint, limit, and time window
4. Monitor real-time usage and violations

## 🔧 Configuration

### Environment Variables

\`\`\`env

# Database

DATABASE_URL=postgresql://user:password@localhost:5432/apigateway

# Redis

REDIS_URL=redis://localhost:6379

# JWT

JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h

# Fluxport

GATEWAY_PORT=3001
GATEWAY_HOST=localhost

# Rate Limiting

RATE_LIMIT_WINDOW=3600
RATE_LIMIT_MAX_REQUESTS=1000
\`\`\`

### NGINX Configuration

\`\`\`nginx
upstream api_gateway {
server localhost:3001;
server localhost:3002;
}

server {
listen 80;
server_name api.yourdomain.com;

    location / {
        proxy_pass http://api_gateway;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

}
\`\`\`

## 📊 Monitoring & Analytics

The dashboard provides comprehensive monitoring capabilities:

- **Real-time Metrics**: Request rates, response times, error rates
- **Historical Data**: Trends and patterns over time
- **Security Events**: Failed authentications, blocked IPs, rate limit violations
- **Performance Insights**: Slowest endpoints, peak usage times
- **Token Analytics**: Most used tokens, expiration tracking

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: Prevent API abuse with configurable limits
- **IP Whitelisting/Blacklisting**: Control access by IP address
- **Request Validation**: Validate requests against OpenAPI schemas
- **Audit Logging**: Complete audit trail of all actions
- **CORS Configuration**: Flexible cross-origin resource sharing

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit your changes (\`git commit -m 'Add amazing feature'\`)
4. Push to the branch (\`git push origin feature/amazing-feature\`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful component library
- [Recharts](https://recharts.org/) for data visualization
- [Postman](https://www.postman.com/) for API testing inspiration
- [Kong](https://konghq.com/) for Fluxport concepts

## 📞 Support

If you have any questions or need help, please:

1. Check the [Documentation](docs/)
2. Search [Issues](https://github.com/yourusername/api-gateway-dashboard/issues)
3. Create a new issue if needed
4. Join our [Discord Community](https://discord.gg/yourdiscord)

---

**Built with ❤️ for the API community**

_Resume Entry: "Built a comprehensive Fluxport Dashboard with token authentication, rate limiting, OpenAPI integration, and full observability layer using React, Next.js, and modern web technologies."_

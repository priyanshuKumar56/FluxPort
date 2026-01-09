# FluxPort API Client Guide

FluxPort's API Client is a powerful tool for building, testing, and debugging APIs. It combines the ease of use of Postman with the interception capabilities of Requestly.

## 🚀 Getting Started

1. Navigate to the **API Client** section in your dashboard.
2. Select an HTTP Method (GET, POST, etc.) and enter your URL.
3. Click **Send**.

## 🧠 Smart Relay Features

FluxPort uses a **Smart Relay** system to handle your requests.

### Why use Smart Relay?
- **Bypass CORS**: If checked, the request goes through our backend proxy, allowing you to reach APIs that block browser requests.
- **Interception Rules**: Native support for redirecting requests, mocking data, and modifying headers.

### Local Discovery
If you enter a `localhost` or `.local` URL, FluxPort automatically switches to **Direct Mode** to ensure zero-latency communication with your local development server.

## 🛠 Advanced Tools

### 1. Variables (`{{variable}}`)
You can use variables in your URLs and headers:
- `{{baseUrl}}`: Automatically points to your configured base URL.
- `{{timestamp}}`: Injects the current Unix timestamp.
- `{{random}}`: Generates a random alphanumeric string.

### 2. View Modes
After receiving a response, you can switch between:
- **Pretty**: Formatted JSON/XML with syntax highlighting.
- **Raw**: The exact character-for-character response.
- **Preview**: Renders HTML responses inside an isolated sandbox.

### 3. Interception Badge
Keep an eye out for the **ZAP ⚡ INTERCEPTED** badge. This indicates that one of your active rules has modified the request or response.

## 🧪 Testing & Assertions
Use the **Tests** tab to define validation rules for your response. FluxPort will automatically verify things like:
- Status code is 200.
- Response time is under 500ms.
- Body contains a specific JSON property.

---

*Need more help? Join our community or check out the [GitHub Discussions](https://github.com/yourusername/FluxPort_2.0/discussions).*

"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, Play, Server, Code, CheckCircle } from "lucide-react"
import { toast } from "sonner"

export function LocalhostSetupGuide() {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("Copied to clipboard!")
  }

  const testEndpoints = [
    {
      name: "Health Check",
      method: "GET",
      url: "http://localhost:3000/api/health",
      description: "Basic server health check",
    },
    {
      name: "Users API",
      method: "GET",
      url: "http://localhost:3000/api/users",
      description: "Get all users",
    },
    {
      name: "Create User",
      method: "POST",
      url: "http://localhost:3000/api/users",
      description: "Create a new user",
      body: JSON.stringify({ name: "John Doe", email: "john@example.com" }, null, 2),
    },
  ]

  const loadRequest = (endpoint: any) => {
    window.dispatchEvent(
      new CustomEvent("load-request", {
        detail: {
          method: endpoint.method,
          url: endpoint.url,
          headers: [{ key: "Content-Type", value: "application/json" }],
          queryParams: [],
          body: endpoint.body || "",
        },
      }),
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Localhost API Setup Guide</h2>
        <p className="text-muted-foreground">Get your local server running and test APIs instantly</p>
      </div>

      <Tabs defaultValue="quick-start" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="quick-start">Quick Start</TabsTrigger>
          <TabsTrigger value="node-express">Node.js</TabsTrigger>
          <TabsTrigger value="python">Python</TabsTrigger>
          <TabsTrigger value="testing">Testing</TabsTrigger>
        </TabsList>

        <TabsContent value="quick-start" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5" />
                Quick HTTP Server
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <h4 className="font-medium">Python (Simplest)</h4>
                  <div className="bg-gray-900 text-gray-100 p-3 rounded-lg font-mono text-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-green-400"># Start HTTP server on port 8000</span>
                      <Button variant="ghost" size="sm" onClick={() => copyToClipboard("python -m http.server 8000")}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <div>python -m http.server 8000</div>
                  </div>
                  <Badge variant="secondary">Then test: http://localhost:8000</Badge>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">Node.js (With npx)</h4>
                  <div className="bg-gray-900 text-gray-100 p-3 rounded-lg font-mono text-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-green-400"># Start HTTP server on port 3000</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard("npx http-server -p 3000 --cors")}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <div>npx http-server -p 3000 --cors</div>
                  </div>
                  <Badge variant="secondary">Then test: http://localhost:3000</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="node-express" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Node.js + Express API Server
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <h4 className="font-medium">1. Create package.json</h4>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() =>
                      copyToClipboard(`{
  "name": "my-api",
  "version": "1.0.0",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5"
  }
}`)
                    }
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <pre>{`{
  "name": "my-api",
  "version": "1.0.0",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5"
  }
}`}</pre>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">2. Create server.js</h4>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() =>
                      copyToClipboard(`const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: 'Server is running!' 
  });
});

// Users API
app.get('/api/users', (req, res) => {
  res.json([
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
  ]);
});

app.post('/api/users', (req, res) => {
  const { name, email } = req.body;
  const newUser = { 
    id: Date.now(), 
    name, 
    email,
    created: new Date().toISOString()
  };
  res.status(201).json(newUser);
});

app.listen(PORT, () => {
  console.log(\`🚀 Server running at http://localhost:\${PORT}\`);
  console.log(\`📋 Health check: http://localhost:\${PORT}/api/health\`);
  console.log(\`👥 Users API: http://localhost:\${PORT}/api/users\`);
});`)
                    }
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <pre className="text-xs">{`const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: 'Server is running!' 
  });
});

// Users API
app.get('/api/users', (req, res) => {
  res.json([
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
  ]);
});

app.post('/api/users', (req, res) => {
  const { name, email } = req.body;
  const newUser = { 
    id: Date.now(), 
    name, 
    email,
    created: new Date().toISOString()
  };
  res.status(201).json(newUser);
});

app.listen(PORT, () => {
  console.log(\`🚀 Server running at http://localhost:\${PORT}\`);
  console.log(\`📋 Health check: http://localhost:\${PORT}/api/health\`);
  console.log(\`👥 Users API: http://localhost:\${PORT}/api/users\`);
});`}</pre>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">3. Run the server</h4>
                <div className="bg-gray-900 text-gray-100 p-3 rounded-lg font-mono text-sm">
                  <div className="space-y-1">
                    <div className="text-green-400"># Install dependencies</div>
                    <div>npm install</div>
                    <div className="text-green-400"># Start server</div>
                    <div>npm start</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="python" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Python Flask API Server
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <h4 className="font-medium">1. Install Flask</h4>
                <div className="bg-gray-900 text-gray-100 p-3 rounded-lg font-mono text-sm">
                  <div className="flex items-center justify-between">
                    <span>pip install flask flask-cors</span>
                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard("pip install flask flask-cors")}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">2. Create app.py</h4>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() =>
                      copyToClipboard(`from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'OK',
        'timestamp': datetime.now().isoformat(),
        'message': 'Python Flask server is running!'
    })

@app.route('/api/users', methods=['GET'])
def get_users():
    users = [
        {'id': 1, 'name': 'John Doe', 'email': 'john@example.com'},
        {'id': 2, 'name': 'Jane Smith', 'email': 'jane@example.com'}
    ]
    return jsonify(users)

@app.route('/api/users', methods=['POST'])
def create_user():
    data = request.get_json()
    new_user = {
        'id': int(datetime.now().timestamp()),
        'name': data.get('name'),
        'email': data.get('email'),
        'created': datetime.now().isoformat()
    }
    return jsonify(new_user), 201

if __name__ == '__main__':
    print('🚀 Server running at http://localhost:5000')
    print('📋 Health check: http://localhost:5000/api/health')
    print('👥 Users API: http://localhost:5000/api/users')
    app.run(debug=True, host='0.0.0.0', port=5000)`)
                    }
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <pre className="text-xs">{`from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'OK',
        'timestamp': datetime.now().isoformat(),
        'message': 'Python Flask server is running!'
    })

@app.route('/api/users', methods=['GET'])
def get_users():
    users = [
        {'id': 1, 'name': 'John Doe', 'email': 'john@example.com'},
        {'id': 2, 'name': 'Jane Smith', 'email': 'jane@example.com'}
    ]
    return jsonify(users)

@app.route('/api/users', methods=['POST'])
def create_user():
    data = request.get_json()
    new_user = {
        'id': int(datetime.now().timestamp()),
        'name': data.get('name'),
        'email': data.get('email'),
        'created': datetime.now().isoformat()
    }
    return jsonify(new_user), 201

if __name__ == '__main__':
    print('🚀 Server running at http://localhost:5000')
    print('📋 Health check: http://localhost:5000/api/health')
    print('👥 Users API: http://localhost:5000/api/users')
    app.run(debug=True, host='0.0.0.0', port=5000)`}</pre>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">3. Run the server</h4>
                <div className="bg-gray-900 text-gray-100 p-3 rounded-lg font-mono text-sm">
                  <div className="flex items-center justify-between">
                    <span>python app.py</span>
                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard("python app.py")}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="testing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Test Your Local API
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Once your server is running, test these endpoints by clicking the buttons below:
                </p>

                <div className="grid gap-3">
                  {testEndpoints.map((endpoint, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge variant={endpoint.method === "GET" ? "default" : "secondary"}>{endpoint.method}</Badge>
                        <div>
                          <div className="font-medium">{endpoint.name}</div>
                          <div className="text-sm text-muted-foreground font-mono">{endpoint.url}</div>
                          <div className="text-xs text-muted-foreground">{endpoint.description}</div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => loadRequest(endpoint)}>
                        <Play className="h-4 w-4 mr-1" />
                        Test
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">💡 Pro Tips:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Make sure your server is running before testing</li>
                    <li>• Check the console/terminal for server logs</li>
                    <li>• Common ports: 3000 (Node.js), 5000 (Python), 8000 (Python simple server)</li>
                    <li>• If port is busy, try a different port number</li>
                    <li>• CORS is enabled in the example servers above</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

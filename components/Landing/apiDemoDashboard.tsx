import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Database, 
  Terminal, 
  BarChart3, 
  Activity, 
  Send 
} from 'lucide-react';

interface ApiDemoStep {
  method: string;
  url: string;
  status: number;
  time: string;
}

const ApiGatewayDashboard = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);
  const [showApiDemo, setShowApiDemo] = useState(false);
  const [apiResponse, setApiResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const apiDemoSteps: ApiDemoStep[] = [
    { method: "GET", url: "/api/users", status: 200, time: "89ms" },
    { method: "POST", url: "/api/auth/login", status: 201, time: "156ms" },
    { method: "PUT", url: "/api/users/123", status: 200, time: "234ms" },
    { method: "DELETE", url: "/api/users/123", status: 204, time: "78ms" },
  ];

  const mockApiResponses = [
    {
      request: "GET /api/users",
      response: {
        users: [
          { id: 1, name: "John Doe", email: "john@example.com" },
          { id: 2, name: "Jane Smith", email: "jane@example.com" }
        ],
        total: 1247,
        page: 1
      },
      headers: { "Content-Type": "application/json", "X-Rate-Limit": "1000" }
    },
    {
      request: "POST /api/auth/login",
      response: {
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        user: { id: 1, name: "John Doe", role: "admin" },
        expiresIn: "24h"
      },
      headers: { "Content-Type": "application/json", "Set-Cookie": "session=abc123" }
    },
    {
      request: "PUT /api/users/123",
      response: {
        id: 123,
        name: "John Doe Updated",
        email: "john.updated@example.com",
        updatedAt: new Date().toISOString()
      },
      headers: { "Content-Type": "application/json", "Last-Modified": new Date().toUTCString() }
    },
    {
      request: "DELETE /api/users/123",
      response: {
        success: true,
        message: "User deleted successfully",
        deletedId: 123
      },
      headers: { "Content-Type": "application/json" }
    }
  ];

  const features = ["API Testing", "Collections", "Monitoring", "Security", "Analytics", "Workflows"];
  const stats = [
    { label: "Response Time", value: "89ms", color: "text-green-600" },
    { label: "Success Rate", value: "99.8%", color: "text-blue-600" },
    { label: "Requests", value: "1.2M", color: "text-orange-600" },
    { label: "Errors", value: "0.2%", color: "text-red-600" },
  ];

  // Optimized demo runner with cleanup
  const runApiDemo = useCallback(() => {
    setShowApiDemo(true);
    setApiResponse("");
    setCurrentStep(0);
    let stepIndex = 0;
    
    const stepInterval = setInterval(() => {
      if (stepIndex < apiDemoSteps.length) {
        setCurrentStep(stepIndex);
        setIsLoading(true);
        
        // Simulate API request delay
        setTimeout(() => {
          const step = apiDemoSteps[stepIndex];
          const mockData = mockApiResponses[stepIndex];
          
          // Add request info
          const requestInfo = `→ ${step.method} ${step.url}\n`;
          
          // Add response info
          const responseInfo = `← ${step.status} ${step.time}\n`;
          const responseData = JSON.stringify(mockData.response, null, 2);
          const headerInfo = `Headers: ${JSON.stringify(mockData.headers, null, 2)}\n`;
          
          setApiResponse(prev => 
            prev + requestInfo + responseInfo + responseData + "\n" + headerInfo + "\n" + "─".repeat(50) + "\n\n"
          );
          
          setIsLoading(false);
          stepIndex++;
        }, 1200);
      } else {
        clearInterval(stepInterval);
        setTimeout(() => {
          setShowApiDemo(false);
          setApiResponse("");
          setCurrentStep(0);
        }, 4000);
      }
    }, 2500);

    return () => clearInterval(stepInterval);
  }, [apiDemoSteps, mockApiResponses]);

  // Initialize component visibility
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Feature rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature(prev => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [features.length]);

  // Demo automation - starts immediately and repeats
  useEffect(() => {
    // Start first demo after component renders
    const initialTimeout = setTimeout(() => {
      runApiDemo();
    }, 2000);

    // Set up recurring demo
    const demoInterval = setInterval(() => {
      if (!showApiDemo) {
        runApiDemo();
      }
    }, 20000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(demoInterval);
    };
  }, [runApiDemo, showApiDemo]);

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return "bg-green-100 text-green-800";
    if (status >= 400) return "bg-red-100 text-red-800";
    return "bg-yellow-100 text-yellow-800";
  };

  const getMethodColor = (method: string) => {
    switch (method.toLowerCase()) {
      case 'get': return "bg-blue-100 text-blue-800";
      case 'post': return "bg-green-100 text-green-800";
      case 'put': return "bg-yellow-100 text-yellow-800";
      case 'delete': return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className={`transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
      <div className="relative max-w-7xl mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-red-600/20 rounded-3xl blur-3xl animate-pulse"></div>
        
        <Card className="relative bg-white/90 backdrop-blur-xl border-2 border-orange-200 overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500">
          <CardContent className="p-0">
            {/* Enhanced Browser Header */}
            <div className="bg-gradient-to-r from-gray-100 to-gray-200 p-4 flex items-center gap-4 border-b border-gray-300">
              <div className="flex gap-2">
                <div className="w-4 h-4 rounded-full bg-red-500 hover:bg-red-600 cursor-pointer transition-colors animate-pulse"></div>
                <div className="w-4 h-4 rounded-full bg-yellow-500 hover:bg-yellow-600 cursor-pointer transition-colors animate-pulse"></div>
                <div className="w-4 h-4 rounded-full bg-green-500 hover:bg-green-600 cursor-pointer transition-colors animate-pulse"></div>
              </div>
              <div className="flex-1 text-center">
                <div className="bg-white rounded-full px-6 py-2 shadow-inner">
                  <span className="text-gray-600 font-mono text-sm">https://api-gateway-pro.vercel.app</span>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="w-6 h-6 bg-gray-300 rounded hover:bg-gray-400 cursor-pointer transition-colors"></div>
                <div className="w-6 h-6 bg-gray-300 rounded hover:bg-gray-400 cursor-pointer transition-colors"></div>
              </div>
            </div>

            {/* Enhanced Dashboard Interface */}
            <div className="p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-white via-orange-50/30 to-red-50/30 min-h-[500px]">
              {/* Mobile Header */}
              <div className="lg:hidden mb-6">
                <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-4 border border-orange-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                      <Database className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-semibold text-gray-900">API Collections</span>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <div className="flex gap-2 min-w-max pb-2">
                      {features.map((item, i) => (
                        <div
                          key={item}
                          onClick={() => setCurrentFeature(i)}
                          className={`px-4 py-2 rounded-lg transition-all duration-500 cursor-pointer group whitespace-nowrap ${
                            currentFeature === i
                              ? "bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg"
                              : "bg-gray-50 hover:bg-gray-100 text-gray-700"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${
                              currentFeature === i ? "bg-white" : "bg-orange-500"
                            }`}></div>
                            <span className="font-medium text-sm">{item}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:grid lg:grid-cols-12 lg:gap-6 h-full">
                {/* Desktop Sidebar */}
                <div className="hidden lg:block col-span-3 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-orange-100">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                        <Database className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-semibold text-gray-900">API Collections</span>
                    </div>
                    
                    {features.map((item, i) => (
                      <div
                        key={item}
                        onClick={() => setCurrentFeature(i)}
                        className={`p-4 rounded-lg transition-all duration-500 cursor-pointer group ${
                          currentFeature === i
                            ? "bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg scale-105"
                            : "bg-gray-50 hover:bg-gray-100 text-gray-700"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${
                            currentFeature === i ? "bg-white" : "bg-orange-500"
                          }`}></div>
                          <span className="font-medium">{item}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-9 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 border border-orange-100">
                  <div className="space-y-4 sm:space-y-6">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 sm:justify-between">
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 flex-1">
                        <div className="h-10 bg-gradient-to-r from-orange-200 to-red-200 rounded-lg w-full sm:w-20 animate-pulse"></div>
                        <div className="h-10 bg-gray-100 rounded-lg flex-1 sm:min-w-[300px] animate-pulse"></div>
                      </div>
                      <Button 
                        onClick={runApiDemo}
                        className="bg-gradient-to-r from-orange-500 to-red-600 text-white hover:from-orange-600 hover:to-red-700 transition-all duration-300 w-full sm:w-auto"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Send
                      </Button>
                    </div>

                    {/* API Demo Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                      <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-100 hover:border-orange-200 transition-all duration-300">
                        <CardContent className="p-4 sm:p-6">
                          <div className="flex items-center gap-3 mb-4">
                            <Terminal className="w-5 h-5 text-orange-600" />
                            <span className="font-semibold text-orange-800">Request</span>
                          </div>
                          <div className="space-y-3">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                              <Badge className={getMethodColor(showApiDemo && currentStep < apiDemoSteps.length ? apiDemoSteps[currentStep].method : "GET")}>
                                {showApiDemo && currentStep < apiDemoSteps.length ? apiDemoSteps[currentStep].method : "GET"}
                              </Badge>
                              <span className="font-mono text-sm text-gray-600 break-all">
                                {showApiDemo && currentStep < apiDemoSteps.length ? apiDemoSteps[currentStep].url : "/api/users"}
                              </span>
                            </div>
                            <div className="bg-white/80 rounded-lg p-3 font-mono text-xs sm:text-sm text-gray-700 overflow-x-auto">
                              <div className="animate-pulse whitespace-nowrap">Headers: Authorization: Bearer...</div>
                              <div className="animate-pulse whitespace-nowrap">Content-Type: application/json</div>
                              {showApiDemo && isLoading && (
                                <div className="text-orange-600 animate-pulse">⚡ Sending request...</div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-100 hover:border-blue-200 transition-all duration-300">
                        <CardContent className="p-4 sm:p-6">
                          <div className="flex items-center gap-3 mb-4">
                            <BarChart3 className="w-5 h-5 text-blue-600" />
                            <span className="font-semibold text-blue-800">Response</span>
                          </div>
                          <div className="space-y-3">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                              <Badge className={getStatusColor(showApiDemo && currentStep < apiDemoSteps.length ? apiDemoSteps[currentStep].status : 200)}>
                                {showApiDemo && currentStep < apiDemoSteps.length ? apiDemoSteps[currentStep].status : 200} OK
                              </Badge>
                              <span className="text-sm text-gray-600">
                                {showApiDemo && currentStep < apiDemoSteps.length ? apiDemoSteps[currentStep].time : "89ms"}
                              </span>
                            </div>
                            <div className="bg-white/80 rounded-lg p-3 font-mono text-xs sm:text-sm text-gray-700 overflow-x-auto">
                              {showApiDemo && !isLoading && currentStep < mockApiResponses.length ? (
                                <div className="whitespace-nowrap">
                                  {JSON.stringify(mockApiResponses[currentStep].response).substring(0, 50)}...
                                </div>
                              ) : (
                                <div className="animate-pulse whitespace-nowrap">{"{ users: [...], total: 1247 }"}</div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Live Demo */}
                    <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <Activity className="w-5 h-5 text-green-600 animate-pulse" />
                            <span className="font-semibold text-green-800">Live API Testing</span>
                          </div>
                          {showApiDemo && (
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                              <span className="text-sm text-green-600">Running Step {currentStep + 1}/{apiDemoSteps.length}</span>
                            </div>
                          )}
                        </div>
                        <div className="bg-gray-900 h-32 sm:h-48 overflow-auto rounded-lg p-3 sm:p-4 font-mono text-xs sm:text-sm text-green-400 relative">
                          {!showApiDemo ? (
                            <div className="flex items-center justify-center h-full">
                              <div className="text-center">
                                <div className="animate-pulse text-green-400 mb-2">⚡ Ready to test APIs</div>
                                <div className="text-gray-500 text-xs">Click 'Send' to start automated testing</div>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="whitespace-pre-wrap break-words leading-relaxed">{apiResponse}</div>
                              {isLoading && (
                                <div className="flex items-center gap-2 mt-2 animate-pulse">
                                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce"></div>
                                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                  <span className="text-yellow-400 ml-2">Processing API request...</span>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Stats Preview */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
                      {stats.map((stat, i) => (
                        <div key={i} className="text-center p-2 sm:p-3 bg-white/60 rounded-lg hover:bg-white/80 transition-all duration-300">
                          <div className={`text-lg sm:text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                          <div className="text-xs sm:text-sm text-gray-600">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ApiGatewayDashboard;
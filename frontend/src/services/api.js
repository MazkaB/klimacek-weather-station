// API service for communicating with Flask backend
import { useState, useEffect } from 'react';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // GET method
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    
    return this.request(url, {
      method: 'GET',
    });
  }

  // POST method
  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // PUT method
  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // DELETE method
  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }

  // Health check
  async healthCheck() {
    try {
      return await this.get('/api/health');
    } catch (error) {
      return { status: 'error', message: 'Backend unavailable' };
    }
  }

  // Sensor data methods
  async getCurrentSensors() {
    return this.get('/api/sensors/current');
  }

  async getSensorHistory(days = 7, limit = 1000) {
    return this.get('/api/sensors/history', { days, limit });
  }

  // Predictions methods
  async getPredictions(days = 30) {
    return this.get('/api/predictions', { days });
  }

  async trainModel() {
    return this.post('/api/train-model');
  }

  async getModelStatus() {
    return this.get('/api/model/status');
  }

  // Real-time data control
  async startRealtimeData() {
    return this.post('/api/start-realtime');
  }

  async stopRealtimeData() {
    return this.post('/api/stop-realtime');
  }

  // WebSocket connection for real-time updates
  connectWebSocket(onMessage, onError = null, onClose = null) {
    const wsUrl = this.baseURL.replace('http', 'ws');
    const socket = new WebSocket(`${wsUrl}/socket.io/?EIO=4&transport=websocket`);
    
    socket.onopen = () => {
      console.log('WebSocket connected to Flask backend');
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    socket.onclose = (event) => {
      console.log('WebSocket connection closed:', event.code, event.reason);
      if (onClose) onClose(event);
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      if (onError) onError(error);
    };

    return socket;
  }

  // Alternative: Server-Sent Events for real-time updates
  connectSSE(onMessage, onError = null) {
    const eventSource = new EventSource(`${this.baseURL}/api/stream`);
    
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch (error) {
        console.error('Error parsing SSE message:', error);
      }
    };

    eventSource.onerror = (error) => {
      console.error('SSE error:', error);
      if (onError) onError(error);
    };

    return eventSource;
  }
}

// Create a singleton instance
const apiService = new ApiService();

// Export individual methods for convenience
export const api = {
  // Health
  healthCheck: () => apiService.healthCheck(),
  
  // Sensors
  getCurrentSensors: () => apiService.getCurrentSensors(),
  getSensorHistory: (days, limit) => apiService.getSensorHistory(days, limit),
  
  // Predictions
  getPredictions: (days) => apiService.getPredictions(days),
  trainModel: () => apiService.trainModel(),
  getModelStatus: () => apiService.getModelStatus(),
  
  // Real-time control
  startRealtimeData: () => apiService.startRealtimeData(),
  stopRealtimeData: () => apiService.stopRealtimeData(),
  
  // WebSocket
  connectWebSocket: (onMessage, onError, onClose) => 
    apiService.connectWebSocket(onMessage, onError, onClose),
  connectSSE: (onMessage, onError) => 
    apiService.connectSSE(onMessage, onError),
};

// React hooks for API integration
export const useApi = () => {
  return api;
};

// Custom hook for sensor data  
export const useSensorData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await api.getCurrentSensors();
      setData(result.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  return { data, loading, error, refetch: fetchData };
};

// Custom hook for predictions
export const usePredictions = () => {
  const [predictions, setPredictions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPredictions = async (days = 30) => {
    try {
      setLoading(true);
      const result = await api.getPredictions(days);
      setPredictions(result.predictions);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const trainModel = async () => {
    try {
      setLoading(true);
      await api.trainModel();
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { 
    predictions, 
    loading, 
    error, 
    fetchPredictions, 
    trainModel 
  };
};

// Custom hook for real-time updates
export const useRealTimeUpdates = (onUpdate) => {
  const [connected, setConnected] = useState(false);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const ws = api.connectWebSocket(
      (data) => {
        setConnected(true);
        if (onUpdate) onUpdate(data);
      },
      (error) => {
        setConnected(false);
        console.error('WebSocket error:', error);
      },
      () => {
        setConnected(false);
      }
    );

    setSocket(ws);

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [onUpdate]);

  return { connected, socket };
};

// Error handling utilities
export const handleApiError = (error) => {
  if (error.response?.status === 401) {
    return 'Authentication required. Please log in.';
  } else if (error.response?.status === 403) {
    return 'Access forbidden. Check your permissions.';
  } else if (error.response?.status === 404) {
    return 'Resource not found.';
  } else if (error.response?.status >= 500) {
    return 'Server error. Please try again later.';
  } else if (error.code === 'NETWORK_ERROR') {
    return 'Network connection failed. Check your internet connection.';
  } else {
    return error.message || 'An unexpected error occurred.';
  }
};

// Request interceptor for adding auth tokens
export const addAuthInterceptor = (getToken) => {
  const originalRequest = apiService.request;
  
  apiService.request = async function(endpoint, options = {}) {
    const token = await getToken();
    if (token) {
      options.headers = {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
      };
    }
    
    return originalRequest.call(this, endpoint, options);
  };
};

export default apiService;
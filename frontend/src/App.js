import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import HistoricalData from './components/HistoricalData';
import Products from './components/Products';
import AboutUs from './components/AboutUs';
import WeatherStation from './components/WeatherStation';
import Login from './components/Auth/Login';
import SignUp from './components/Auth/SignUp';
import { supabase } from './services/supabase';
import './styles/index.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sensorData, setSensorData] = useState(null);
  const [predictions, setPredictions] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user || null);
      } catch (error) {
        console.error('Error getting session:', error);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    // Fetch initial sensor data
    const fetchSensorData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/sensors/current');
        const data = await response.json();
        if (data.success) {
          setSensorData(data.data);
        }
      } catch (error) {
        console.error('Error fetching sensor data:', error);
      }
    };

    fetchSensorData();

    // Set up real-time updates
    const interval = setInterval(fetchSensorData, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const handleLogin = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      setUser(data.user);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const handleSignUp = async (email, password, fullName) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          }
        }
      });

      if (error) throw error;

      return { success: true, message: 'Check your email for verification link' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-xl text-gray-600">Loading Klimacek...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
        <Navbar user={user} onLogout={handleLogout} />
        
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route 
              path="/" 
              element={
                <Dashboard 
                  sensorData={sensorData} 
                  predictions={predictions}
                  setPredictions={setPredictions}
                />
              } 
            />
            <Route 
              path="/historical" 
              element={<HistoricalData />} 
            />
            <Route 
              path="/products" 
              element={<Products />} 
            />
            <Route 
              path="/about" 
              element={<AboutUs />} 
            />
            <Route 
              path="/weather-station" 
              element={<WeatherStation sensorData={sensorData} />} 
            />
            <Route 
              path="/login" 
              element={
                user ? <Navigate to="/" /> : <Login onLogin={handleLogin} />
              } 
            />
            <Route 
              path="/signup" 
              element={
                user ? <Navigate to="/" /> : <SignUp onSignUp={handleSignUp} />
              } 
            />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 mt-12">
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="col-span-1 md:col-span-2">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">🌤️ Klimacek</h3>
                <p className="text-gray-600 mb-4">
                  Advanced weather monitoring system with AI-powered predictions. 
                  Monitor 8 different sensors in real-time with LSTM forecasting.
                </p>
                <div className="flex space-x-4">
                  <span className="text-sm text-gray-500">Surakarta, Central Java, ID</span>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-800 mb-4">Features</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>Real-time Monitoring</li>
                  <li>AI Predictions</li>
                  <li>Historical Data</li>
                  <li>Weather Alerts</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-800 mb-4">Sensors</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>Temperature & Humidity</li>
                  <li>Light & Rainfall</li>
                  <li>Wind Speed</li>
                  <li>Solar Monitoring</li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-gray-200 mt-8 pt-8 text-center">
              <p className="text-sm text-gray-500">
                © 2024 Klimacek Weather Station. Built by KlimaStation Team.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bfiifppytbirvgcytbze.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJmaWlmcHB5dGJpcnZnY3l0YnplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzNDM4NTEsImV4cCI6MjA2MzkxOTg1MX0.EFERKJqZHlLEpzxtrbY2b4zx05a_dMbrteyel_inARw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Helper functions for common operations
export const supabaseHelpers = {
  // Authentication
  signUp: async (email, password, options = {}) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options
      });
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  signIn: async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (error) {
      return { error };
    }
  },

  getCurrentUser: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  // Sensor Data Operations
  storeSensorData: async (sensorData) => {
    try {
      const { data, error } = await supabase
        .from('sensor_data')
        .insert([sensorData]);
      
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  getSensorData: async (limit = 100, timeRange = '24 hours') => {
    try {
      const { data, error } = await supabase
        .from('sensor_data')
        .select('*')
        .gte('timestamp', new Date(Date.now() - parseTimeRange(timeRange)).toISOString())
        .order('timestamp', { ascending: false })
        .limit(limit);
      
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  getLatestSensorReading: async () => {
    try {
      const { data, error } = await supabase
        .from('sensor_data')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(1)
        .single();
      
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Predictions Operations
  storePrediction: async (predictionData) => {
    try {
      const { data, error } = await supabase
        .from('predictions')
        .insert([predictionData]);
      
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  getLatestPredictions: async (limit = 10) => {
    try {
      const { data, error } = await supabase
        .from('predictions')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(limit);
      
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  // User Sessions
  createUserSession: async (sessionData) => {
    try {
      const { data, error } = await supabase
        .from('user_sessions')
        .insert([sessionData]);
      
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Real-time subscriptions
  subscribeTo: (table, callback, filter = '*') => {
    const subscription = supabase
      .channel(`public:${table}`)
      .on('postgres_changes', 
        { 
          event: filter, 
          schema: 'public', 
          table: table 
        }, 
        callback
      )
      .subscribe();

    return subscription;
  },

  // Unsubscribe from real-time updates
  unsubscribe: (subscription) => {
    if (subscription) {
      supabase.removeChannel(subscription);
    }
  }
};

// Helper function to parse time ranges
const parseTimeRange = (timeRange) => {
  const ranges = {
    '1 hour': 60 * 60 * 1000,
    '24 hours': 24 * 60 * 60 * 1000,
    '7 days': 7 * 24 * 60 * 60 * 1000,
    '30 days': 30 * 24 * 60 * 60 * 1000,
    '90 days': 90 * 24 * 60 * 60 * 1000
  };
  
  return ranges[timeRange] || ranges['24 hours'];
};

// Auth state change listener
export const onAuthStateChange = (callback) => {
  return supabase.auth.onAuthStateChange(callback);
};

// Database table schemas for reference
export const tableSchemas = {
  sensor_data: {
    id: 'integer (primary key)',
    timestamp: 'timestamptz',
    humidity: 'real',
    temperature: 'real',
    light_intensity: 'real',
    rainfall: 'real',
    wind_speed: 'real',
    solar_voltage: 'real',
    solar_wattage: 'real',
    solar_current: 'real',
    location: 'text',
    station_id: 'text'
  },
  predictions: {
    id: 'integer (primary key)',
    timestamp: 'timestamptz',
    predictions: 'jsonb',
    model_metrics: 'jsonb',
    prediction_horizon: 'integer',
    model_version: 'text',
    confidence_score: 'real'
  },
  user_sessions: {
    id: 'integer (primary key)',
    user_id: 'uuid',
    email: 'text',
    login_time: 'timestamptz',
    session_token: 'text',
    expires_at: 'timestamptz'
  }
};

export default supabase;
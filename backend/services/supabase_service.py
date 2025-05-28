from supabase import create_client, Client
from datetime import datetime, timedelta
import os

class SupabaseService:
    def __init__(self):
        # Supabase configuration
        self.url = "https://bfiifppytbirvgcytbze.supabase.co"
        self.key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJmaWlmcHB5dGJpcnZnY3l0YnplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzNDM4NTEsImV4cCI6MjA2MzkxOTg1MX0.EFERKJqZHlLEpzxtrbY2b4zx05a_dMbrteyel_inARw"
        
        try:
            self.supabase: Client = create_client(self.url, self.key)
            print("✅ Supabase client initialized successfully")
        except Exception as e:
            print(f"❌ Error initializing Supabase client: {e}")
            self.supabase = None
    
    def store_sensor_data(self, sensor_reading):
        """Store sensor reading in the database"""
        try:
            if not self.supabase:
                return False
            
            # Prepare data for insertion
            data = {
                'timestamp': sensor_reading.get('timestamp', datetime.now().isoformat()),
                'humidity': sensor_reading.get('humidity'),
                'temperature': sensor_reading.get('temperature'),
                'light_intensity': sensor_reading.get('light_intensity'),
                'rainfall': sensor_reading.get('rainfall'),
                'wind_speed': sensor_reading.get('wind_speed'),
                'solar_voltage': sensor_reading.get('solar_voltage'),
                'solar_wattage': sensor_reading.get('solar_wattage'),
                'solar_current': sensor_reading.get('solar_current'),
                'location': sensor_reading.get('location', 'Surakarta, Central Java, ID'),
                'station_id': sensor_reading.get('station_id', 'KLIMACEK_001')
            }
            
            # Insert data
            result = self.supabase.table('sensor_data').insert(data).execute()
            
            if result.data:
                print(f"✅ Sensor data stored successfully at {data['timestamp']}")
                return True
            else:
                print(f"❌ Failed to store sensor data")
                return False
                
        except Exception as e:
            print(f"❌ Error storing sensor data: {e}")
            return False
    
    def get_historical_data(self, hours=24, limit=1000):
        """Retrieve historical sensor data"""
        try:
            if not self.supabase:
                return []
            
            # Calculate start time
            start_time = datetime.now() - timedelta(hours=hours)
            
            # Query historical data
            result = self.supabase.table('sensor_data')\
                .select('*')\
                .gte('timestamp', start_time.isoformat())\
                .order('timestamp', desc=True)\
                .limit(limit)\
                .execute()
            
            if result.data:
                print(f"✅ Retrieved {len(result.data)} historical records")
                return result.data
            else:
                print("⚠️ No historical data found")
                return []
                
        except Exception as e:
            print(f"❌ Error retrieving historical data: {e}")
            return []
    
    def get_sensor_averages(self, hours=24):
        """Get average values for each sensor over specified hours"""
        try:
            if not self.supabase:
                return {}
            
            start_time = datetime.now() - timedelta(hours=hours)
            
            # Get all data within time range
            result = self.supabase.table('sensor_data')\
                .select('*')\
                .gte('timestamp', start_time.isoformat())\
                .execute()
            
            if not result.data:
                return {}
            
            # Calculate averages
            sensors = ['humidity', 'temperature', 'light_intensity', 'rainfall', 
                      'wind_speed', 'solar_voltage', 'solar_wattage', 'solar_current']
            
            averages = {}
            for sensor in sensors:
                values = [row[sensor] for row in result.data if row.get(sensor) is not None]
                if values:
                    averages[sensor] = {
                        'average': round(sum(values) / len(values), 2),
                        'min': round(min(values), 2),
                        'max': round(max(values), 2),
                        'count': len(values)
                    }
            
            print(f"✅ Calculated averages for {len(averages)} sensors")
            return averages
            
        except Exception as e:
            print(f"❌ Error calculating sensor averages: {e}")
            return {}
    
    def store_prediction_data(self, predictions, model_info):
        """Store ML prediction results"""
        try:
            if not self.supabase:
                return False
            
            # Prepare prediction data
            data = {
                'timestamp': datetime.now().isoformat(),
                'predictions': predictions,
                'model_metrics': model_info.get('metrics', {}),
                'prediction_horizon': model_info.get('days', 30),
                'model_version': model_info.get('version', '1.0'),
                'confidence_score': model_info.get('confidence', 0.85)
            }
            
            # Store in predictions table
            result = self.supabase.table('predictions').insert(data).execute()
            
            if result.data:
                print("✅ Prediction data stored successfully")
                return True
            else:
                print("❌ Failed to store prediction data")
                return False
                
        except Exception as e:
            print(f"❌ Error storing prediction data: {e}")
            return False
    
    def get_latest_predictions(self, sensor_type=None):
        """Get latest prediction results"""
        try:
            if not self.supabase:
                return []
            
            # Query latest predictions
            query = self.supabase.table('predictions')\
                .select('*')\
                .order('timestamp', desc=True)\
                .limit(10)
            
            result = query.execute()
            
            if result.data:
                predictions = result.data
                
                # Filter by sensor type if specified
                if sensor_type:
                    filtered_predictions = []
                    for pred in predictions:
                        if sensor_type in pred.get('predictions', {}):
                            filtered_predictions.append(pred)
                    predictions = filtered_predictions
                
                print(f"✅ Retrieved {len(predictions)} prediction records")
                return predictions
            else:
                print("⚠️ No prediction data found")
                return []
                
        except Exception as e:
            print(f"❌ Error retrieving predictions: {e}")
            return []
    
    def create_user_session(self, user_data):
        """Create user session for authentication"""
        try:
            if not self.supabase:
                return None
            
            # Store user session data
            session_data = {
                'user_id': user_data.get('id'),
                'email': user_data.get('email'),
                'login_time': datetime.now().isoformat(),
                'session_token': user_data.get('access_token'),
                'expires_at': user_data.get('expires_at')
            }
            
            result = self.supabase.table('user_sessions').insert(session_data).execute()
            
            if result.data:
                print(f"✅ User session created for {user_data.get('email')}")
                return result.data[0]
            else:
                print("❌ Failed to create user session")
                return None
                
        except Exception as e:
            print(f"❌ Error creating user session: {e}")
            return None
    
    def get_data_statistics(self, days=7):
        """Get statistics about stored data"""
        try:
            if not self.supabase:
                return {}
            
            start_time = datetime.now() - timedelta(days=days)
            
            # Get total count
            count_result = self.supabase.table('sensor_data')\
                .select('id', count='exact')\
                .gte('timestamp', start_time.isoformat())\
                .execute()
            
            # Get latest entry
            latest_result = self.supabase.table('sensor_data')\
                .select('timestamp')\
                .order('timestamp', desc=True)\
                .limit(1)\
                .execute()
            
            # Get oldest entry
            oldest_result = self.supabase.table('sensor_data')\
                .select('timestamp')\
                .order('timestamp', desc=False)\
                .limit(1)\
                .execute()
            
            stats = {
                'total_records': count_result.count if count_result.count else 0,
                'latest_reading': latest_result.data[0]['timestamp'] if latest_result.data else None,
                'oldest_reading': oldest_result.data[0]['timestamp'] if oldest_result.data else None,
                'data_range_days': days
            }
            
            print(f"✅ Retrieved database statistics: {stats['total_records']} records")
            return stats
            
        except Exception as e:
            print(f"❌ Error getting data statistics: {e}")
            return {}
    
    def cleanup_old_data(self, days_to_keep=30):
        """Clean up old sensor data to manage storage"""
        try:
            if not self.supabase:
                return False
            
            cutoff_date = datetime.now() - timedelta(days=days_to_keep)
            
            # Delete old records
            result = self.supabase.table('sensor_data')\
                .delete()\
                .lt('timestamp', cutoff_date.isoformat())\
                .execute()
            
            print(f"✅ Cleaned up old data before {cutoff_date.date()}")
            return True
            
        except Exception as e:
            print(f"❌ Error cleaning up old data: {e}")
            return False
    
    def health_check(self):
        """Check if Supabase connection is healthy"""
        try:
            if not self.supabase:
                return False
            
            # Try a simple query
            result = self.supabase.table('sensor_data')\
                .select('id')\
                .limit(1)\
                .execute()
            
            print("✅ Supabase connection is healthy")
            return True
            
        except Exception as e:
            print(f"❌ Supabase health check failed: {e}")
            return False

# SQL commands to create necessary tables in Supabase
"""
-- Create sensor_data table
CREATE TABLE sensor_data (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    humidity REAL,
    temperature REAL,
    light_intensity REAL,
    rainfall REAL,
    wind_speed REAL,
    solar_voltage REAL,
    solar_wattage REAL,
    solar_current REAL,
    location TEXT DEFAULT 'Surakarta, Central Java, ID',
    station_id TEXT DEFAULT 'KLIMACEK_001'
);

-- Create predictions table
CREATE TABLE predictions (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    predictions JSONB,
    model_metrics JSONB,
    prediction_horizon INTEGER,
    model_version TEXT,
    confidence_score REAL
);

-- Create user_sessions table
CREATE TABLE user_sessions (
    id SERIAL PRIMARY KEY,
    user_id UUID,
    email TEXT,
    login_time TIMESTAMPTZ DEFAULT NOW(),
    session_token TEXT,
    expires_at TIMESTAMPTZ
);

-- Create indexes for better performance
CREATE INDEX idx_sensor_data_timestamp ON sensor_data(timestamp);
CREATE INDEX idx_predictions_timestamp ON predictions(timestamp);
CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
"""
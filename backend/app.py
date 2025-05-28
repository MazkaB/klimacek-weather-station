from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO, emit
import os
import json
import threading
import time
from datetime import datetime, timedelta
import numpy as np
import pandas as pd
import traceback
from services.data_generator import WeatherDataGenerator
from services.ml_service import TimeGPTWeatherPredictor
from services.supabase_service import SupabaseService

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'klimacek-secret-key-2024')

# Production CORS configuration
if os.environ.get('FLASK_ENV') == 'production':
    # Allow your Vercel frontend domain
    CORS(app, origins=[
        "https://*.vercel.app",
        "https://klimacek.vercel.app",  # Replace with your actual domain
        "http://localhost:3000"  # For local development
    ])
else:
    # Development CORS
    CORS(app, origins=["http://localhost:3000"])

socketio = SocketIO(app, cors_allowed_origins="*")

# Initialize services
data_generator = WeatherDataGenerator()
ml_predictor = TimeGPTWeatherPredictor()
supabase_service = SupabaseService()

# Global variables for real-time data
current_data = {}
is_generating = False

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'service': 'Klimacek Weather Station API'
    })

@app.route('/api/sensors/current', methods=['GET'])
def get_current_sensors():
    """Get current sensor readings"""
    try:
        if not current_data:
            # Generate initial data if none exists
            current_data.update(data_generator.generate_current_reading())
        
        return jsonify({
            'success': True,
            'data': current_data,
            'timestamp': datetime.now().isoformat()
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/sensors/history', methods=['GET'])
def get_sensor_history():
    """Get historical sensor data"""
    try:
        days = request.args.get('days', 7, type=int)
        limit = request.args.get('limit', 1000, type=int)
        
        print(f"Generating historical data for {days} days, limit {limit}")
        
        # Generate historical data
        historical_data = data_generator.generate_historical_data(days=days, limit=limit)
        
        print(f"Generated {len(historical_data)} historical records")
        
        return jsonify({
            'success': True,
            'data': historical_data,
            'count': len(historical_data)
        })
    except Exception as e:
        print(f"Error in get_sensor_history: {str(e)}")
        print(f"Traceback: {traceback.format_exc()}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/predictions', methods=['GET'])
def get_predictions():
    """Get TimeGPT predictions for the next month"""
    try:
        prediction_days = request.args.get('days', 30, type=int)
        
        print(f"🔮 Generating TimeGPT predictions for {prediction_days} days")
        
        # Generate training data
        print("Generating historical data...")
        historical_data = data_generator.generate_historical_data(days=60, limit=2000)
        print(f"Generated {len(historical_data)} historical samples")
        
        # TimeGPT doesn't need training - it's a foundation model
        if not ml_predictor.is_trained:
            print("Initializing TimeGPT model...")
            try:
                ml_predictor.train_model(historical_data)  # This just validates data
                print("TimeGPT model ready")
            except Exception as training_error:
                print(f"TimeGPT initialization issue: {str(training_error)}")
                # Return simple predictions instead of failing completely
                return jsonify({
                    'success': True,
                    'predictions': generate_simple_predictions(prediction_days),
                    'model_accuracy': {'note': 'Using simplified predictions - TimeGPT unavailable'},
                    'forecast_days': prediction_days
                })
        
        # Generate TimeGPT predictions
        print("Generating TimeGPT predictions...")
        predictions = ml_predictor.predict_future(historical_data, prediction_days)
        
        return jsonify({
            'success': True,
            'predictions': predictions,
            'model_accuracy': ml_predictor.get_model_metrics(),
            'forecast_days': prediction_days,
            'model_type': 'TimeGPT Foundation Model'
        })
    except Exception as e:
        print(f"Error in get_predictions: {str(e)}")
        print(f"Traceback: {traceback.format_exc()}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

def generate_simple_predictions(days):
    """Generate simple predictions as fallback"""
    sensors = ['humidity', 'temperature', 'light_intensity', 'rainfall', 'wind_speed', 'solar_voltage', 'solar_wattage', 'solar_current']
    predictions = {}
    
    for sensor in sensors:
        sensor_predictions = []
        base_value = data_generator.base_values[sensor]
        
        for day in range(days):
            # Simple trend with some variation
            trend_factor = 1 + (day * 0.01)  # Small upward trend
            noise = np.random.normal(0, base_value * 0.1)  # 10% noise
            predicted_value = base_value * trend_factor + noise
            
            sensor_predictions.append({
                'day': day + 1,
                'date': (datetime.now() + timedelta(days=day + 1)).isoformat(),
                'predicted_value': float(max(0, predicted_value)),  # Ensure non-negative
                'confidence': max(95 - (day * 1.5), 60)  # Decreasing confidence
            })
        
        predictions[sensor] = sensor_predictions
    
    return predictions

@app.route('/api/train-model', methods=['POST'])
def train_model():
    """Initialize TimeGPT model (no training needed)"""
    try:
        # Generate comprehensive historical data for validation
        historical_data = data_generator.generate_historical_data(days=90, limit=5000)
        
        # Initialize/validate the TimeGPT model
        metrics = ml_predictor.train_model(historical_data)
        
        return jsonify({
            'success': True,
            'message': 'TimeGPT model initialized successfully (pre-trained foundation model)',
            'metrics': metrics,
            'model_type': 'TimeGPT Foundation Model'
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/model/status', methods=['GET'])
def get_model_status():
    """Get model training status and metrics"""
    return jsonify({
        'success': True,
        'is_trained': ml_predictor.is_trained,
        'metrics': ml_predictor.get_model_metrics() if ml_predictor.is_trained else None,
        'last_trained': ml_predictor.last_trained.isoformat() if ml_predictor.last_trained else None
    })

@app.route('/api/start-realtime', methods=['POST'])
def start_realtime_data():
    """Start real-time data generation"""
    global is_generating
    if not is_generating:
        is_generating = True
        threading.Thread(target=realtime_data_loop, daemon=True).start()
        return jsonify({'success': True, 'message': 'Real-time data started'})
    return jsonify({'success': True, 'message': 'Real-time data already running'})

@app.route('/api/stop-realtime', methods=['POST'])
def stop_realtime_data():
    """Stop real-time data generation"""
    global is_generating
    is_generating = False
    return jsonify({'success': True, 'message': 'Real-time data stopped'})

def realtime_data_loop():
    """Background thread for generating real-time data"""
    global current_data, is_generating
    
    while is_generating:
        try:
            # Generate new reading
            new_reading = data_generator.generate_current_reading()
            current_data.update(new_reading)
            
            # Emit to WebSocket clients
            socketio.emit('sensor_update', {
                'data': current_data,
                'timestamp': datetime.now().isoformat()
            })
            
            # Store in database (optional)
            # supabase_service.store_sensor_data(current_data)
            
            # Wait for next minute
            time.sleep(60)  # Generate data every minute
            
        except Exception as e:
            print(f"Error in real-time data loop: {e}")
            # Don't break the loop, just wait and try again
            time.sleep(5)

@socketio.on('connect')
def handle_connect():
    """Handle WebSocket connection"""
    print('Client connected')
    # Send current data to newly connected client
    if current_data:
        emit('sensor_update', {
            'data': current_data,
            'timestamp': datetime.now().isoformat()
        })

@socketio.on('disconnect')
def handle_disconnect():
    """Handle WebSocket disconnection"""
    print('Client disconnected')

@socketio.on('request_prediction')
def handle_prediction_request(data):
    """Handle real-time prediction requests"""
    try:
        sensor_type = data.get('sensor', 'temperature')
        days = data.get('days', 7)
        
        # Generate training data
        training_data = data_generator.generate_historical_data(days=30, limit=1000)
        
        # Get prediction for specific sensor
        if not ml_predictor.is_trained:
            ml_predictor.train_model(training_data)
        
        predictions = ml_predictor.predict_sensor(training_data, sensor_type, days)
        
        emit('prediction_update', {
            'sensor': sensor_type,
            'predictions': predictions,
            'timestamp': datetime.now().isoformat()
        })
    except Exception as e:
        emit('prediction_error', {'error': str(e)})

if __name__ == '__main__':
    # Start real-time data generation on startup
    threading.Thread(target=lambda: (time.sleep(2), start_realtime_data()), daemon=True).start()
    
    print("🌤️  Klimacek Weather Station API Starting...")
    print("🔧 Backend running on http://localhost:5000")
    print("📊 Real-time data will start automatically")
    print("🤖 TimeGPT foundation model ready for predictions")
    print("🔮 Advanced AI forecasting powered by Nixtla TimeGPT")
    
    # Use PORT from environment (Railway sets this) or default to 5000
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_ENV') != 'production'
    
    socketio.run(app, debug=debug, host='0.0.0.0', port=port)
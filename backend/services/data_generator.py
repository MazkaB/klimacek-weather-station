import numpy as np
import pandas as pd
from datetime import datetime, timedelta
import random
import math

class WeatherDataGenerator:
    def __init__(self):
        self.base_values = {
            'humidity': 60.0,
            'temperature': 25.0,
            'light_intensity': 500.0,
            'rainfall': 0.0,
            'wind_speed': 5.0,
            'solar_voltage': 12.0,
            'solar_wattage': 50.0,
            'solar_current': 4.0
        }
        
        self.ranges = {
            'humidity': (20, 95, 10),  # (min, max, noise_factor)
            'temperature': (15, 40, 3),
            'light_intensity': (0, 1200, 50),
            'rainfall': (0, 15, 2),
            'wind_speed': (0, 25, 3),
            'solar_voltage': (10, 14, 1),
            'solar_wattage': (0, 100, 10),
            'solar_current': (0, 8, 1)
        }
        
        self.units = {
            'humidity': '%',
            'temperature': '°C',
            'light_intensity': 'lux',
            'rainfall': 'mm',
            'wind_speed': 'km/h',
            'solar_voltage': 'V',
            'solar_wattage': 'W',
            'solar_current': 'A'
        }
        
        # For realistic daily/seasonal patterns
        self.previous_values = self.base_values.copy()
    
    def get_time_factor(self, timestamp=None):
        """Calculate time-based factors for realistic weather patterns"""
        if timestamp is None:
            timestamp = datetime.now()
        
        hour = timestamp.hour
        day_of_year = timestamp.timetuple().tm_yday
        
        # Daily patterns (0-1 scale)
        daily_pattern = {
            'temperature': 0.5 + 0.4 * math.sin((hour - 6) * math.pi / 12),  # Peak at 2 PM
            'light_intensity': max(0, math.sin((hour - 6) * math.pi / 12)),  # Daylight hours
            'humidity': 0.7 + 0.3 * math.sin((hour - 14) * math.pi / 12),   # Higher at night
            'solar_voltage': max(0, math.sin((hour - 6) * math.pi / 12)),
            'solar_wattage': max(0, math.sin((hour - 6) * math.pi / 12)),
            'solar_current': max(0, math.sin((hour - 6) * math.pi / 12)),
        }
        
        # Seasonal patterns (0-1 scale)
        seasonal_pattern = {
            'temperature': 0.5 + 0.3 * math.sin((day_of_year - 80) * 2 * math.pi / 365),  # Peak summer
            'humidity': 0.6 + 0.2 * math.sin((day_of_year - 200) * 2 * math.pi / 365),   # Peak winter
            'light_intensity': 0.7 + 0.3 * math.sin((day_of_year - 80) * 2 * math.pi / 365),
        }
        
        return daily_pattern, seasonal_pattern
    
    def generate_realistic_value(self, sensor, timestamp=None):
        """Generate realistic sensor value based on time patterns"""
        min_val, max_val, noise = self.ranges[sensor]
        daily_pattern, seasonal_pattern = self.get_time_factor(timestamp)
        
        # Base value with time patterns
        base = self.base_values[sensor]
        
        # Apply daily pattern if available
        if sensor in daily_pattern:
            base *= (0.5 + 0.5 * daily_pattern[sensor])
        
        # Apply seasonal pattern if available
        if sensor in seasonal_pattern:
            base *= (0.7 + 0.6 * seasonal_pattern[sensor])
        
        # Add smooth transition from previous value (temporal correlation)
        if sensor in self.previous_values:
            momentum = 0.8
            base = momentum * self.previous_values[sensor] + (1 - momentum) * base
        
        # Add realistic noise
        noise_factor = np.random.normal(0, noise / 3)
        value = base + noise_factor
        
        # Ensure within realistic bounds
        value = max(min_val, min(max_val, value))
        
        # Special cases for certain sensors
        if sensor == 'rainfall':
            # Rainfall is often 0, with occasional bursts
            if random.random() > 0.85:  # 15% chance of rain
                value = random.expovariate(0.5)  # Use expovariate instead of exponential
            else:
                value = 0.0
        
        elif sensor == 'wind_speed':
            # Wind speed is always positive and often has gusts
            if random.random() > 0.9:  # 10% chance of gusts
                value *= random.uniform(1.5, 2.5)
            value = max(0, value)
        
        elif sensor.startswith('solar_'):
            # Solar values depend on light intensity
            hour = timestamp.hour if timestamp else datetime.now().hour
            if hour < 6 or hour > 18:  # Night time
                value = min_val
            else:
                # Solar output correlates with light
                light_factor = max(0, math.sin((hour - 6) * math.pi / 12))
                value = min_val + (max_val - min_val) * light_factor
                value += np.random.normal(0, noise / 4)  # Less noise for solar
        
        # Store for next iteration
        self.previous_values[sensor] = value
        
        return round(value, 2)
    
    def generate_current_reading(self, timestamp=None):
        """Generate current sensor reading"""
        if timestamp is None:
            timestamp = datetime.now()
        
        reading = {
            'timestamp': timestamp.isoformat(),
            'humidity': self.generate_realistic_value('humidity', timestamp),
            'temperature': self.generate_realistic_value('temperature', timestamp),
            'light_intensity': self.generate_realistic_value('light_intensity', timestamp),
            'rainfall': self.generate_realistic_value('rainfall', timestamp),
            'wind_speed': self.generate_realistic_value('wind_speed', timestamp),
            'solar_voltage': self.generate_realistic_value('solar_voltage', timestamp),
            'solar_wattage': self.generate_realistic_value('solar_wattage', timestamp),
            'solar_current': self.generate_realistic_value('solar_current', timestamp)
        }
        
        # Add metadata
        reading['location'] = 'Surakarta, Central Java, ID'
        reading['station_id'] = 'KLIMACEK_001'
        
        return reading
    
    def generate_historical_data(self, days=7, limit=1000):
        """Generate historical weather data"""
        end_time = datetime.now()
        start_time = end_time - timedelta(days=days)
        
        # Calculate interval between readings
        total_minutes = days * 24 * 60
        interval_minutes = max(1, total_minutes // limit)
        
        historical_data = []
        current_time = start_time
        
        while current_time <= end_time and len(historical_data) < limit:
            reading = self.generate_current_reading(current_time)
            historical_data.append(reading)
            current_time += timedelta(minutes=interval_minutes)
        
        return historical_data
    
    def generate_batch_data(self, start_time, end_time, interval_minutes=1):
        """Generate data for a specific time range"""
        data = []
        current_time = start_time
        
        while current_time <= end_time:
            reading = self.generate_current_reading(current_time)
            data.append(reading)
            current_time += timedelta(minutes=interval_minutes)
        
        return data
    
    def add_weather_events(self, data):
        """Add realistic weather events to the data"""
        # Add storms, heat waves, cold snaps, etc.
        events = []
        
        for i, reading in enumerate(data):
            timestamp = datetime.fromisoformat(reading['timestamp'])
            
            # Simulate weather events
            if random.random() < 0.05:  # 5% chance of weather event
                event_type = random.choice(['storm', 'heat_wave', 'cold_snap', 'clear_sky'])
                
                if event_type == 'storm':
                    reading['rainfall'] = min(15, reading['rainfall'] + random.uniform(5, 12))
                    reading['wind_speed'] = min(25, reading['wind_speed'] + random.uniform(8, 15))
                    reading['humidity'] = min(95, reading['humidity'] + random.uniform(10, 20))
                    reading['light_intensity'] = max(0, reading['light_intensity'] * 0.3)
                    
                elif event_type == 'heat_wave':
                    reading['temperature'] = min(40, reading['temperature'] + random.uniform(5, 10))
                    reading['humidity'] = max(20, reading['humidity'] - random.uniform(10, 20))
                    reading['light_intensity'] = min(1200, reading['light_intensity'] * 1.2)
                    
                elif event_type == 'cold_snap':
                    reading['temperature'] = max(15, reading['temperature'] - random.uniform(5, 8))
                    reading['wind_speed'] = min(25, reading['wind_speed'] + random.uniform(3, 8))
                    
                elif event_type == 'clear_sky':
                    reading['light_intensity'] = min(1200, reading['light_intensity'] * 1.3)
                    reading['solar_wattage'] = min(100, reading['solar_wattage'] * 1.2)
                
                events.append({
                    'timestamp': timestamp.isoformat(),
                    'type': event_type,
                    'description': f"Weather event: {event_type.replace('_', ' ').title()}"
                })
        
        return data, events
    
    def get_sensor_info(self):
        """Get information about all sensors"""
        return {
            sensor: {
                'name': sensor.replace('_', ' ').title(),
                'unit': self.units[sensor],
                'range': f"{self.ranges[sensor][0]} - {self.ranges[sensor][1]} {self.units[sensor]}",
                'description': self._get_sensor_description(sensor)
            }
            for sensor in self.base_values.keys()
        }
    
    def _get_sensor_description(self, sensor):
        """Get description for each sensor"""
        descriptions = {
            'humidity': 'Measures the amount of water vapor in the air',
            'temperature': 'Ambient air temperature measurement',
            'light_intensity': 'Measures the amount of visible light',
            'rainfall': 'Precipitation measurement in millimeters',
            'wind_speed': 'Wind velocity measurement',
            'solar_voltage': 'Solar panel voltage output',
            'solar_wattage': 'Solar panel power output',
            'solar_current': 'Solar panel current output'
        }
        return descriptions.get(sensor, 'Weather sensor measurement')
    
    def export_to_csv(self, data, filename):
        """Export data to CSV file"""
        df = pd.DataFrame(data)
        df.to_csv(filename, index=False)
        return filename
    
    def get_statistics(self, data):
        """Calculate statistics for the generated data"""
        df = pd.DataFrame(data)
        
        stats = {}
        for sensor in self.base_values.keys():
            if sensor in df.columns:
                stats[sensor] = {
                    'mean': round(df[sensor].mean(), 2),
                    'min': round(df[sensor].min(), 2),
                    'max': round(df[sensor].max(), 2),
                    'std': round(df[sensor].std(), 2),
                    'unit': self.units[sensor]
                }
        
        return stats
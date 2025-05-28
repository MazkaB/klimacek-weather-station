import React, { useState, useEffect } from 'react';
import { 
  CloudIcon, 
  SunIcon, 
  EyeIcon, 
  CloudIcon as RainIcon,
  ArrowPathIcon,
  BoltIcon,
  SignalIcon,
  Battery100Icon,
  MapPinIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const WeatherStation = ({ sensorData }) => {
  const [alerts, setAlerts] = useState([]);
  const [stationStatus, setStationStatus] = useState('online');
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const sensorConfig = [
    {
      key: 'humidity',
      name: 'Humidity',
      icon: CloudIcon,
      unit: '%',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      normalRange: [30, 80],
      description: 'Air moisture content'
    },
    {
      key: 'temperature',
      name: 'Temperature',
      icon: SunIcon,
      unit: '°C',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      normalRange: [18, 35],
      description: 'Ambient air temperature'
    },
    {
      key: 'light_intensity',
      name: 'Light Intensity',
      icon: EyeIcon,
      unit: 'lux',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      normalRange: [100, 1000],
      description: 'Visible light measurement'
    },
    {
      key: 'rainfall',
      name: 'Rainfall',
      icon: RainIcon,
      unit: 'mm',
      color: 'text-blue-700',
      bgColor: 'bg-blue-100',
      normalRange: [0, 5],
      description: 'Precipitation amount'
    },
    {
      key: 'wind_speed',
      name: 'Wind Speed',
      icon: ArrowPathIcon,
      unit: 'km/h',
      color: 'text-gray-600',
      bgColor: 'bg-gray-100',
      normalRange: [0, 15],
      description: 'Wind velocity'
    },
    {
      key: 'solar_voltage',
      name: 'Solar Voltage',
      icon: BoltIcon,
      unit: 'V',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      normalRange: [11, 13],
      description: 'Solar panel voltage output'
    },
    {
      key: 'solar_wattage',
      name: 'Solar Wattage',
      icon: SignalIcon,
      unit: 'W',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      normalRange: [10, 80],
      description: 'Solar panel power output'
    },
    {
      key: 'solar_current',
      name: 'Solar Current',
      icon: Battery100Icon,
      unit: 'A',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
      normalRange: [1, 6],
      description: 'Solar panel current output'
    }
  ];

  useEffect(() => {
    // Check for alerts when sensor data changes
    if (sensorData) {
      checkForAlerts();
      setLastUpdate(new Date());
    }
  }, [sensorData]);

  const checkForAlerts = () => {
    const newAlerts = [];

    sensorConfig.forEach(sensor => {
      const value = sensorData[sensor.key];
      if (value !== null && value !== undefined) {
        const [min, max] = sensor.normalRange;
        
        if (value < min) {
          newAlerts.push({
            id: `${sensor.key}-low`,
            type: 'warning',
            sensor: sensor.name,
            message: `${sensor.name} is below normal range (${value.toFixed(1)}${sensor.unit} < ${min}${sensor.unit})`,
            timestamp: new Date(),
            severity: 'medium'
          });
        } else if (value > max) {
          newAlerts.push({
            id: `${sensor.key}-high`,
            type: 'warning',
            sensor: sensor.name,
            message: `${sensor.name} is above normal range (${value.toFixed(1)}${sensor.unit} > ${max}${sensor.unit})`,
            timestamp: new Date(),
            severity: value > max * 1.5 ? 'high' : 'medium'
          });
        }
      }
    });

    // Add critical weather alerts
    if (sensorData.rainfall > 10) {
      newAlerts.push({
        id: 'heavy-rain',
        type: 'critical',
        sensor: 'Weather',
        message: 'Heavy rainfall detected! Take precautions.',
        timestamp: new Date(),
        severity: 'high'
      });
    }

    if (sensorData.wind_speed > 20) {
      newAlerts.push({
        id: 'strong-wind',
        type: 'critical',
        sensor: 'Weather',
        message: 'Strong winds detected! Secure loose objects.',
        timestamp: new Date(),
        severity: 'high'
      });
    }

    setAlerts(newAlerts);
  };

  const getSensorValue = (sensorKey) => {
    return sensorData ? sensorData[sensorKey] : null;
  };

  const getSensorStatus = (sensor, value) => {
    if (value === null || value === undefined) return 'offline';
    
    const [min, max] = sensor.normalRange;
    if (value < min || value > max) return 'warning';
    return 'normal';
  };

  const getWeatherCondition = () => {
    if (!sensorData) return 'Unknown';
    
    const { temperature, humidity, rainfall, wind_speed } = sensorData;
    
    if (rainfall > 5) return 'Rainy';
    if (wind_speed > 15) return 'Windy';
    if (temperature > 30 && humidity < 40) return 'Hot & Dry';
    if (temperature < 18) return 'Cool';
    if (humidity > 80) return 'Humid';
    return 'Clear';
  };

  const getComfortIndex = () => {
    if (!sensorData) return 0;
    
    const { temperature, humidity } = sensorData;
    
    // Simple comfort index calculation
    const idealTemp = 22;
    const idealHumidity = 50;
    
    const tempScore = Math.max(0, 100 - Math.abs(temperature - idealTemp) * 5);
    const humidityScore = Math.max(0, 100 - Math.abs(humidity - idealHumidity) * 2);
    
    return Math.round((tempScore + humidityScore) / 2);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          🏢 Klimacek Weather Station
        </h1>
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6 text-gray-600">
          <div className="flex items-center space-x-2">
            <MapPinIcon className="h-5 w-5" />
            <span>Surakarta, Central Java, ID</span>
          </div>
          <div className="flex items-center space-x-2">
            <ClockIcon className="h-5 w-5" />
            <span>Last Update: {lastUpdate.toLocaleTimeString()}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${
              stationStatus === 'online' ? 'bg-green-500' : 'bg-red-500'
            }`}></div>
            <span className="capitalize">{stationStatus}</span>
          </div>
        </div>
      </div>

      {/* Current Weather Summary */}
      <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl text-white p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-6xl mb-4">
              {getWeatherCondition() === 'Rainy' ? '🌧️' :
               getWeatherCondition() === 'Windy' ? '💨' :
               getWeatherCondition() === 'Hot & Dry' ? '🌵' :
               getWeatherCondition() === 'Cool' ? '❄️' :
               getWeatherCondition() === 'Humid' ? '💧' : '☀️'}
            </div>
            <h2 className="text-2xl font-bold mb-2">{getWeatherCondition()}</h2>
            <p className="text-lg opacity-90">{new Date().toLocaleDateString()}</p>
          </div>
          
          <div className="text-center">
            <div className="text-5xl font-bold mb-2">
              {sensorData ? sensorData.temperature?.toFixed(1) : '--'}°C
            </div>
            <p className="text-lg opacity-90">Temperature</p>
            <p className="text-sm opacity-75">
              Feels like {sensorData ? (sensorData.temperature + (sensorData.humidity > 70 ? 2 : -1)).toFixed(1) : '--'}°C
            </p>
          </div>
          
          <div className="text-center">
            <div className="text-5xl font-bold mb-2">{getComfortIndex()}%</div>
            <p className="text-lg opacity-90">Comfort Index</p>
            <p className="text-sm opacity-75">
              {getComfortIndex() > 80 ? 'Very Comfortable' :
               getComfortIndex() > 60 ? 'Comfortable' :
               getComfortIndex() > 40 ? 'Fair' : 'Uncomfortable'}
            </p>
          </div>
        </div>
      </div>

      {/* Alerts Section */}
      {alerts.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <ExclamationTriangleIcon className="h-6 w-6 text-orange-500 mr-2" />
            Active Alerts ({alerts.length})
          </h2>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-lg border-l-4 ${
                  alert.severity === 'high'
                    ? 'bg-red-50 border-red-500'
                    : 'bg-yellow-50 border-yellow-500'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className={`font-medium ${
                      alert.severity === 'high' ? 'text-red-800' : 'text-yellow-800'
                    }`}>
                      {alert.message}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {alert.timestamp.toLocaleTimeString()} - {alert.sensor}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    alert.severity === 'high'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {alert.severity.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sensor Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {sensorConfig.map((sensor) => {
          const Icon = sensor.icon;
          const value = getSensorValue(sensor.key);
          const status = getSensorStatus(sensor, value);
          
          return (
            <div
              key={sensor.key}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg ${sensor.bgColor}`}>
                  <Icon className={`h-6 w-6 ${sensor.color}`} />
                </div>
                <div className="flex items-center space-x-2">
                  {status === 'normal' && <CheckCircleIcon className="h-5 w-5 text-green-500" />}
                  {status === 'warning' && <ExclamationTriangleIcon className="h-5 w-5 text-orange-500" />}
                  {status === 'offline' && <div className="w-5 h-5 bg-gray-300 rounded-full" />}
                </div>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{sensor.name}</h3>
              <p className="text-sm text-gray-500 mb-3">{sensor.description}</p>
              
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-bold text-gray-900">
                  {value !== null && value !== undefined ? value.toFixed(1) : '--'}
                </span>
                <span className="text-lg text-gray-500">{sensor.unit}</span>
              </div>
              
              <div className="mt-3 text-sm text-gray-600">
                Normal: {sensor.normalRange[0]}-{sensor.normalRange[1]} {sensor.unit}
              </div>
              
              {/* Mini progress bar showing current value relative to normal range */}
              {value !== null && value !== undefined && (
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        status === 'normal' ? 'bg-green-500' : 'bg-orange-500'
                      }`}
                      style={{
                        width: `${Math.min(100, Math.max(0, 
                          ((value - sensor.normalRange[0]) / 
                           (sensor.normalRange[1] - sensor.normalRange[0])) * 100
                        ))}%`
                      }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Station Information */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">📋 Station Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">KLIMACEK_001</div>
            <div className="text-sm text-gray-600">Station ID</div>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {sensorConfig.filter(s => getSensorValue(s.key) !== null).length}/{sensorConfig.length}
            </div>
            <div className="text-sm text-gray-600">Sensors Active</div>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">99.9%</div>
            <div className="text-sm text-gray-600">Uptime</div>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">1 min</div>
            <div className="text-sm text-gray-600">Update Interval</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">⚡ Quick Actions</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow text-left">
            <div className="text-lg font-semibold text-gray-900">Export Data</div>
            <div className="text-sm text-gray-600">Download sensor readings</div>
          </button>
          
          <button className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow text-left">
            <div className="text-lg font-semibold text-gray-900">Configure Alerts</div>
            <div className="text-sm text-gray-600">Set up notifications</div>
          </button>
          
          <button className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow text-left">
            <div className="text-lg font-semibold text-gray-900">Calibrate Sensors</div>
            <div className="text-sm text-gray-600">Adjust sensor settings</div>
          </button>
          
          <button className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow text-left">
            <div className="text-lg font-semibold text-gray-900">View Reports</div>
            <div className="text-sm text-gray-600">Generate analytics</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default WeatherStation;
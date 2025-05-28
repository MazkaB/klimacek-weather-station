import React, { useState, useEffect } from 'react';
import { 
  CalendarIcon, 
  ChartBarIcon, 
  DocumentArrowDownIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const HistoricalData = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('7');
  const [selectedSensor, setSelectedSensor] = useState('temperature');
  const [chartType, setChartType] = useState('line');
  const [searchTerm, setSearchTerm] = useState('');
  const [statistics, setStatistics] = useState({});

  const sensors = [
    { key: 'humidity', name: 'Humidity', unit: '%' },
    { key: 'temperature', name: 'Temperature', unit: '°C' },
    { key: 'light_intensity', name: 'Light Intensity', unit: 'lux' },
    { key: 'rainfall', name: 'Rainfall', unit: 'mm' },
    { key: 'wind_speed', name: 'Wind Speed', unit: 'km/h' },
    { key: 'solar_voltage', name: 'Solar Voltage', unit: 'V' },
    { key: 'solar_wattage', name: 'Solar Wattage', unit: 'W' },
    { key: 'solar_current', name: 'Solar Current', unit: 'A' }
  ];

  useEffect(() => {
    fetchHistoricalData();
  }, [dateRange]);

  useEffect(() => {
    filterAndProcessData();
  }, [data, selectedSensor, searchTerm]);

  const fetchHistoricalData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/sensors/history?days=${dateRange}&limit=2000`);
      const result = await response.json();
      
      if (result.success) {
        const processedData = result.data.map(reading => ({
          ...reading,
          timestamp: new Date(reading.timestamp),
          dateString: new Date(reading.timestamp).toLocaleDateString(),
          timeString: new Date(reading.timestamp).toLocaleTimeString()
        }));
        
        setData(processedData);
        calculateStatistics(processedData);
      }
    } catch (error) {
      console.error('Error fetching historical data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndProcessData = () => {
    let filtered = data;

    // Apply search filter
    if (searchTerm) {
      const searchDate = new Date(searchTerm);
      if (!isNaN(searchDate)) {
        filtered = filtered.filter(reading => 
          reading.dateString.includes(searchTerm) || 
          reading.timeString.includes(searchTerm)
        );
      }
    }

    // Sort by timestamp
    filtered = filtered.sort((a, b) => a.timestamp - b.timestamp);

    setFilteredData(filtered);
  };

  const calculateStatistics = (dataSet) => {
    const stats = {};
    
    sensors.forEach(sensor => {
      const values = dataSet
        .map(reading => reading[sensor.key])
        .filter(val => val !== null && val !== undefined && !isNaN(val));
      
      if (values.length > 0) {
        stats[sensor.key] = {
          count: values.length,
          min: Math.min(...values),
          max: Math.max(...values),
          avg: values.reduce((sum, val) => sum + val, 0) / values.length,
          latest: values[values.length - 1]
        };
      }
    });
    
    setStatistics(stats);
  };

  const exportToCSV = () => {
    const csvContent = [
      // Header
      ['Timestamp', ...sensors.map(s => s.name)].join(','),
      // Data rows
      ...filteredData.map(reading => [
        reading.timestamp.toISOString(),
        ...sensors.map(s => reading[s.key] || '')
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `klimacek-historical-data-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getSensorColor = (sensor) => {
    const colors = {
      humidity: '#3B82F6',
      temperature: '#F97316',
      light_intensity: '#EAB308',
      rainfall: '#2563EB',
      wind_speed: '#6B7280',
      solar_voltage: '#10B981',
      solar_wattage: '#8B5CF6',
      solar_current: '#6366F1'
    };
    return colors[sensor] || '#3B82F6';
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length && payload[0].payload) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-300 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900">
            {new Date(label).toLocaleString()}
          </p>
          <p className="text-sm" style={{ color: getSensorColor(selectedSensor) }}>
            {sensors.find(s => s.key === selectedSensor)?.name}: {payload[0].value?.toFixed(2)} {sensors.find(s => s.key === selectedSensor)?.unit}
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-xl text-gray-600">Loading historical data...</p>
        </div>
      </div>
    );
  }

  const selectedSensorInfo = sensors.find(s => s.key === selectedSensor);
  const sensorStats = statistics[selectedSensor];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">📊 Historical Weather Data</h1>
        <p className="text-lg text-gray-600">
          Analyze past weather patterns and trends from your Klimacek station
        </p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <CalendarIcon className="h-4 w-4 inline mr-1" />
              Date Range
            </label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="1">Last 24 Hours</option>
              <option value="7">Last 7 Days</option>
              <option value="30">Last 30 Days</option>
              <option value="90">Last 3 Months</option>
            </select>
          </div>

          {/* Sensor Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <AdjustmentsHorizontalIcon className="h-4 w-4 inline mr-1" />
              Sensor
            </label>
            <select
              value={selectedSensor}
              onChange={(e) => setSelectedSensor(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {sensors.map(sensor => (
                <option key={sensor.key} value={sensor.key}>
                  {sensor.name}
                </option>
              ))}
            </select>
          </div>

          {/* Chart Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <ChartBarIcon className="h-4 w-4 inline mr-1" />
              Chart Type
            </label>
            <select
              value={chartType}
              onChange={(e) => setChartType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="line">Line Chart</option>
              <option value="bar">Bar Chart</option>
            </select>
          </div>

          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MagnifyingGlassIcon className="h-4 w-4 inline mr-1" />
              Search Date
            </label>
            <input
              type="date"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={exportToCSV}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <DocumentArrowDownIcon className="h-4 w-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      {sensorStats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-sm text-gray-600">Total Records</p>
            <p className="text-2xl font-bold text-blue-600">{sensorStats.count}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-sm text-gray-600">Minimum</p>
            <p className="text-2xl font-bold text-green-600">
              {sensorStats.min.toFixed(1)}{selectedSensorInfo.unit}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-sm text-gray-600">Maximum</p>
            <p className="text-2xl font-bold text-red-600">
              {sensorStats.max.toFixed(1)}{selectedSensorInfo.unit}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-sm text-gray-600">Average</p>
            <p className="text-2xl font-bold text-purple-600">
              {sensorStats.avg.toFixed(1)}{selectedSensorInfo.unit}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-sm text-gray-600">Latest</p>
            <p className="text-2xl font-bold text-gray-700">
              {sensorStats.latest.toFixed(1)}{selectedSensorInfo.unit}
            </p>
          </div>
        </div>
      )}

      {/* Chart */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {selectedSensorInfo?.name} Trends
        </h2>
        
        <div className="h-96">
          {filteredData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'line' ? (
                <LineChart data={filteredData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="timestamp"
                    tickFormatter={(timestamp) => new Date(timestamp).toLocaleDateString()}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `${value}${selectedSensorInfo.unit}`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey={selectedSensor}
                    stroke={getSensorColor(selectedSensor)}
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              ) : (
                <BarChart data={filteredData.slice(-50)}> {/* Show last 50 for bar chart */}
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="timestamp"
                    tickFormatter={(timestamp) => new Date(timestamp).toLocaleDateString()}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `${value}${selectedSensorInfo.unit}`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey={selectedSensor}
                    fill={getSensorColor(selectedSensor)}
                  />
                </BarChart>
              )}
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              <div className="text-center">
                <ChartBarIcon className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg">No data available for the selected period</p>
                <p className="text-sm">Try adjusting your date range or filters</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Readings</h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
                {sensors.map(sensor => (
                  <th key={sensor.key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {sensor.name} ({sensor.unit})
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.slice(-20).reverse().map((reading, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {reading.timestamp.toLocaleString()}
                  </td>
                  {sensors.map(sensor => (
                    <td key={sensor.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {reading[sensor.key] !== null && reading[sensor.key] !== undefined 
                        ? Number(reading[sensor.key]).toFixed(2) 
                        : '--'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HistoricalData;
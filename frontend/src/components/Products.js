import React, { useState } from 'react';
import { 
  CloudIcon, 
  SunIcon, 
  EyeIcon, 
  CloudIcon as RainIcon,
  ArrowPathIcon,
  BoltIcon,
  SignalIcon,
  Battery100Icon,
  CheckIcon,
  StarIcon,
  CpuChipIcon,
  WifiIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

const Products = () => {
  const [selectedProduct, setSelectedProduct] = useState('klimacek-pro');

  const products = [
    {
      id: 'klimacek-basic',
      name: 'Klimacek Basic',
      price: '$299',
      description: 'Perfect for home weather monitoring with essential sensors',
      image: '🌤️',
      sensors: [
        { name: 'Temperature Sensor', icon: SunIcon, included: true },
        { name: 'Humidity Sensor', icon: CloudIcon, included: true },
        { name: 'Light Intensity Sensor', icon: EyeIcon, included: true },
        { name: 'Rainfall Sensor', icon: RainIcon, included: false },
        { name: 'Wind Speed Sensor', icon: ArrowPathIcon, included: false },
        { name: 'Solar Voltage Monitor', icon: BoltIcon, included: false },
        { name: 'Solar Wattage Monitor', icon: SignalIcon, included: false },
        { name: 'Solar Current Monitor', icon: Battery100Icon, included: true }
      ],
      features: [
        'Real-time monitoring dashboard',
        '7-day data history',
        'Mobile app access',
        'Email alerts',
        'WiFi connectivity',
        '1-year warranty'
      ],
      specs: {
        'Data Logging': '1 week',
        'Update Frequency': '5 minutes',
        'Power Source': 'AC Adapter',
        'Connectivity': 'WiFi 2.4GHz',
        'Display': 'Web Dashboard',
        'API Access': 'Limited'
      }
    },
    {
      id: 'klimacek-pro',
      name: 'Klimacek Pro',
      price: '$599',
      description: 'Professional weather station with comprehensive monitoring',
      image: '🌩️',
      popular: true,
      sensors: [
        { name: 'Temperature Sensor', icon: SunIcon, included: true },
        { name: 'Humidity Sensor', icon: CloudIcon, included: true },
        { name: 'Light Intensity Sensor', icon: EyeIcon, included: true },
        { name: 'Rainfall Sensor', icon: RainIcon, included: true },
        { name: 'Wind Speed Sensor', icon: ArrowPathIcon, included: true },
        { name: 'Solar Voltage Monitor', icon: BoltIcon, included: true },
        { name: 'Solar Wattage Monitor', icon: SignalIcon, included: false },
        { name: 'Solar Current Monitor', icon: Battery100Icon, included: false }
      ],
      features: [
        'Advanced AI predictions (30 days)',
        'Unlimited data history',
        'Mobile & web apps',
        'Real-time alerts & notifications',
        'WiFi + Ethernet connectivity',
        'Local data backup',
        'API access included',
        '2-year warranty'
      ],
      specs: {
        'Data Logging': 'Unlimited',
        'Update Frequency': '1 minute',
        'Power Source': 'Solar + Battery Backup',
        'Connectivity': 'WiFi + Ethernet',
        'Display': 'LCD + Web Dashboard',
        'API Access': 'Full REST API'
      }
    },
    {
      id: 'klimacek-enterprise',
      name: 'Klimacek Enterprise',
      price: '$1,299',
      description: 'Complete weather monitoring solution for agricultural and research applications',
      image: '⛈️',
      sensors: [
        { name: 'Temperature Sensor', icon: SunIcon, included: true },
        { name: 'Humidity Sensor', icon: CloudIcon, included: true },
        { name: 'Light Intensity Sensor', icon: EyeIcon, included: true },
        { name: 'Rainfall Sensor', icon: RainIcon, included: true },
        { name: 'Wind Speed Sensor', icon: ArrowPathIcon, included: true },
        { name: 'Solar Voltage Monitor', icon: BoltIcon, included: true },
        { name: 'Solar Wattage Monitor', icon: SignalIcon, included: true },
        { name: 'Solar Current Monitor', icon: Battery100Icon, included: true }
      ],
      features: [
        'Advanced LSTM AI predictions (60 days)',
        'Unlimited cloud storage',
        'Multi-platform apps',
        'Custom alert configurations',
        'Multiple connectivity options',
        'Automated data backup',
        'Full API & webhook support',
        'Remote monitoring dashboard',
        'Custom integrations',
        '3-year warranty + support'
      ],
      specs: {
        'Data Logging': 'Unlimited Cloud',
        'Update Frequency': '30 seconds',
        'Power Source': 'Solar + UPS Backup',
        'Connectivity': 'WiFi + Ethernet + 4G',
        'Display': 'Touch Screen + Dashboard',
        'API Access': 'Enterprise API + Webhooks'
      }
    }
  ];

  const addOns = [
    {
      name: 'Weather Shield Pro',
      price: '$89',
      description: 'Advanced protection housing for extreme weather conditions',
      icon: ShieldCheckIcon
    },
    {
      name: 'Long Range WiFi Module',
      price: '$45',
      description: 'Extended range connectivity up to 1km',
      icon: WifiIcon
    },
    {
      name: 'AI Analytics Package',
      price: '$25/month',
      description: 'Advanced machine learning insights and custom predictions',
      icon: CpuChipIcon
    },
    {
      name: 'Mobile Alert System',
      price: '$15/month',
      description: 'SMS and push notifications for critical weather events',
      icon: SignalIcon
    }
  ];

  const selectedProductData = products.find(p => p.id === selectedProduct);

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          🏪 Our Weather Station Products
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Choose the perfect Klimacek weather monitoring solution for your needs. 
          From basic home monitoring to enterprise-grade agricultural applications.
        </p>
      </div>

      {/* Product Selection */}
      <div className="flex flex-wrap justify-center gap-4">
        {products.map((product) => (
          <button
            key={product.id}
            onClick={() => setSelectedProduct(product.id)}
            className={`relative px-6 py-3 rounded-lg font-medium transition-all ${
              selectedProduct === product.id
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-500'
            }`}
          >
            {product.popular && (
              <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                Popular
              </div>
            )}
            <span className="text-2xl mr-2">{product.image}</span>
            {product.name}
          </button>
        ))}
      </div>

      {/* Selected Product Details */}
      {selectedProductData && (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white p-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="text-center md:text-left mb-4 md:mb-0">
                <div className="text-6xl mb-4">{selectedProductData.image}</div>
                <h2 className="text-3xl font-bold mb-2">{selectedProductData.name}</h2>
                <p className="text-xl opacity-90">{selectedProductData.description}</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">{selectedProductData.price}</div>
                <div className="text-sm opacity-80">One-time purchase</div>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Sensors */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">📡 Included Sensors</h3>
                <div className="space-y-3">
                  {selectedProductData.sensors.map((sensor, index) => {
                    const Icon = sensor.icon;
                    return (
                      <div key={index} className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${
                          sensor.included ? 'bg-green-100' : 'bg-gray-100'
                        }`}>
                          <Icon className={`h-5 w-5 ${
                            sensor.included ? 'text-green-600' : 'text-gray-400'
                          }`} />
                        </div>
                        <span className={`${
                          sensor.included ? 'text-gray-900' : 'text-gray-400'
                        }`}>
                          {sensor.name}
                        </span>
                        {sensor.included ? (
                          <CheckIcon className="h-5 w-5 text-green-600" />
                        ) : (
                          <span className="text-sm text-gray-400">(Optional)</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Features */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">✨ Features</h3>
                <div className="space-y-2">
                  {selectedProductData.features.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <CheckIcon className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Specifications */}
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">📋 Technical Specifications</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(selectedProductData.specs).map(([key, value]) => (
                  <div key={key} className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm font-medium text-gray-600">{key}</div>
                    <div className="text-lg text-gray-900">{value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Purchase Actions */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Order Now
              </button>
              <button className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:border-blue-500 transition-colors font-medium">
                Request Quote
              </button>
              <button className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:border-blue-500 transition-colors font-medium">
                Download Specs
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add-ons */}
      <div className="bg-gray-50 rounded-xl p-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">🔧 Add-ons & Services</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addOns.map((addon, index) => {
            const Icon = addon.icon;
            return (
              <div key={index} className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Icon className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{addon.name}</h3>
                      <span className="text-lg font-bold text-blue-600">{addon.price}</span>
                    </div>
                    <p className="text-gray-600 mb-4">{addon.description}</p>
                    <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                      Add to Cart →
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Comparison Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gray-50 px-8 py-4">
          <h2 className="text-2xl font-bold text-gray-900">📊 Product Comparison</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Feature</th>
                {products.map(product => (
                  <th key={product.id} className="px-6 py-4 text-center text-sm font-medium text-gray-500">
                    {product.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">Price</td>
                {products.map(product => (
                  <td key={product.id} className="px-6 py-4 text-center text-sm text-gray-900">
                    {product.price}
                  </td>
                ))}
              </tr>
              <tr className="bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">Sensors</td>
                {products.map(product => (
                  <td key={product.id} className="px-6 py-4 text-center text-sm text-gray-900">
                    {product.sensors.filter(s => s.included).length}/8
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">AI Predictions</td>
                {products.map(product => (
                  <td key={product.id} className="px-6 py-4 text-center text-sm text-gray-900">
                    {product.id === 'klimacek-basic' ? '❌' : 
                     product.id === 'klimacek-pro' ? '30 days' : '60 days'}
                  </td>
                ))}
              </tr>
              <tr className="bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">Data History</td>
                {products.map(product => (
                  <td key={product.id} className="px-6 py-4 text-center text-sm text-gray-900">
                    {product.specs['Data Logging']}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">API Access</td>
                {products.map(product => (
                  <td key={product.id} className="px-6 py-4 text-center text-sm text-gray-900">
                    {product.specs['API Access']}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Contact for Custom Solutions */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl text-white p-8 text-center">
        <h2 className="text-3xl font-bold mb-4">🛠️ Need a Custom Solution?</h2>
        <p className="text-lg opacity-90 mb-6">
          We can customize our weather stations for specific applications including 
          agriculture, research, industrial monitoring, and more.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors font-medium">
            Contact Sales Team
          </button>
          <button className="px-8 py-3 border border-white text-white rounded-lg hover:bg-white hover:text-blue-600 transition-colors font-medium">
            Schedule Demo
          </button>
        </div>
      </div>
    </div>
  );
};

export default Products;
# Klimacek Weather Station 🌤️

A modern weather monitoring system with real-time sensor data visualization and AI-powered forecasting using LSTM neural networks.

## Features

- **Real-time Monitoring**: 8 different weather sensors with live data updates
- **AI Forecasting**: LSTM-based predictions for next 30 days
- **Interactive Dashboard**: Beautiful charts and graphs
- **Historical Data**: Access to past weather records
- **User Authentication**: Secure login/signup system
- **Responsive Design**: Works on desktop, tablet, and mobile

## Technology Stack

### Frontend
- React.js 18+
- Tailwind CSS
- Recharts for data visualization
- Supabase for authentication

### Backend
- Flask
- TensorFlow/Keras for LSTM models
- NumPy & Pandas for data processing
- Supabase integration

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- Python 3.8+
- Git

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd klimacek-weather-station
```

2. **Setup Backend**
```bash
cd backend
pip install -r ../requirements.txt
python app.py
```

3. **Setup Frontend**
```bash
cd frontend
npm install
npm start
```

4. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Configuration

### Supabase Setup
The application uses Supabase for authentication and data storage. The configuration is already set up with:
- URL: `https://bfiifppytbirvgcytbze.supabase.co`
- API Key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### Database Schema
Create the following table in your Supabase dashboard:

```sql
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
  solar_current REAL
);
```

## Sensors

The system monitors 8 different sensors:

1. **Humidity Sensor** - Air moisture percentage
2. **Temperature Sensor** - Ambient temperature in °C
3. **Light Intensity Sensor** - Light levels in lux
4. **Rainfall Sensor** - Precipitation in mm
5. **Wind Speed Sensor** - Wind velocity in km/h
6. **Solar Cell Voltage** - Solar panel voltage in V
7. **Solar Cell Wattage** - Solar panel power in W
8. **Solar Cell Current** - Solar panel current in A

## API Endpoints

### Data Endpoints
- `GET /api/sensors/current` - Current sensor readings
- `GET /api/sensors/history` - Historical data
- `GET /api/predictions` - LSTM predictions

### ML Endpoints
- `POST /api/train-model` - Train LSTM model
- `GET /api/model/status` - Model training status

## Development

### Running in Development Mode

**Backend:**
```bash
cd backend
export FLASK_ENV=development
python app.py
```

**Frontend:**
```bash
cd frontend
npm start
```

### Building for Production

**Frontend:**
```bash
cd frontend
npm run build
```

## Team

### KlimaStation Team
- **Aditya Wisnu Yudha Marsudi** - Business & Marketing Hustler
- **Mazka Buana Hidayat** - Technologist & Product Developer
- **Desnia Anindy Irni Hareva** - Designer & Branding
- **Pramudya Jesril Pratama** - Operations & Process Management
- **Divya Zahranika** - Financial & Administrative Manager

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@klimacek.com or join our Slack channel.

---

Made with ❤️ by the KlimaStation Team
import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  CloudSun,
  Droplets,
  Thermometer,
  Wind,
  Sun,
  Cloud,
  CloudRain,
  CloudLightning,
  Gauge,
  Eye,
  CloudDrizzle,
  Sunrise,
  Sunset,
} from "lucide-react"

// Map icon names to Lucide components
const iconMap: { [key: string]: React.ElementType } = {
  CloudSun,
  Droplets,
  Thermometer,
  Wind,
  Sun,
  Cloud,
  CloudRain,
  CloudLightning,
  Gauge,
  Eye,
  CloudDrizzle,
  Sunrise,
  Sunset,
}

interface WeatherCondition {
  text: string
  icon: string
  code: number
}

interface CurrentWeather {
  temp_c: number
  feelslike_c: number
  is_day: number
  condition: WeatherCondition
  wind_kph: number
  wind_dir: string
  gust_kph: number
  humidity: number
  cloud: number
  pressure_mb: number
  precip_mm: number
  vis_km: number
  uv: number
}

interface LocationInfo {
  name: string
  region: string
  country: string
  lat: number
  lon: number
  tz_id: string
  localtime: string
}

interface WeatherCardProps {
  data: {
    location: LocationInfo
    current: CurrentWeather
  }
}

// Weather animation component
function WeatherAnimation({ condition }: { condition: WeatherCondition }) {
  const icon = condition.icon

  // Sunny
  if (icon === "Sun") {
    return (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <svg width="120" height="120" className="animate-spin-slow opacity-30" style={{ filter: 'blur(1px)' }}>
          <circle cx="60" cy="60" r="30" fill="#fde047" />
          {[...Array(12)].map((_, i) => (
            <rect
              key={i}
              x="58"
              y="10"
              width="4"
              height="20"
              fill="#fde047"
              transform={`rotate(${i * 30} 60 60)`}
              opacity="0.7"
            />
          ))}
        </svg>
      </div>
    )
  }
  // Rainy
  if (icon === "CloudRain") {
    return (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <svg width="120" height="120">
          {[...Array(8)].map((_, i) => (
            <rect
              key={i}
              x={30 + i * 8}
              y={70 + (i % 2) * 8}
              width="3"
              height="18"
              rx="1.5"
              fill="#38bdf8"
              className="animate-raindrop"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </svg>
        <style>{`
          @keyframes raindrop {
            0% { opacity: 0; transform: translateY(-10px); }
            20% { opacity: 1; }
            100% { opacity: 0; transform: translateY(30px); }
          }
          .animate-raindrop {
            animation: raindrop 1.2s linear infinite;
          }
        `}</style>
      </div>
    )
  }
  // Stormy
  if (icon === "CloudLightning") {
    return (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <svg width="120" height="120">
          <polygon
            points="60,80 70,80 65,95 75,95 60,115 67,95 60,95"
            fill="#facc15"
            className="animate-lightning"
            opacity="0.7"
          />
        </svg>
        <style>{`
          @keyframes lightning {
            0%, 97%, 100% { opacity: 0.2; }
            98% { opacity: 1; }
          }
          .animate-lightning {
            animation: lightning 2s infinite;
          }
        `}</style>
      </div>
    )
  }
  // Dusty
  if (icon === "Cloud") {
    return (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <svg width="120" height="120">
          {[...Array(10)].map((_, i) => (
            <circle
              key={i}
              cx={30 + Math.random() * 60}
              cy={80 + Math.random() * 20}
              r={2 + Math.random() * 2}
              fill="#fbbf24"
              opacity="0.2"
              className="animate-dust"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </svg>
        <style>{`
          @keyframes dust {
            0% { opacity: 0.2; transform: translateY(0); }
            50% { opacity: 0.4; transform: translateY(-8px); }
            100% { opacity: 0.2; transform: translateY(0); }
          }
          .animate-dust {
            animation: dust 2.5s ease-in-out infinite;
          }
        `}</style>
      </div>
    )
  }
  // Default: no animation
  return null
}

export function WeatherCard({ data }: WeatherCardProps) {
  const { location, current } = data
  const conditionIcon = current.condition?.icon || "CloudSun"
  const WeatherIcon = iconMap[conditionIcon] || CloudSun // Default to CloudSun if icon not found

  return (
    <Card className="bg-white/30 backdrop-blur-lg shadow-lg rounded-xl overflow-hidden border border-white/50">
      <CardHeader className="flex flex-row items-center justify-between pb-2 sm:pb-4">
        <CardTitle className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-800">
          {location.name}, {location.country}
        </CardTitle>
        <span className="text-xs sm:text-sm text-gray-600">Current Weather</span>
      </CardHeader>
      <CardContent className="grid gap-3 sm:gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 relative">
          {/* Weather Animation Background */}
          <WeatherAnimation condition={current.condition} />
          <div className="flex items-center gap-2 sm:gap-4 z-10 relative">
            {WeatherIcon && <WeatherIcon className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 text-sky-600" />}
            <div className="text-4xl sm:text-5xl lg:text-7xl font-bold text-gray-900">{current.temp_c}°C</div>
          </div>
          <div className="text-center sm:text-right z-10 relative">
            <div className="text-lg sm:text-xl lg:text-2xl font-medium text-gray-700">{current.condition.text}</div>
            <div className="text-xs sm:text-sm text-gray-500">Feels like: {current.feelslike_c}°C</div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm text-gray-700">
          <div className="flex items-center gap-2">
            <Wind className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 flex-shrink-0" />
            <span className="truncate">Wind: {current.wind_kph} km/h ({current.wind_dir})</span>
          </div>
          <div className="flex items-center gap-2">
            <Droplets className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 flex-shrink-0" />
            <span className="truncate">Humidity: {current.humidity}%</span>
          </div>
          <div className="flex items-center gap-2">
            <Gauge className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 flex-shrink-0" />
            <span className="truncate">Pressure: {current.pressure_mb} mb</span>
          </div>
          <div className="flex items-center gap-2">
            <CloudDrizzle className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 flex-shrink-0" />
            <span className="truncate">Precipitation: {current.precip_mm} mm</span>
          </div>
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 flex-shrink-0" />
            <span className="truncate">Visibility: {current.vis_km} km</span>
          </div>
          <div className="flex items-center gap-2">
            <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 flex-shrink-0" />
            <span className="truncate">UV Index: {current.uv}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

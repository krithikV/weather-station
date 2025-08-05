import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { CloudSun, Sun, Cloud, CloudRain, CloudLightning, Droplets, Wind, CloudDrizzle } from "lucide-react"

interface ForecastCondition {
  text: string
  icon: string
  code: number
}

interface DailyForecast {
  maxtemp_c: number
  mintemp_c: number
  avgtemp_c: number
  maxwind_kph: number
  totalprecip_mm: number
  avghumidity: number
  daily_will_it_rain: number
  daily_chance_of_rain: number
  condition: ForecastCondition
  uv: number
}

interface HourlyForecast {
  time: string
  temp_c: number
  feelslike_c: number
  wind_kph: number
  wind_dir: string
  gust_kph: number
  pressure_mb: number
  humidity: number
  cloud: number
  chance_of_rain: number
  precip_mm: number
  condition: ForecastCondition
  uv: number
}

interface ForecastDay {
  date: string
  day: DailyForecast
  hour: HourlyForecast[] // Array of hourly forecasts
}

interface ForecastCardProps {
  forecast: ForecastDay[]
}

// Map icon names to Lucide components
const iconMap: { [key: string]: React.ElementType } = {
  CloudSun,
  Sun,
  Cloud,
  CloudRain,
  CloudLightning,
  Droplets,
  Wind,
  CloudDrizzle,
}

export function ForecastTabs({ forecast }: ForecastCardProps) {
  if (!forecast || forecast.length === 0) {
    return (
      <Card className="bg-white/30 backdrop-blur-lg shadow-lg rounded-xl overflow-hidden border border-white/50">
        <CardContent className="p-6">
          <p className="text-gray-600 text-center">Forecast data not available</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Tabs defaultValue={forecast[0]?.date} className="w-full">
      <TabsList className="mb-4">
        {forecast.map((day) => {
          const date = new Date(day.date)
          const dayName = date.toLocaleDateString("en-US", { weekday: "short" })
          return (
            <TabsTrigger key={day.date} value={day.date}>
              {dayName}
            </TabsTrigger>
          )
        })}
      </TabsList>
      {forecast.map((day) => {
        // Handle both icon string and condition object
        const conditionIcon = day.day.condition?.icon || "CloudSun"
        const ForecastIcon = iconMap[conditionIcon] || CloudSun
        const date = new Date(day.date)
        const dayName = date.toLocaleDateString("en-US", { weekday: "long" })
        return (
          <TabsContent key={day.date} value={day.date}>
            <Card className="bg-white/30 backdrop-blur-lg shadow-lg rounded-xl overflow-hidden border border-white/50">
              <CardHeader className="pb-2 sm:pb-4">
                <CardTitle className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-800">
                  {dayName} ({day.date})
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  {ForecastIcon && <ForecastIcon className="w-10 h-10 text-sky-500" />}
                  <div className="text-xl font-bold text-gray-900">
                    {day.day.maxtemp_c}°C / {day.day.mintemp_c}°C
                  </div>
                  {day.day.daily_will_it_rain === 1 && day.day.daily_chance_of_rain > 0 && (
                    <div className="flex items-center gap-1 text-blue-600">
                      <Droplets className="w-4 h-4" />
                      {day.day.daily_chance_of_rain}%
                    </div>
                  )}
                </div>
                <Separator className="bg-gray-200" />
                <div className="grid grid-cols-2 gap-3 text-sm text-gray-700">
                  <div>Avg Temp: <span className="font-medium">{day.day.avgtemp_c}°C</span></div>
                  <div>Max Wind: <span className="font-medium">{day.day.maxwind_kph} km/h</span></div>
                  <div>Precipitation: <span className="font-medium">{day.day.totalprecip_mm} mm</span></div>
                  <div>Humidity: <span className="font-medium">{day.day.avghumidity}%</span></div>
                  <div>UV Index: <span className="font-medium">{day.day.uv}</span></div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )
      })}
    </Tabs>
  )
}

// Keep the original ForecastCard for fallback use
export function ForecastCard({ forecast }: ForecastCardProps) {
  if (!forecast || forecast.length === 0) {
    return (
      <Card className="bg-white/30 backdrop-blur-lg shadow-lg rounded-xl overflow-hidden border border-white/50">
        <CardContent className="p-6">
          <p className="text-gray-600 text-center">Forecast data not available</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white/30 backdrop-blur-lg shadow-lg rounded-xl overflow-hidden border border-white/50">
      <CardHeader className="pb-2 sm:pb-4">
        <CardTitle className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-800">7-Day Forecast</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2 sm:gap-4">
        {forecast.map((dayData, index) => {
          const conditionIcon = dayData.day.condition?.icon || "CloudSun"
          const ForecastIcon = iconMap[conditionIcon] || CloudSun // Default icon
          const date = new Date(dayData.date)
          const dayName = date.toLocaleDateString("en-US", { weekday: "short" })

          return (
            <div key={dayData.date}>
              <div className="flex items-center justify-between py-2 sm:py-3">
                <span className="font-medium text-gray-700 text-sm sm:text-base">{dayName}</span>
                <div className="flex items-center gap-1 sm:gap-2">
                  {ForecastIcon && <ForecastIcon className="w-5 h-5 sm:w-6 sm:h-6 text-sky-500 flex-shrink-0" />}
                  <span className="text-gray-600 text-sm sm:text-base">
                    {dayData.day.maxtemp_c}°C / {dayData.day.mintemp_c}°C
                  </span>
                </div>
                {dayData.day.daily_will_it_rain === 1 && dayData.day.daily_chance_of_rain > 0 && (
                  <div className="flex items-center gap-1 text-xs sm:text-sm text-blue-600">
                    <Droplets className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                    {dayData.day.daily_chance_of_rain}%
                  </div>
                )}
              </div>
              {index < forecast.length - 1 && <Separator className="bg-gray-200" />}
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}

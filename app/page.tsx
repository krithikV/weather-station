"use client"

import { useState, useEffect } from "react"
import { WeatherCard } from "@/components/weather-card"
import { ForecastTabs } from "@/components/forecast-card"
import { SearchInput } from "@/components/search-input"
import { AstronomyCard } from "@/components/astronomy-card"
import { getCurrentWeather, getForecast, getAstronomy } from "@/lib/weather-api"
import React from "react"

// Function to determine background based on WeatherAPI condition
function getWeatherBackground(condition: { text: string; code: number }, is_day: number): string {
  const text = condition.text.toLowerCase()
  const code = condition.code

  // Night conditions
  if (is_day === 0) {
    return "/night.png"
  }

  // Sunny conditions
  if (code === 1000 || text.includes("sunny") || text.includes("clear")) {
    return "/sunny.png"
  }

  // Rainy conditions
  if (
    code >= 1063 && code <= 1207 || // Rain codes
    text.includes("rain") || 
    text.includes("drizzle") ||
    text.includes("shower")
  ) {
    return "/rainy.png"
  }

  // Stormy conditions
  if (
    code >= 1087 && code <= 1087 || // Thunder codes
    code >= 1273 && code <= 1276 || // Thunder codes
    text.includes("thunder") ||
    text.includes("storm") ||
    text.includes("lightning")
  ) {
    return "/stormy.png"
  }

  // Cloudy conditions (including mist/fog)
  if (
    code >= 1003 && code <= 1009 || // Cloud codes
    code >= 1005 && code <= 1005 || // Mist codes
    code >= 1030 && code <= 1030 || // Mist codes
    text.includes("cloud") ||
    text.includes("overcast") ||
    text.includes("partly cloudy") ||
    text.includes("mist") ||
    text.includes("fog") ||
    text.includes("haze")
  ) {
    return "/cloudy.png"
  }

  // Snow conditions (use stormy background)
  if (
    code >= 1066 && code <= 1230 || // Snow codes
    text.includes("snow") ||
    text.includes("sleet")
  ) {
    return "/stormy.png"
  }

  // Default to sunny
  return "/sunny.png"
}

// WeatherBackground component for full-page animated weather backgrounds
function WeatherBackground({ condition, is_day }: { condition: { text: string; code: number }; is_day: number }) {
  const backgroundImage = getWeatherBackground(condition, is_day)

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none w-full h-full">
      <img
        src={backgroundImage}
        alt={`${condition.text} background`}
        className="w-full h-full object-cover object-center opacity-80"
        style={{ minHeight: '100vh', minWidth: '100vw' }}
      />
    </div>
  )
}

// Function to get current location and reverse geocode to city name
async function getCurrentLocation(): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser"))
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords
          
          // Use reverse geocoding to get city name from coordinates
          const response = await fetch(
            `https://api.weatherapi.com/v1/search.json?key=523d5d69a18b4665a64111528250508&q=${latitude},${longitude}`
          )
          
          if (!response.ok) {
            throw new Error("Failed to get location name")
          }
          
          const data = await response.json()
          if (data && data.length > 0) {
            resolve(data[0].name)
          } else {
            // Fallback to coordinates if reverse geocoding fails
            resolve(`${latitude},${longitude}`)
          }
        } catch (error) {
          console.error("Error getting location name:", error)
          // Fallback to coordinates
          const { latitude, longitude } = position.coords
          resolve(`${latitude},${longitude}`)
        }
      },
      (error) => {
        console.error("Geolocation error:", error)
        reject(error)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    )
  })
}

// Function to get location from IP address
async function getLocationFromIP(): Promise<string> {
  try {
    const response = await fetch('https://ipapi.co/json/')
    
    if (!response.ok) {
      throw new Error("Failed to get IP location")
    }
    
    const data = await response.json()
    
    // Try to get city name, fallback to coordinates
    if (data.city && data.region) {
      return `${data.city}, ${data.region}`
    } else if (data.latitude && data.longitude) {
      return `${data.latitude},${data.longitude}`
    } else {
      throw new Error("No location data from IP")
    }
  } catch (error) {
    console.error("Error getting IP location:", error)
    throw error
  }
}

export default function HomePage() {
  // State for weather data
  const [currentWeather, setCurrentWeather] = useState<any>(null)
  const [forecastData, setForecastData] = useState<any[]>([])
  const [astronomyData, setAstronomyData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [locationPermission, setLocationPermission] = useState<"granted" | "denied" | "pending">("pending")

  // Load initial weather data for current location or fallback to London
  useEffect(() => {
    const loadInitialWeather = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        let location = "London" // Default fallback
        
        // Try to get current location
        try {
          setLocationPermission("pending")
          location = await getCurrentLocation()
          setLocationPermission("granted")
        } catch (geoError) {
          console.error("Error getting current location:", geoError)
          setLocationPermission("denied")
          
          // Try IP-based location as fallback
          try {
            console.log("Trying IP-based location...")
            location = await getLocationFromIP()
            console.log("IP location found:", location)
          } catch (ipError) {
            console.error("Error getting IP location:", ipError)
            // Continue with default location (London)
          }
        }
        
        const [weather, forecast, astronomy] = await Promise.all([
          getCurrentWeather(location),
          getForecast(location),
          getAstronomy(location)
        ])
        
        setCurrentWeather(weather)
        setForecastData(forecast)
        setAstronomyData(astronomy)
      } catch (error) {
        console.error("Error loading initial weather:", error)
        setError("Failed to load weather data. Please try again.")
        // Fallback to dummy data if API fails
        setCurrentWeather({
          location: {
            name: "London",
            region: "England",
            country: "UK",
            lat: 51.5074,
            lon: -0.1278,
            tz_id: "Europe/London",
            localtime: "2025-08-05 16:00",
          },
          current: {
            temp_c: 22,
            feelslike_c: 21,
            is_day: 1,
            condition: {
              text: "Partly Cloudy",
              icon: "CloudSun",
              code: 1003,
            },
            wind_kph: 10,
            wind_dir: "NW",
            gust_kph: 15,
            humidity: 65,
            cloud: 50,
            pressure_mb: 1012,
            precip_mm: 0,
            vis_km: 10,
            uv: 5,
          },
        })
        setForecastData([])
        setAstronomyData({
          location: {
            name: "London",
            region: "England",
            country: "UK",
          },
          astronomy: {
            astro: {
              sunrise: "06:00 AM",
              sunset: "08:00 PM",
              moonrise: "09:00 PM",
              moonset: "07:00 AM",
              moon_phase: "Waxing Gibbous",
              moon_illumination: "85",
            },
          },
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadInitialWeather()
  }, [])

  // Handle weather data updates from search
  const handleWeatherUpdate = (weather: any, forecast: any[], astronomy: any) => {
    console.log("Search results received:", { weather, forecast, astronomy })
    
    try {
      setCurrentWeather(weather)
      setForecastData(forecast)
      setAstronomyData(astronomy)
      setError(null)
      
      console.log("Weather data updated successfully")
    } catch (error) {
      console.error("Error updating weather data:", error)
      setError("Failed to update weather data. Please try again.")
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-100 to-blue-200 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-sky-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {locationPermission === "pending" ? "Getting your location..." : "Loading weather data..."}
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-100 to-blue-200 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">⚠️</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      {currentWeather && (
        <WeatherBackground 
          condition={currentWeather.current.condition}
          is_day={currentWeather.current.is_day} 
        />
      )}
      <div className="min-h-screen p-3 sm:p-4 md:p-6 lg:p-8 xl:p-12 relative z-10">
        <div className="max-w-7xl mx-auto w-full flex flex-col gap-6">
          {/* Header Section */}
          <div className="text-center mb-4 sm:mb-6 lg:mb-8">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-4 sm:mb-6">
              Weather Dashboard
            </h1>
            <SearchInput onWeatherUpdate={handleWeatherUpdate} />
            {locationPermission === "denied" && (
              <p className="text-sm text-gray-500 mt-2">
                Location access denied. Using IP-based location.
              </p>
            )}
          </div>

          {/* Top Row: Current Weather & Astronomy Side by Side on Desktop */}
          <div className="w-full flex flex-col lg:flex-row gap-4 lg:gap-8">
            <div className="flex-1 min-w-0">
              {currentWeather && <WeatherCard data={currentWeather} />}
            </div>
            <div className="flex-1 min-w-0">
              {astronomyData && (
                <div className="bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 rounded-2xl shadow-xl p-6 border border-white/60 h-full flex items-stretch">
                  <AstronomyCard data={astronomyData} />
                </div>
              )}
            </div>
          </div>

          {/* Forecast Tabs Section */}
          <div className="w-full">
            {forecastData.length > 0 && <ForecastTabs forecast={forecastData} />}
          </div>
        </div>
      </div>
    </>
  )
}

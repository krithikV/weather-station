"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Loader2 } from "lucide-react"
import { getCurrentWeather, getForecast, getAstronomy } from "@/lib/weather-api"

interface SearchInputProps {
  onWeatherUpdate?: (weather: any, forecast: any[], astronomy: any) => void
}

export function SearchInput({ onWeatherUpdate }: SearchInputProps) {
  const [location, setLocation] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async () => {
    if (!location.trim()) {
      setError("Please enter a location")
      return
    }

    setIsLoading(true)
    setError(null)
    
    try {
      const [weather, forecast, astronomy] = await Promise.all([
        getCurrentWeather(location),
        getForecast(location),
        getAstronomy(location)
      ])
      
      if (onWeatherUpdate) {
        onWeatherUpdate(weather, forecast, astronomy)
      }
      
      // Clear the input after successful search
      setLocation("")
    } catch (error) {
      console.error("Error fetching weather data:", error)
      setError("Location not found. Please try a different city or zip code.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSearch()
    }
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex w-full max-w-sm sm:max-w-md lg:max-w-lg mx-auto items-center space-x-2 bg-white/30 backdrop-blur-lg p-2 sm:p-3 rounded-lg shadow-md border border-white/50">
        <Input
          type="text"
          placeholder="Enter city or zip code..."
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 border-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent text-gray-800 placeholder:text-gray-600 text-sm sm:text-base"
          disabled={isLoading}
        />
        <Button 
          type="submit" 
          onClick={handleSearch} 
          className="bg-sky-600 hover:bg-sky-700 text-white p-2 sm:p-3"
          size="sm"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
          ) : (
            <Search className="w-4 h-4 sm:w-5 sm:h-5" />
          )}
          <span className="sr-only">Search</span>
        </Button>
      </div>
      {error && (
        <div className="text-red-500 text-sm bg-red-50 px-3 py-1 rounded-md">
          {error}
        </div>
      )}
    </div>
  )
}

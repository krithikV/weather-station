const API_KEY = "523d5d69a18b4665a64111528250508"
const BASE_URL = "https://api.weatherapi.com/v1"

// Helper function to make API calls with better error handling
async function makeWeatherAPICall(endpoint: string, params: Record<string, string>): Promise<any> {
  // Ensure HTTPS is always used
  const baseUrl = BASE_URL.startsWith('https://') ? BASE_URL : BASE_URL.replace('http://', 'https://')
  const url = new URL(`${baseUrl}${endpoint}`)
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value)
  })
  
  // Add cache-busting parameter to force fresh requests
  url.searchParams.append('_t', Date.now().toString())

  console.log("Making API call to:", url.toString())

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'WeatherStation/1.0',
        'Cache-Control': 'no-cache'
      },
      signal: controller.signal
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Weather API error ${response.status}:`, errorText)
      
      if (response.status === 401) {
        throw new Error("Invalid API key")
      } else if (response.status === 429) {
        throw new Error("API rate limit exceeded")
      } else if (response.status >= 500) {
        throw new Error("Weather service temporarily unavailable")
      } else {
        throw new Error(`Weather API error: ${response.status}`)
      }
    }

    const data = await response.json()
    
    // Check for API error responses
    if (data.error) {
      throw new Error(data.error.message || "Weather API error")
    }

    return data
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error("Request timeout - weather service is slow")
      }
      // Check for mixed content errors
      if (error.message.includes('Mixed Content') || error.message.includes('insecure resource')) {
        throw new Error("HTTPS required - please use secure connection")
      }
      throw error
    }
    throw new Error("Network error - please check your connection")
  }
}

export async function getCurrentWeather(location: string) {
  try {
    const data = await makeWeatherAPICall('/current.json', {
      key: API_KEY,
      q: location,
      aqi: 'no'
    })
    
    return data
  } catch (error) {
    console.error("Error fetching current weather:", error)
    throw error
  }
}

export async function getForecast(location: string) {
  try {
    const data = await makeWeatherAPICall('/forecast.json', {
      key: API_KEY,
      q: location,
      days: '7',
      aqi: 'no',
      alerts: 'no'
    })
    
    return data.forecast.forecastday
  } catch (error) {
    console.error("Error fetching forecast:", error)
    throw error
  }
}

export async function getAstronomy(location: string) {
  try {
    const today = new Date().toISOString().split('T')[0]
    const data = await makeWeatherAPICall('/astronomy.json', {
      key: API_KEY,
      q: location,
      dt: today
    })
    
    return data
  } catch (error) {
    console.error("Error fetching astronomy:", error)
    throw error
  }
}

export async function searchLocation(query: string) {
  try {
    const data = await makeWeatherAPICall('/search.json', {
      key: API_KEY,
      q: query
    })
    
    return data
  } catch (error) {
    console.error("Error searching location:", error)
    throw error
  }
} 
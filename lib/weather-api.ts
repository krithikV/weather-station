const API_KEY = "523d5d69a18b4665a64111528250508"
const BASE_URL = "http://api.weatherapi.com/v1"

export async function getCurrentWeather(location: string) {
  try {
    const response = await fetch(
      `${BASE_URL}/current.json?key=${API_KEY}&q=${encodeURIComponent(location)}&aqi=no`
    )
    
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`)
    }
    
    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching current weather:", error)
    throw error
  }
}

export async function getForecast(location: string) {
  try {
    const response = await fetch(
      `${BASE_URL}/forecast.json?key=${API_KEY}&q=${encodeURIComponent(location)}&days=7&aqi=no&alerts=no`
    )
    
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`)
    }
    
    const data = await response.json()
    return data.forecast.forecastday
  } catch (error) {
    console.error("Error fetching forecast:", error)
    throw error
  }
}

export async function getAstronomy(location: string) {
  try {
    const response = await fetch(
      `${BASE_URL}/astronomy.json?key=${API_KEY}&q=${encodeURIComponent(location)}&dt=${new Date().toISOString().split('T')[0]}`
    )
    
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`)
    }
    
    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching astronomy:", error)
    throw error
  }
}

export async function searchLocation(query: string) {
  try {
    const response = await fetch(
      `${BASE_URL}/search.json?key=${API_KEY}&q=${encodeURIComponent(query)}`
    )
    
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`)
    }
    
    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error searching location:", error)
    throw error
  }
} 
import { Sunrise, Sunset, Moon, Sun } from "lucide-react"

interface AstronomyData {
  sunrise: string
  sunset: string
  moonrise: string
  moonset: string
  moon_phase: string
  moon_illumination: string
}

interface AstronomyCardProps {
  data: {
    location: {
      name: string
      region: string
      country: string
    }
    astronomy?: {
      astro: AstronomyData
    }
    // Real WeatherAPI structure
    astro?: AstronomyData
  }
}

// Function to get moon phase emoji based on phase name
function getMoonPhaseEmoji(phase: string): string {
  const phaseLower = phase.toLowerCase()
  
  if (phaseLower.includes("new")) return "🌑"
  if (phaseLower.includes("waxing crescent")) return "🌒"
  if (phaseLower.includes("first quarter")) return "🌓"
  if (phaseLower.includes("waxing gibbous")) return "🌔"
  if (phaseLower.includes("full")) return "🌕"
  if (phaseLower.includes("waning gibbous")) return "🌖"
  if (phaseLower.includes("last quarter") || phaseLower.includes("third quarter")) return "🌗"
  if (phaseLower.includes("waning crescent")) return "🌘"
  
  // Default fallback
  return "🌙"
}

export function AstronomyCard({ data }: AstronomyCardProps) {
  const { location } = data
  
  // Handle both dummy data structure and real API structure
  const astro = data.astronomy?.astro || data.astro

  if (!astro) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-2">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-2">
          Astronomy for {location.name}
        </h2>
        <p className="text-gray-600">Astronomy data not available</p>
      </div>
    )
  }

  // Moon phase component with emoji
  function MoonPhaseGraphic({ phase }: { phase: string }) {
    const moonEmoji = getMoonPhaseEmoji(phase)
    
    return (
      <div className="flex flex-col items-center">
        <div className="text-6xl mb-2">{moonEmoji}</div>
        <span className="text-base font-semibold text-gray-800 text-center">{phase}</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center gap-6 py-2">
      <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-2">
        Astronomy for {location.name}
      </h2>
      <div className="flex flex-col md:flex-row gap-8 w-full items-center justify-center">
        {/* Sun & Moon Times */}
        <div className="flex flex-col gap-4 items-center flex-1 min-w-[180px]">
          <div className="flex flex-col items-center gap-1">
            <Sunrise className="w-10 h-10 text-orange-500" />
            <span className="text-gray-700 font-medium">Sunrise</span>
            <span className="text-lg font-bold">{astro.sunrise}</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Sunset className="w-10 h-10 text-orange-700" />
            <span className="text-gray-700 font-medium">Sunset</span>
            <span className="text-lg font-bold">{astro.sunset}</span>
          </div>
        </div>
        {/* Moon Phase Graphic */}
        <div className="flex flex-col items-center flex-1 min-w-[180px]">
          <MoonPhaseGraphic phase={astro.moon_phase} />
          <span className="text-gray-600 mt-2">Moon Illumination: <span className="font-bold">{astro.moon_illumination}%</span></span>
        </div>
        {/* Moon Times */}
        <div className="flex flex-col gap-4 items-center flex-1 min-w-[180px]">
          <div className="flex flex-col items-center gap-1">
            <Moon className="w-10 h-10 text-blue-700" />
            <span className="text-gray-700 font-medium">Moonrise</span>
            <span className="text-lg font-bold">{astro.moonrise}</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Moon className="w-10 h-10 text-blue-900" />
            <span className="text-gray-700 font-medium">Moonset</span>
            <span className="text-lg font-bold">{astro.moonset}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

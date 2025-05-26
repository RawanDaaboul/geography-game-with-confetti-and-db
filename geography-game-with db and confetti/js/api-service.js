/**
 * API Services for the Country Comparisons Game
 */

// Import the configuration
import CONFIG from "./config.js"

/**
 * Fetch countries data from the API
 * @returns {Promise<Array>} Array of processed country objects
 */
export async function fetchCountriesData() {
  console.log("Fetching countries data...")
  try {
    const response = await fetch(CONFIG.COUNTRIES_API_URL)

    if (!response.ok) {
      throw new Error(`Failed to fetch countries data: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log(`Fetched ${data.length} countries`)

    // Filter and process countries data
    const filteredCountries = data
      .filter(
        (country) =>
          country.population > CONFIG.MIN_POPULATION &&
          (country.area || 0) > CONFIG.MIN_AREA &&
          country.name &&
          country.name.common &&
          country.flags &&
          (country.flags.png || country.flags.svg),
      )
      .map((country) => ({
        name: country.name.common,
        population: country.population,
        area: country.area || 0,
        flag: country.flags.png || country.flags.svg,
        code: country.cca3 || country.cca2 || "",
      }))

    console.log(`Filtered to ${filteredCountries.length} countries`)

    if (filteredCountries.length < 2) {
      throw new Error("Not enough countries with valid data")
    }

    return filteredCountries
  } catch (error) {
    console.error("Error fetching countries data:", error)
    throw error
  }
}

/**
 * Fetch GDP data from the World Bank API
 * @returns {Promise<Object>} Object mapping country codes to GDP values
 */
export async function fetchGDPData() {
  console.log("Fetching GDP data...")
  try {
    const response = await fetch(CONFIG.GDP_API_URL)

    if (!response.ok) {
      throw new Error(`Failed to fetch GDP data: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    if (!data || !data[1] || !Array.isArray(data[1])) {
      throw new Error("Invalid GDP data format")
    }

    console.log(`Fetched GDP data for ${data[1].length} countries`)

    // Process GDP data into a map of country code -> GDP value
    const gdpMap = {}
    data[1].forEach((item) => {
      if (item.value !== null) {
        gdpMap[item.country.id] = item.value
      }
    })

    return gdpMap
  } catch (error) {
    console.error("Error fetching GDP data:", error)
    // Return empty object as fallback
    return {}
  }
}

/**
 * Merge GDP data with countries
 * @param {Array} countries - Array of country objects
 * @param {Object} gdpData - Object mapping country codes to GDP values
 * @returns {Array} Countries with GDP data added
 */
export function mergeGDPData(countries, gdpData) {
  console.log("Merging GDP data with countries...")

  // For countries without GDP data, assign a reasonable estimate based on population
  return countries
    .map((country) => {
      // Try to find GDP by country code
      let gdp = gdpData[country.code]

      // If no GDP found, estimate based on population (very rough estimate)
      if (!gdp && country.population) {
        // Rough estimate: $10,000 per person on average
        gdp = country.population * 10000
      }

      return {
        ...country,
        gdp: gdp || 0,
      }
    })
    .filter((country) => country.gdp > 0)
}

/**
 * Preload images to prevent flickering
 * @param {Array} countriesToPreload - Array of country objects to preload flags for
 */
export function preloadImages(countriesToPreload) {
  console.log(`Preloading ${countriesToPreload.length} images...`)
  countriesToPreload.forEach((country) => {
    if (country.flag) {
      const img = new Image()
      img.src = country.flag
    }
  })
}

/**
 * Shuffle array using Fisher-Yates algorithm
 * @param {Array} array - The array to shuffle
 */
export function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
}

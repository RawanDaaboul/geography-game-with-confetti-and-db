/**
 * Configuration for the Country Comparisons Game
 */
const CONFIG = {
  // API settings
  COUNTRIES_API_URL: "https://restcountries.com/v3.1/all?fields=name,population,flags,area",
  GDP_API_URL: "https://api.worldbank.org/v2/country/all/indicator/NY.GDP.MKTP.CD?format=json&date=2022&per_page=300",

  // Game settings
  MIN_POPULATION: 100000, // Minimum population for countries to include
  MIN_AREA: 1000, // Minimum area (sq km) for countries to include
  LOADING_DELAY: 1500, // Simulated loading time in ms

  // Animation timings
  VALUE_REVEAL_DELAY: 1200, // Delay before revealing value in ms
  RESULT_DISPLAY_DELAY: 1000, // Delay before showing result in VS text
  NEXT_COUNTRY_DELAY: 1500, // Delay before moving to next country
  TRANSITION_DURATION: 500, // Duration of country transition animations

  // Local storage keys
  HIGH_SCORE_KEY_PREFIX: "countryGameHighScore_",

  // Accessibility
  KEYBOARD_SHORTCUTS: {
    HIGHER: ["ArrowUp", "h", "H"],
    LOWER: ["ArrowDown", "l", "L"],
    PLAY_AGAIN: ["Enter"],
  },

  // Game modes
  MODES: {
    POPULATION: {
      key: "population",
      label: "Population",
      valueText: "population",
      format: (value) => new Intl.NumberFormat().format(value),
      color: "#8A4FFF",
      icon: "👥",
    },
    AREA: {
      key: "area",
      label: "Area",
      valueText: "km² area",
      format: (value) => new Intl.NumberFormat().format(value),
      color: "#2ecc71",
      icon: "🗺️",
    },
    GDP: {
      key: "gdp",
      label: "GDP",
      valueText: "USD GDP",
      // Improved GDP formatting to show in billions/millions with 2 decimal places
      format: (value) => {
        if (value >= 1000000000000) {
          return `$${(value / 1000000000000).toFixed(2)} trillion`
        } else if (value >= 1000000000) {
          return `$${(value / 1000000000).toFixed(2)} billion`
        } else if (value >= 1000000) {
          return `$${(value / 1000000).toFixed(2)} million`
        } else {
          return `$${new Intl.NumberFormat().format(value)}`
        }
      },
      color: "#f39c12",
      icon: "💰",
    },
  },
}

// Export CONFIG both as a default export and as a named export
export default CONFIG
export { CONFIG }

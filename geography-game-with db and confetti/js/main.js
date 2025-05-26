/**
 * Main Application for the Country Comparisons Game
 */

// Import necessary modules
import { CONFIG } from "./config.js"
import { currentMode } from "./game.js"
import { fetchCountriesData, fetchGDPData, mergeGDPData, shuffleArray, preloadImages } from "./api-service.js"
import { showLoadingError, updateScoreDisplay } from "./dom-utils.js"

// Import game functions
import { initDOMReferences, startGame, setupEventListeners } from "./game.js"

/**
 * Initialize the game
 */
async function initGame() {
  console.log("Initializing game...")
  try {
    // Initialize DOM references
    initDOMReferences()

    // Get high score from local storage
    const highScore = Number.parseInt(localStorage.getItem(CONFIG.HIGH_SCORE_KEY_PREFIX + currentMode)) || 0
    console.log("High score from storage:", highScore)

    // Update high score display
    updateScoreDisplay(0, highScore)

    // Simulate loading time for better UX
    console.log(`Waiting ${CONFIG.LOADING_DELAY}ms for loading effect...`)
    await new Promise((resolve) => setTimeout(resolve, CONFIG.LOADING_DELAY))

    // Fetch countries data
    console.log("Fetching countries data...")
    const countries = await fetchCountriesData()
    console.log(`Fetched ${countries.length} countries`)

    // Fetch GDP data
    console.log("Fetching GDP data...")
    const gdpData = await fetchGDPData()

    // Merge GDP data with countries
    const mergedCountries = mergeGDPData(countries, gdpData)
    console.log(`Final country count with all data: ${mergedCountries.length}`)

    // Shuffle the countries array
    console.log("Shuffling countries...")
    shuffleArray(mergedCountries)

    // Preload some flag images
    preloadImages(mergedCountries.slice(0, 10))

    // Start the game
    startGame(mergedCountries, highScore)
  } catch (error) {
    console.error("Error initializing game:", error)
    showLoadingError(error.message || "Failed to initialize game")
  }
}

// Initialize the game when the page loads
console.log("Setting up DOMContentLoaded event listener")
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM content loaded")
  initGame()
    .then(() => {
      console.log("Game initialized successfully")
      setupEventListeners()
    })
    .catch((error) => {
      console.error("Failed to initialize game:", error)
      showLoadingError("Failed to load game. Please refresh the page.")
    })
})

// Add a fallback in case DOMContentLoaded already fired
if (document.readyState === "complete" || document.readyState === "interactive") {
  console.log("DOM already loaded, initializing game now")
  setTimeout(() => {
    initGame()
      .then(() => {
        console.log("Game initialized successfully (fallback)")
        setupEventListeners()
      })
      .catch((error) => {
        console.error("Failed to initialize game (fallback):", error)
        showLoadingError("Failed to load game. Please refresh the page.")
      })
  }, 1)
}

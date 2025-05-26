/**
 * Country Comparisons Game
 * A game where players guess whether a country has a higher or lower value than another.
 */

// Configuration
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
      valueText: "sq km area",
      format: (value) => new Intl.NumberFormat().format(value),
      color: "#2ecc71",
      icon: "🗺️",
    },
    GDP: {
      key: "gdp",
      label: "GDP",
      valueText: "USD GDP",
      format: (value) => "$" + new Intl.NumberFormat().format(value),
      color: "#f39c12",
      icon: "💰",
    },
  },
}

// DOM Elements
let loadingScreen, gameScreen, gameOverScreen
let scoreValue, highscoreValue, finalScoreElement, highScoreElement, finalModeElement
let leftFlag, leftName, leftValue, leftCard, leftValueText
let rightFlag, rightName, rightValue, rightCard, valuePlaceholder, rightValueText
let vsText
let higherButton, lowerButton, playAgainButton, shareButton, backLink
let populationBtn, areaBtn, gdpBtn

// Game state variables
let countries = []
let gdpData = {}
let currentIndex = 0
let nextIndex = 1
let score = 0
let highScore = 0
let isAnimating = false
let isGameOver = false
let currentMode = CONFIG.MODES.POPULATION.key

/**
 * Initialize DOM references
 */
function initDOMReferences() {
  console.log("Initializing DOM references...")
  loadingScreen = document.getElementById("loading-screen")
  gameScreen = document.getElementById("game-screen")
  gameOverScreen = document.getElementById("game-over-screen")

  scoreValue = document.getElementById("score-value")
  highscoreValue = document.getElementById("highscore-value")
  finalScoreElement = document.getElementById("final-score")
  highScoreElement = document.getElementById("high-score")
  finalModeElement = document.getElementById("final-mode")

  leftFlag = document.getElementById("left-flag")
  leftName = document.getElementById("left-name")
  leftValue = document.getElementById("left-value")
  leftCard = document.getElementById("left-card")
  leftValueText = document.getElementById("left-value-text")

  rightFlag = document.getElementById("right-flag")
  rightName = document.getElementById("right-name")
  rightValue = document.getElementById("right-value")
  rightCard = document.getElementById("right-card")
  valuePlaceholder = document.getElementById("value-placeholder")
  rightValueText = document.getElementById("right-value-text")

  vsText = document.getElementById("vs-text")

  higherButton = document.getElementById("higher-button")
  lowerButton = document.getElementById("lower-button")
  playAgainButton = document.getElementById("play-again-button")
  shareButton = document.getElementById("share-button")
  backLink = document.getElementById("back-link")

  // Mode buttons
  populationBtn = document.getElementById("population-btn")
  areaBtn = document.getElementById("area-btn")
  gdpBtn = document.getElementById("gdp-btn")

  // Verify all DOM elements were found
  const elements = [
    loadingScreen,
    gameScreen,
    gameOverScreen,
    scoreValue,
    highscoreValue,
    finalScoreElement,
    highScoreElement,
    finalModeElement,
    leftFlag,
    leftName,
    leftValue,
    leftCard,
    leftValueText,
    rightFlag,
    rightName,
    rightValue,
    rightCard,
    valuePlaceholder,
    rightValueText,
    vsText,
    higherButton,
    lowerButton,
    playAgainButton,
    shareButton,
    backLink,
    populationBtn,
    areaBtn,
    gdpBtn,
  ]

  const missingElements = elements.some((el) => !el)
  if (missingElements) {
    console.error("Some DOM elements could not be found!")
    throw new Error("DOM elements missing")
  }

  console.log("DOM references initialized successfully")
}

/**
 * Format value based on current mode
 * @param {number} value - Value to format
 * @returns {string} Formatted value string
 */
function formatValue(value) {
  const mode = CONFIG.MODES[currentMode.toUpperCase()]
  return mode.format(value)
}

/**
 * Get value text based on current mode
 * @returns {string} Value text
 */
function getValueText() {
  return CONFIG.MODES[currentMode.toUpperCase()].valueText
}

/**
 * Fetch countries data from the API
 * @returns {Promise<Array>} Array of processed country objects
 */
async function fetchCountriesData() {
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
async function fetchGDPData() {
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
function mergeGDPData(countries, gdpData) {
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
 * Shuffle array using Fisher-Yates algorithm
 * @param {Array} array - The array to shuffle
 */
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
}

/**
 * Preload images to prevent flickering
 * @param {Array} countriesToPreload - Array of country objects to preload flags for
 */
function preloadImages(countriesToPreload) {
  console.log(`Preloading ${countriesToPreload.length} images...`)
  countriesToPreload.forEach((country) => {
    if (country.flag) {
      const img = new Image()
      img.src = country.flag
    }
  })
}

/**
 * Show loading error
 * @param {string} message - Error message to display
 */
function showLoadingError(message) {
  console.error("Loading error:", message)
  const loadingContainer = document.querySelector(".loading-container")
  if (loadingContainer) {
    loadingContainer.innerHTML = `
       <div class="error-message">
         ${message || "Failed to load game data. Please refresh the page."}
       </div>
     `
  } else {
    alert(message || "Failed to load game data. Please refresh the page.")
  }
}

/**
 * Update the country display
 * @param {Object} currentCountry - Current country object
 * @param {Object} nextCountry - Next country object
 */
function updateCountryDisplay(currentCountry, nextCountry) {
  console.log("Updating country display...")
  console.log("Current country:", currentCountry.name)
  console.log("Next country:", nextCountry.name)

  // Update value text based on current mode
  const valueText = getValueText()
  leftValueText.textContent = valueText
  rightValueText.textContent = valueText

  // Get current value based on mode
  const currentValue = currentCountry[currentMode]
  const nextValue = nextCountry[currentMode]

  // Update left (current) country
  leftFlag.src = currentCountry.flag
  leftFlag.alt = `Flag of ${currentCountry.name}`
  leftName.textContent = currentCountry.name
  leftValue.textContent = formatValue(currentValue)

  // Update right (next) country
  rightFlag.src = nextCountry.flag
  rightFlag.alt = `Flag of ${nextCountry.name}`
  rightName.textContent = nextCountry.name
  rightValue.textContent = "" // Clear the text before animation
  rightValue.classList.add("hidden")
  valuePlaceholder.classList.remove("hidden")

  // Reset card animations
  leftCard.classList.remove("slide-left")
  rightCard.classList.remove("slide-from-right")
  leftCard.style.opacity = "1"
  rightCard.style.opacity = "1"
}

/**
 * Update score display
 * @param {number} score - Current score
 * @param {number} highScore - High score
 */
function updateScoreDisplay(score, highScore) {
  scoreValue.textContent = score
  highscoreValue.textContent = highScore
}

/**
 * Show result in VS text
 * @param {boolean} isCorrect - Whether the guess was correct
 */
function showResultInVS(isCorrect) {
  // Change VS text to show result
  vsText.textContent = isCorrect ? "✓" : "✗"
  vsText.className = isCorrect ? "vs-text correct" : "vs-text incorrect"

  // Change back to VS after a delay
  setTimeout(() => {
    vsText.textContent = "VS"
    vsText.className = "vs-text"
  }, CONFIG.NEXT_COUNTRY_DELAY)
}

/**
 * Animate number counting up
 * @param {HTMLElement} element - Element to display the number
 * @param {number} targetNumber - Target number to count up to
 */
function animateNumberCount(element, targetNumber) {
  // Hide placeholder
  valuePlaceholder.classList.add("hidden")

  // Show the value element but keep it empty initially
  element.textContent = ""
  element.classList.remove("hidden")
  element.classList.add("number-scroll")

  // Start with a lower number (about 10% of the target)
  const startNumber = Math.floor(targetNumber * 0.1)
  const duration = 1000 // 1 second animation
  const framesPerSecond = 60
  const totalFrames = (duration / 1000) * framesPerSecond
  const increment = (targetNumber - startNumber) / totalFrames

  let currentNumber = startNumber
  let frame = 0

  const counter = setInterval(() => {
    frame++
    currentNumber += increment

    if (frame >= totalFrames) {
      clearInterval(counter)
      currentNumber = targetNumber
    }

    element.textContent = formatValue(Math.floor(currentNumber))

    if (frame >= totalFrames) {
      // Animation complete
      setTimeout(() => {
        element.classList.remove("number-scroll")
      }, 200)
    }
  }, 1000 / framesPerSecond)
}

/**
 * Animate country transition
 * @param {Object} currentCountry - Current country data
 * @param {Object} nextCountry - Next country data
 * @param {Object} upcomingCountry - Upcoming country data
 * @param {Function} callback - Callback function after animation completes
 */
function animateCountryTransition(currentCountry, nextCountry, upcomingCountry, callback) {
  // Animate the right card moving to the left
  leftCard.style.opacity = "0"
  rightCard.classList.add("slide-left")

  setTimeout(() => {
    // Get current value based on mode
    const nextValue = nextCountry[currentMode]
    const upcomingValue = upcomingCountry[currentMode]

    // Update left card with right card's data
    leftFlag.src = nextCountry.flag
    leftFlag.alt = `Flag of ${nextCountry.name}`
    leftName.textContent = nextCountry.name
    leftValue.textContent = formatValue(nextValue)
    leftCard.style.opacity = "1"

    // Update right card with new country
    rightFlag.src = upcomingCountry.flag
    rightFlag.alt = `Flag of ${upcomingCountry.name}`
    rightName.textContent = upcomingCountry.name
    rightValue.textContent = ""
    rightValue.classList.add("hidden")
    valuePlaceholder.classList.remove("hidden")

    // Reset animations
    rightCard.classList.remove("slide-left")
    rightCard.classList.add("slide-from-right")

    // Reset animation state after transition completes
    setTimeout(() => {
      rightCard.classList.remove("slide-from-right")
      rightValue.classList.remove("number-scroll")
      scoreValue.classList.remove("pulse")
      highscoreValue.classList.remove("pulse")

      if (callback && typeof callback === "function") {
        callback()
      }
    }, CONFIG.TRANSITION_DURATION)
  }, CONFIG.TRANSITION_DURATION)
}

/**
 * Animate score update
 * @param {boolean} isHighScore - Whether this is a new high score
 */
function animateScoreUpdate(isHighScore) {
  scoreValue.classList.add("pulse")

  if (isHighScore) {
    highscoreValue.classList.add("pulse")
  }
}

/**
 * Show game over screen
 * @param {number} score - Final score
 * @param {number} highScore - High score
 */
function showGameOver(score, highScore) {
  console.log("Game over. Score:", score, "High score:", highScore)
  // Hide game screen and show game over screen
  gameScreen.classList.add("hidden")
  gameOverScreen.classList.remove("hidden")

  // Update final score and high score
  finalScoreElement.textContent = score
  highScoreElement.textContent = highScore

  // Update mode display
  finalModeElement.textContent = CONFIG.MODES[currentMode.toUpperCase()].label
  finalModeElement.setAttribute("data-mode", currentMode)
}

/**
 * Share score
 * @param {number} score - Score to share
 */
function shareScore(score) {
  const modeName = CONFIG.MODES[currentMode.toUpperCase()].label
  const text = `I scored ${score} in the Country ${modeName} game! Can you beat my score?`

  if (navigator.share) {
    navigator
      .share({
        title: `Country ${modeName} Game`,
        text: text,
        url: window.location.href,
      })
      .catch((error) => {
        console.error("Error sharing:", error)
        fallbackShare(text)
      })
  } else {
    fallbackShare(text)
  }
}

/**
 * Fallback sharing method (copy to clipboard)
 * @param {string} text - Text to copy to clipboard
 */
function fallbackShare(text) {
  // Create a temporary textarea element
  const textarea = document.createElement("textarea")
  textarea.value = text
  document.body.appendChild(textarea)

  // Select and copy the text
  textarea.select()
  document.execCommand("copy")

  // Remove the textarea
  document.body.removeChild(textarea)

  // Notify the user
  alert("Score copied to clipboard!")
}

/**
 * Handle back button
 * @param {Event} e - Click event
 */
function handleBack(e) {
  e.preventDefault()
  const confirmLeave = confirm("Are you sure you want to leave the game?")
  if (confirmLeave) {
    window.location.href = "/"
  }
}

/**
 * Toggle button state
 * @param {boolean} disabled - Whether buttons should be disabled
 */
function toggleButtons(disabled) {
  higherButton.disabled = disabled
  lowerButton.disabled = disabled
}

/**
 * Update the current mode button to reflect the active mode
 */
function updateCurrentModeButton() {
  const currentModeBtn = document.getElementById("current-mode-btn")
  const activeMode = CONFIG.MODES[currentMode.toUpperCase()]

  // Update button attributes
  currentModeBtn.setAttribute("data-mode", currentMode)

  // Update button content
  const modeIcon = currentModeBtn.querySelector(".mode-icon")
  const modeText = currentModeBtn.querySelector(".mode-text")

  modeIcon.textContent = activeMode.icon
  modeText.textContent = activeMode.label
}

/**
 * Update mode button active state
 */
function updateModeButtonActiveState() {
  // Remove active class from all mode buttons
  populationBtn.classList.remove("active")
  areaBtn.classList.remove("active")
  gdpBtn.classList.remove("active")

  // Update the current mode button
  updateCurrentModeButton()
}

/**
 * Start the game
 */
function startGame() {
  console.log("Starting game...")
  // Reset game state
  score = 0
  currentIndex = 0
  nextIndex = 1
  isGameOver = false

  // Update score display
  updateScoreDisplay(score, highScore)

  // Reset VS text
  vsText.textContent = "VS"
  vsText.className = "vs-text"

  // Update mode button active state
  updateModeButtonActiveState()

  // Hide loading screen and show game screen
  console.log("Hiding loading screen, showing game screen")
  loadingScreen.classList.add("hidden")
  gameScreen.classList.remove("hidden")

  // Update country displays
  updateCountryDisplay(countries[currentIndex], countries[nextIndex])

  // Enable buttons
  toggleButtons(false)
  console.log("Game started successfully")
}

/**
 * Handle player's guess
 * @param {boolean} isHigher - Whether the player guessed higher
 */
function handleGuess(isHigher) {
  if (isAnimating || isGameOver) return
  isAnimating = true

  // Disable buttons during animation
  toggleButtons(true)

  const currentValue = countries[currentIndex][currentMode]
  const nextValue = countries[nextIndex][currentMode]

  // Animate the value number counting up
  animateNumberCount(rightValue, nextValue)

  // Determine if the guess is correct
  const isCorrect = (isHigher && nextValue > currentValue) || (!isHigher && nextValue < currentValue)

  // Wait for the value reveal animation
  setTimeout(() => {
    // Show result in VS text
    showResultInVS(isCorrect)

    if (isCorrect) {
      // Increase score
      score++

      // Update score display
      updateScoreDisplay(score, highScore)

      // Animate score update
      animateScoreUpdate(false)

      // Update high score if needed
      if (score > highScore) {
        highScore = score
        localStorage.setItem(CONFIG.HIGH_SCORE_KEY_PREFIX + currentMode, highScore)
        updateScoreDisplay(score, highScore)
        animateScoreUpdate(true)
      }

      // Prepare next country
      let upcomingIndex = nextIndex + 1
      if (upcomingIndex >= countries.length) {
        shuffleArray(countries)
        upcomingIndex = 0
      }

      // Move to next comparison after a delay
      setTimeout(() => {
        // Animate the transition
        animateCountryTransition(countries[currentIndex], countries[nextIndex], countries[upcomingIndex], () => {
          // Update indices
          currentIndex = nextIndex
          nextIndex = upcomingIndex

          // Reset animation state
          isAnimating = false

          // Re-enable buttons
          toggleButtons(false)
        })
      }, CONFIG.RESULT_DISPLAY_DELAY)
    } else {
      // Game over after a delay
      setTimeout(() => {
        isGameOver = true
        showGameOver(score, highScore)
        isAnimating = false
      }, CONFIG.RESULT_DISPLAY_DELAY)
    }
  }, CONFIG.VALUE_REVEAL_DELAY)
}

/**
 * Play again
 */
function playAgain() {
  console.log("Playing again...")
  // Shuffle countries for a new game
  shuffleArray(countries)

  // Reset indices
  currentIndex = 0
  nextIndex = 1

  // Reset score
  score = 0

  // Hide game over screen
  gameOverScreen.classList.add("hidden")
  gameScreen.classList.remove("hidden")

  // Reset animation classes
  rightValue.classList.remove("number-scroll")

  // Update country display
  updateCountryDisplay(countries[currentIndex], countries[nextIndex])

  // Update score display
  updateScoreDisplay(score, highScore)

  // Reset game state
  isGameOver = false

  // Enable buttons
  toggleButtons(false)
}

/**
 * Change game mode
 * @param {string} mode - New game mode
 */
function changeGameMode(mode) {
  if (mode === currentMode) {
    return
  }

  console.log(`Changing game mode from ${currentMode} to ${mode}`)

  // Update current mode
  currentMode = mode

  // Update active button
  updateModeButtonActiveState()

  // Get high score for this mode
  highScore = Number.parseInt(localStorage.getItem(CONFIG.HIGH_SCORE_KEY_PREFIX + currentMode)) || 0

  // Reset game
  shuffleArray(countries)
  currentIndex = 0
  nextIndex = 1
  score = 0
  isGameOver = false

  // Update displays
  updateScoreDisplay(score, highScore)
  updateCountryDisplay(countries[currentIndex], countries[nextIndex])

  // Hide game over screen if visible
  if (!gameOverScreen.classList.contains("hidden")) {
    gameOverScreen.classList.add("hidden")
    gameScreen.classList.remove("hidden")
  }

  // Reset animation state
  isAnimating = false

  // Enable buttons
  toggleButtons(false)

  // Close the dropdown after selection on mobile
  document.querySelector(".mode-selector").classList.remove("touch-expanded")
}

/**
 * Handle keyboard navigation
 * @param {KeyboardEvent} event - Keyboard event
 */
function handleKeyboard(event) {
  if (gameScreen.classList.contains("hidden")) {
    if (CONFIG.KEYBOARD_SHORTCUTS.PLAY_AGAIN.includes(event.key) && !gameOverScreen.classList.contains("hidden")) {
      playAgainButton.click()
    }
    return
  }

  if (isAnimating) return

  if (CONFIG.KEYBOARD_SHORTCUTS.HIGHER.includes(event.key)) {
    higherButton.click()
  } else if (CONFIG.KEYBOARD_SHORTCUTS.LOWER.includes(event.key)) {
    lowerButton.click()
  }
}

/**
 * Initialize the game
 */
async function initGame() {
  console.log("Initializing game...")
  try {
    // Initialize DOM references
    initDOMReferences()

    // Get high score from local storage
    highScore = Number.parseInt(localStorage.getItem(CONFIG.HIGH_SCORE_KEY_PREFIX + currentMode)) || 0
    console.log("High score from storage:", highScore)

    // Update high score display
    updateScoreDisplay(score, highScore)

    // Simulate loading time for better UX
    console.log(`Waiting ${CONFIG.LOADING_DELAY}ms for loading effect...`)
    await new Promise((resolve) => setTimeout(resolve, CONFIG.LOADING_DELAY))

    // Fetch countries data
    console.log("Fetching countries data...")
    countries = await fetchCountriesData()
    console.log(`Fetched ${countries.length} countries`)

    // Fetch GDP data
    console.log("Fetching GDP data...")
    gdpData = await fetchGDPData()

    // Merge GDP data with countries
    countries = mergeGDPData(countries, gdpData)
    console.log(`Final country count with all data: ${countries.length}`)

    // Shuffle the countries array
    console.log("Shuffling countries...")
    shuffleArray(countries)

    // Preload some flag images
    preloadImages(countries.slice(0, 10))

    // Start the game
    startGame()
  } catch (error) {
    console.error("Error initializing game:", error)
    showLoadingError(error.message || "Failed to initialize game")
  }
}

/**
 * Set up event listeners
 */
function setupEventListeners() {
  console.log("Setting up event listeners...")

  // Game buttons
  higherButton.addEventListener("click", () => handleGuess(true))
  lowerButton.addEventListener("click", () => handleGuess(false))
  playAgainButton.addEventListener("click", playAgain)
  shareButton.addEventListener("click", () => shareScore(score))
  backLink.addEventListener("click", handleBack)

  // Mode buttons - simple direct event handlers
  populationBtn.addEventListener("click", () => changeGameMode(CONFIG.MODES.POPULATION.key))
  areaBtn.addEventListener("click", () => changeGameMode(CONFIG.MODES.AREA.key))
  gdpBtn.addEventListener("click", () => changeGameMode(CONFIG.MODES.GDP.key))

  // Add touch support for mobile dropdown
  const modeSelector = document.querySelector(".mode-selector")
  const currentModeBtn = document.getElementById("current-mode-btn")

  currentModeBtn.addEventListener("click", (e) => {
    // Only handle click on mobile
    if (window.innerWidth <= 768) {
      e.preventDefault()
      modeSelector.classList.toggle("touch-expanded")
      e.stopPropagation()
    }
  })

  // Close dropdown when clicking elsewhere
  document.addEventListener("click", () => {
    modeSelector.classList.remove("touch-expanded")
  })

  // Prevent dropdown from closing when clicking inside it
  document.querySelector(".mode-options").addEventListener("click", (e) => {
    e.stopPropagation()
  })

  // Keyboard navigation
  document.addEventListener("keydown", handleKeyboard)

  console.log("Event listeners set up successfully")
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

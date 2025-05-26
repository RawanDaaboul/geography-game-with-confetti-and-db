/**
 * Event Handlers for the Country Comparisons Game
 */

// Import or declare missing variables
import { CONFIG } from "./config.js" // Assuming CONFIG is in config.js
import { currentMode } from "./game.js" // Assuming currentMode is in game.js

// Declare missing variables
const gameScreen = document.querySelector(".game-screen")
const gameOverScreen = document.querySelector(".game-over-screen")
const playAgainButton = document.getElementById("play-again-btn")
const higherButton = document.getElementById("higher-button")
const lowerButton = document.getElementById("lower-button")
const shareButton = document.getElementById("share-button")
const backLink = document.getElementById("back-link")
const populationBtn = document.getElementById("population-btn")
const areaBtn = document.getElementById("area-btn")
const gdpBtn = document.getElementById("gdp-btn")

const score = 0 // Initialize score
const isAnimating = false // Initialize isAnimating

// Declare missing functions (placeholders - implement in game.js)
function handleGuess(isHigher) {
  console.warn("handleGuess function is a placeholder. Implement in game.js")
}

function playAgain() {
  console.warn("playAgain function is a placeholder. Implement in game.js")
}

function changeGameMode(modeKey) {
  console.warn("changeGameMode function is a placeholder. Implement in game.js")
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

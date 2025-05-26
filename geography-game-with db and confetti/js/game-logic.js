/**
 * Game Logic for the Country Comparisons Game
 */

// Game state variables
const countries = []
const gdpData = {}
let currentIndex = 0
let nextIndex = 1
let score = 0
let highScore = 0
let isAnimating = false
let isGameOver = false

// Declare variables that were previously undeclared
let updateScoreDisplay
let vsText
let updateModeButtonActiveState
let loadingScreen
let gameScreen
let rightValue
let gameOverScreen
let currentMode
let CONFIG
let updateCountryDisplay
let toggleButtons
let animateNumberCount
let showResultInVS
let animateScoreUpdate
let shuffleArray
let animateCountryTransition
let showGameOver

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

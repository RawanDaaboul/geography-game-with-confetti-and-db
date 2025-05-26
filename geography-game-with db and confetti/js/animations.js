/**
 * Animation Functions for the Country Comparisons Game
 */

// Declare variables that are used in the functions
let valuePlaceholder
let leftCard
let rightCard
let currentMode
let leftFlag
let leftName
let leftValue
let rightFlag
let rightName
let scoreValue
let highscoreValue
let rightValue // Declare rightValue
const CONFIG = { TRANSITION_DURATION: 500 } // Declare CONFIG

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

/**
 * DOM Utilities for the Country Comparisons Game
 */

/**
 * Show loading error
 * @param {string} message - Error message to display
 */
export function showLoadingError(message) {
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
 * Toggle button state
 * @param {boolean} disabled - Whether buttons should be disabled
 */
export function toggleButtons(disabled) {
  const higherButton = document.getElementById("higher-button")
  const lowerButton = document.getElementById("lower-button")

  if (higherButton) higherButton.disabled = disabled
  if (lowerButton) lowerButton.disabled = disabled
}

/**
 * Update score display
 * @param {number} score - Current score
 * @param {number} highScore - High score
 */
export function updateScoreDisplay(score, highScore) {
  const scoreValue = document.getElementById("score-value")
  const highscoreValue = document.getElementById("highscore-value")

  if (scoreValue) scoreValue.textContent = score
  if (highscoreValue) highscoreValue.textContent = highScore
}

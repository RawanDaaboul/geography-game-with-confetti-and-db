/**
 * Game Display Functions for the Country Comparisons Game
 */

import { CONFIG } from "./config.js"
import { currentMode } from "./game.js"

/**
 * Format value based on current mode
 * @param {number} value - Value to format
 * @returns {string} Formatted value string
 */
export function formatValue(value) {
  const mode = CONFIG.MODES[currentMode.toUpperCase()]
  return mode.format(value)
}

/**
 * Get value text based on current mode
 * @returns {string} Value text
 */
export function getValueText() {
  // For GDP mode, we'll return a simpler text since the formatted value already includes "billion/trillion"
  if (currentMode === CONFIG.MODES.GDP.key) {
    return "GDP"
  }
  return CONFIG.MODES[currentMode.toUpperCase()].valueText
}

/**
 * Update the country display
 * @param {Object} currentCountry - Current country object
 * @param {Object} nextCountry - Next country object
 */
export function updateCountryDisplay(currentCountry, nextCountry) {
  console.log("Updating country display...")
  console.log("Current country:", currentCountry.name)
  console.log("Next country:", nextCountry.name)

  const leftValueText = document.getElementById("left-value-text")
  const rightValueText = document.getElementById("right-value-text")
  const leftFlag = document.getElementById("left-flag")
  const leftName = document.getElementById("left-name")
  const leftValue = document.getElementById("left-value")
  const rightFlag = document.getElementById("right-flag")
  const rightName = document.getElementById("right-name")
  const rightValue = document.getElementById("right-value")
  const valuePlaceholder = document.getElementById("value-placeholder")
  const leftCard = document.getElementById("left-card")
  const rightCard = document.getElementById("right-card")

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
 * Show result in VS text
 * @param {boolean} isCorrect - Whether the guess was correct
 */
export function showResultInVS(isCorrect) {
  const vsText = document.getElementById("vs-text")

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
 * Show game over screen
 * @param {number} score - Final score
 * @param {number} highScore - High score
 */
// filepath: c:\Users\User\Desktop\web expo\geography-game-with db and confetti\js\game-display.js
import { triggerConfetti } from './confetti.js';

export function showGameOver(score, highScore) {
    console.log("Game over. Score:", score, "High score:", highScore);

    const gameScreen = document.getElementById("game-screen");
    const gameOverScreen = document.getElementById("game-over-screen");
    const finalScoreElement = document.getElementById("final-score");
    const highScoreElement = document.getElementById("high-score");
    const finalModeElement = document.getElementById("final-mode");
    const newHighscoreText = document.querySelector(".new-highscore-text");

    // Hide game screen and show game over screen
    gameScreen.classList.add("hidden");
    gameOverScreen.classList.remove("hidden");

    // Update final score and high score
    finalScoreElement.textContent = score;
    highScoreElement.textContent = highScore;

    // Update mode display
    finalModeElement.textContent = CONFIG.MODES[currentMode.toUpperCase()].label;
    finalModeElement.setAttribute("data-mode", currentMode);

    // Show/hide new highscore text
    if (score >= highScore && score > 0) {
        newHighscoreText.classList.remove("hidden");
        // Trigger confetti with a slight delay
        setTimeout(() => {
            triggerConfetti();
        }, 500);
    } else {
        newHighscoreText.classList.add("hidden");
    }
}
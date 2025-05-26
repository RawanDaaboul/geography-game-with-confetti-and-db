import { CONFIG } from './config.js';
let userHighscoreP = localStorage.getItem(CONFIG.HIGH_SCORE_KEY_PREFIX + 'population') || 0;
let userHighscoreA = localStorage.getItem(CONFIG.HIGH_SCORE_KEY_PREFIX + 'area') || 0;
let userHighscoreGDP = localStorage.getItem(CONFIG.HIGH_SCORE_KEY_PREFIX + 'gdp') || 0;
// Function to send high scores to the Flask app
function saveHighScores(highscore_p, highscore_a, highscore_gdp) {
    const url = `https://geography-game-api.onrender.com/save_score/${highscore_p}/${highscore_a}/${highscore_gdp}`;

    fetch(url, { method: "POST" })
        .then(response => response.text())
        .then(message => {
            console.log(message);
            alert(message);  // Optional: Notify the user
        })
        .catch(error => {
            console.error("Error saving scores:", error);
        });
}

// Call saveHighScores with the dynamic values
saveHighScores(userHighscoreP, userHighscoreA, userHighscoreGDP);
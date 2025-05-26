# Country Comparisons Game ("Higher or Lower" Geography Game)

This is an interactive web game where players guess whether a country has a higher or lower value (Population, Area, or GDP) than another. The game features animated transitions, responsive design, and persistent high scores.

## Features

- **Game Modes:** Play by comparing Population, Area, or GDP of countries.
- **Animated UI:** Smooth transitions, number animations, and confetti for new high scores.
- **Responsive Design:** Works well on desktop and mobile devices.
- **Persistent High Scores:** High scores are saved in local storage and can be sent to a backend.
- **Share Feature:** Share your score with friends.
- **Modern UI:** Built with modular CSS and JavaScript.

## Project Structure

- `index.html` — Main game interface.
- `Mainmenu.html` — Project menu/landing page.
- `js/` — Modular JavaScript files (game logic, API, UI, animations, etc.).
- `css/` — Modular CSS files for layout, animations, and responsiveness.
- `styles.css`, `style-menu.css` — Main and menu styles.
- `package.json` — Project metadata (no build step required).

## Getting Started

1. **Clone or Download** this repository.
2. **Open `index.html`** in your browser to play the game.
3. **(Optional)**: Use a local server for best results (e.g., with VS Code Live Server).

## Scripts

No build step is required. All scripts are loaded directly in the HTML.

## Customization

- Add new game modes or tweak the UI by editing the files in the `js/` and `css/` folders.
- High scores can be sent to a backend via the logic in [`js/saveScores.js`](js/saveScores.js).

## Credits

- Country data from [REST Countries API](https://restcountries.com/).
- GDP data from [World Bank API](https://data.worldbank.org/indicator/NY.GDP.MKTP.CD).
- Confetti animation via [canvas-confetti](https://www.npmjs.com/package/canvas-confetti).

---

**Enjoy playing and learning about the world!**

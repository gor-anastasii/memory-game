# Memory Game 

A browser-based memory card matching game inspired. Players match pairs in the fewest moves possible. 

Developed as part of the [RS School 2026Q3](https://github.com/rolling-scopes-school/tasks/tree/master/tasks/memory-game).

## Demo 
https://gor-anastasii.github.io/memory-game/

## Features
- 4x4 card grid (16 cards, 8 unique item pairs).
- Random card shuffling on start and restart (Fisher-Yates shuffle algorithm).
- Move counter and matched pairs tracker (0 / 8).
- Turn logic: mismatched cards remain visible for ~1 second with board clicks locked during comparison.
- Victory modal displaying total moves and a quick restart option.
- Leaderboard: top-10 best runs stored in localStorage (sorted by lowest moves, then by earlier date DD.MM.YYYY).
- 'New Game' button: instantly resets the board and cancels any pending mismatch timers.
- 100% dynamic DOM generation via JavaScript (document.createElement), completely empty initial <body>.
- Pure Vanilla JavaScript and CSS, zero external libraries.

## Game Rules
1. Click a face-down card, then click a second one. Flipping two cards counts as one move.
2. If the items match, they remain face-up until the game ends.
3. If the items differ, they flip back after ~1 second.
4. The game is completed once all 8 pairs are found.

## Tech Stack
- HTML5
- CSS3 (CSS Grid, Flexbox, 3D card flip transforms)
- Vanilla JavaScript (ES6+ Modules, Web Storage API)

## Local Setup
Since the project uses ES Modules, it should be run via a local HTTP server:

1. Clone the repository and checkout the project branch:
```bash
git clone https://github.com/gor-anastasii/memory-game.git
cd memory-game
git checkout memory-game
```

2. Start a local server:
- **VS Code**: install the Live Server extension, right-click index.html -> *Open with Live Server*.
- **Node.js**:
```bash
npx serve .
```
- **Python**:
```bash
python -m http.server 3000
```
## Self-Evaluation: 100 / 100 (+5 bonus)

### Basic Scope (+40 points)
- [x] Initial game state displays a 4x4 board of 16 face-down cards (+10)
- [x] Cards are randomly shuffled on every start and restart using Fisher-Yates algorithm (+10)
- [x] Clicking a card flips it over with a 3D animation, revealing its face (+10)
- [x] When 2 matching cards are opened, they remain face-up (+10)

### Advanced Scope (+40 points)
- [x] When 2 non-matching cards are opened, they remain visible for a 1-second delay and then flip back (+10)
- [x] Board interactions are locked during the mismatch delay to prevent race conditions (+10)
- [x] Move counter updates each time a pair of cards is flipped (+10)
- [x] Game victory condition is triggered when all 8 pairs are matched (+10)

### Hacker Scope (+20 points)
- [x] Victory modal appears upon completion showing total moves and restart button (+10)
- [x] Score table / Leaderboard saves and displays the top 10 best games sorted by fewest moves, persisted in localStorage (+10)

### Extra Bonus (+5 points)
- [x] Descriptive, well-formatted README with project overview, features, game rules, and local setup guide (+5)

### Penalty Check (0 points deducted)
- [x] No UI libraries or frameworks used (pure Vanilla JavaScript and CSS)
- [x] Initial `<body>` in `index.html` is completely empty except for `<script type="module" src="./js/index.js"></script>`
- [x] Zero forbidden DOM manipulation methods used (`innerHTML`, `outerHTML`, `insertAdjacentHTML`, `document.write`, `DOMParser`, `alert`, `confirm`, `prompt`)
- [x] Zero code comments across all HTML, CSS, and JS files
- [x] Repository history contains clean Conventional Commits

## Author
- GitHub: [gor-anastasii](https://github.com/gor-anastasii)
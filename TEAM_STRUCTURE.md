# Code Structure

The app is now split into focused files so multiple teammates can work in parallel without editing one huge file.

## HTML
- `/Users/coconut/Desktop/casinoCLAUDE/index.html`
  - Markup only.
  - Loads CSS and JS files from `assets/`.

## Styles
- `/Users/coconut/Desktop/casinoCLAUDE/assets/css/base.css`
  - Global layout, navigation, shared components, and non-Mersion game styles.
- `/Users/coconut/Desktop/casinoCLAUDE/assets/css/mersion.css`
  - Mersion map/dive visuals, trench, fish swarm, lane controls, submarine animation.

## Scripts
- `/Users/coconut/Desktop/casinoCLAUDE/assets/js/core.js`
  - Global app state, balance/transactions, screen routing, language switching.
- `/Users/coconut/Desktop/casinoCLAUDE/assets/js/games-classic.js`
  - Dice, Coin Flip, Roulette logic.
- `/Users/coconut/Desktop/casinoCLAUDE/assets/js/game-bomb.js`
  - Bomb Yard logic, plus shared result modal and referral copy handler.
- `/Users/coconut/Desktop/casinoCLAUDE/assets/js/game-mersion.js`
  - Mersion data, map rendering, dive animation, fish interactions, lane switching.
- `/Users/coconut/Desktop/casinoCLAUDE/assets/js/app-init.js`
  - App bootstrapping (`initBombGrid`, `updateDiceChance`, `updateBalance`).

## Team Workflow Suggestion
- If your task is visual only, work in the matching CSS file.
- If your task is game-specific, work only in that game JS file.
- Keep cross-game/shared behavior in `core.js`.
- Keep initialization side effects in `app-init.js` only.

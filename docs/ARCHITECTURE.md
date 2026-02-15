# Technical Architecture

## File Structure

```
du/
├── index.html          # Entire application (~3100 lines)
│   ├── <style>         # Lines 14-750    (CSS)
│   ├── <body>          # Lines 751-1780  (HTML screens)
│   └── <script>        # Lines 1781-3104 (JavaScript)
└── docs/
    ├── PROJECT.md      # Product overview
    ├── MERSION.md      # Game design + casino math
    ├── ARCHITECTURE.md # This file
    └── SESSION-LOG.md  # Dev session decisions
```

## Code Map (index.html)

### CSS (~735 lines)

```
Lines 14-750
├── Reset & variables (:root)
├── Typography & layout
├── Navigation bar (.nav-bar)
├── Screen containers (.screen)
├── Game cards (.game-card)
├── Dice game styles
├── Coin flip styles
├── Roulette styles
├── Bomb Yard / Mines styles
├── Mersion styles
│   ├── .mersion-station (zone selector cards)
│   ├── .mersion-hud (heads-up display)
│   ├── .mersion-ocean (canvas container)
│   ├── .mersion-progress-bar
│   └── .mersion-log (encounter log)
├── Transaction history
├── Profile screen
└── Responsive / utility
```

### HTML Screens (~1030 lines)

```
Lines 751-1780
├── homeScreen
│   ├── Navigation bar (balance, lang toggle, profile)
│   ├── Hero section
│   └── Game grid (dice, coinflip, roulette, bombyard, mersion)
├── gamesScreen
│   └── Full game grid with all 5 games
├── diceGame
├── coinflipGame
├── rouletteGame
├── bombyardGame (Mines)
├── mersionGame
│   ├── #mersionSetup — zone selection + bet input
│   └── #mersionDive — HUD + canvas + progress + log
└── profileScreen
    ├── Stats (balance, total wagered, biggest win)
    └── Transaction history
```

### JavaScript (~1325 lines)

```
Lines 1781-3104

Global State
├── balance, totalWagered, biggestWin
├── currentLanguage ('en'/'ru')
├── mersionState, mersionSelectedStation, mersionAnimFrame

Navigation (L1787-1835)
├── showScreen(id)
├── showGame(id) — routes to game screens
└── toggleLanguage()

Balance & History (L1836-1880)
├── updateBalance()
├── addTransaction(game, amount, type)
└── showResult(won, amount)

Dice Game (L1881-1940)
├── updateDiceChance()
└── placeDice()

Coin Flip (L1941-1975)
└── flipCoin()

Roulette (L1976-1999)
└── spinRoulette()

Bomb Yard (L2000-2210)
├── initBombGrid()
├── revealCell(index)
└── cashoutBombs()

Mersion — Constants (L2216-2280)
├── FISH_POOLS[3] — weighted fish pools (Monte Carlo verified)
├── MERSION_ZONES[5] — depth/fishCount definitions
├── getPoolForZone(zoneId)
├── pickWeightedFish(pool)
├── selectStation(id)
└── mersionBack()

Mersion — Game Engine (L2303-2600)
├── startMersion() — validate, init state, launch
├── initMersionCanvas() — DPR, bubbles, bg fish, city
├── generateAncientCity(W, H, dpr)
├── mersionGameLoop(timestamp) — main loop
│   ├── Calculate progress
│   ├── Spawn fish at intervals
│   ├── Update fish positions
│   ├── Check collisions
│   └── Call drawMersionFrame()
├── spawnMersionFish()
├── updateMersionFish()
└── applyFishHit(fish)

Mersion — Rendering (L2598-3050)
├── drawFishShape(ctx, size, color, alpha) — bezier fish
├── drawMersionFrame(progress) — full frame render
│   ├── Ocean gradient
│   ├── Light rays
│   ├── Flash overlay
│   ├── Ancient city
│   ├── Bubbles
│   ├── Depth particles
│   ├── Background fish (28)
│   ├── Multiplier fish + labels
│   ├── Submarine (hull, tower, viewport, propeller)
│   └── Coin text
└── drawAncientCity(ctx, state, progress)

Mersion — Resolution (L3052-3098)
├── finishMersionDive() — payout calculation
└── resetMersion() — cleanup

Init (L3100-3103)
├── initBombGrid()
├── updateDiceChance()
└── updateBalance()
```

## State Management

No framework — plain global variables and DOM manipulation.

```javascript
// Global
let balance = 1000;
let currentLanguage = 'en';

// Mersion-specific (during dive)
let mersionState = {
    coins,           // current coin value (mutated by fish hits)
    betAmount,       // original bet (for P&L calc)
    zone,            // selected zone object
    pool,            // fish pool for this zone
    running,         // is dive active
    subX, subY,      // submarine position
    canvasW, canvasH, dpr,
    activeFish[],    // multiplier fish on screen
    bgFish[],        // decorative background fish
    bubbles[],       // bubble particles
    cityStructures[],// ancient city data
    spawnedCount,    // fish spawned so far
    totalFish,       // target fish count
    flashTimer,      // collision flash effect
    startTime,       // for progress calculation
};
```

## Screen Navigation

```
homeScreen ──► gamesScreen ──► [gameScreen]
     │                              │
     └──────── profileScreen        │
                                    ▼
                            Game-specific UI
                          (setup → play → result)
```

All screens are `<div>` elements with `display: none/block`. `showScreen()` hides all, shows the target. No URL changes, no history management.

## Rendering Pipeline (Mersion)

```
requestAnimationFrame
  └── mersionGameLoop(timestamp)
        ├── progress = elapsed / duration
        ├── if time to spawn → spawnMersionFish()
        ├── updateMersionFish()
        │     ├── move fish (vx, vy)
        │     ├── remove off-screen fish
        │     └── collision check → applyFishHit()
        ├── drawMersionFrame(progress)
        │     └── [10-layer render pipeline]
        ├── update HUD (depth, coins)
        ├── update progress bar
        └── if done → finishMersionDive()
```

## Device Pixel Ratio

Canvas rendering uses DPR-aware sizing:
```javascript
const dpr = window.devicePixelRatio || 1;
canvas.width = W * dpr;    // internal resolution
canvas.style.width = W + 'px';  // CSS display size
```

All coordinates are multiplied by `dpr` for crisp rendering on Retina/HiDPI displays.

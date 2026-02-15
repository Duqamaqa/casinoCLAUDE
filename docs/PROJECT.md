# DU Casino Platform

## Overview

Premium crypto casino platform — single-page web application with multiple provably-fun games. Dark-themed, mobile-first, bilingual (EN/RU).

**Status:** Active development (prototype)
**Stack:** Vanilla HTML5 + CSS3 + JavaScript (single file, zero dependencies)
**File:** `index.html` (~3100 lines, ~120KB)

## Games

| Game | Type | Status | House Edge |
|------|------|--------|------------|
| Dice | Classic roll | Done | Configurable via slider |
| Coin Flip | 50/50 bet | Done | Fixed odds |
| Roulette | Wheel spin | Done | Standard roulette edge |
| Bomb Yard (Mines) | Grid reveal | Done | Configurable via bomb count |
| **Mersion** | Submarine dive | **Done (v1)** | 4-25% depending on zone |

## Architecture Principles

1. **Single file** — everything lives in one `index.html`. No build step, no server, instant deploy.
2. **Screen-based navigation** — `showScreen(id)` swaps visibility of `<div>` sections. No routing library.
3. **Shared balance** — global `balance` variable across all games. `updateBalance()` syncs UI.
4. **i18n via data attributes** — `data-en="Play"` / `data-ru="Играть"` on elements. `toggleLanguage()` swaps.
5. **Canvas for Mersion** — real-time game loop via `requestAnimationFrame`. Other games use DOM manipulation.

## Design System

| Token | Value | Usage |
|-------|-------|-------|
| `--bg-primary` | `#0a0a12` | Page background |
| `--accent` | `#00e87b` | Primary green (wins, CTAs) |
| `--purple` | `#7c3aed` | Secondary purple (accents) |
| `--error` | `#ff4757` | Losses, warnings |
| `--gold` | `#fbbf24` | Premium highlights |

**Fonts:** Inter (body), Syne (display/headings)

## Key Functions

| Function | Purpose |
|----------|---------|
| `showScreen(id)` | Navigate between screens |
| `showGame(id)` | Route to game screen |
| `updateBalance()` | Sync balance to all UI elements |
| `addTransaction(game, amount, type)` | Log win/loss to history |
| `showResult(won, amount)` | Display win/loss notification |
| `toggleLanguage()` | Switch EN/RU |

## Roadmap Ideas

- [ ] Sound effects / haptic feedback
- [ ] Multiplayer / leaderboard
- [ ] Wallet integration (Web3)
- [ ] Server-side provably fair verification
- [ ] Split into modules (if complexity grows)
- [ ] PWA support (offline play)

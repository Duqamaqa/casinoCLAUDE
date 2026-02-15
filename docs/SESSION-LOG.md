# Session Log — Mersion Development

**Date:** February 2026
**Scope:** Design and implement the Mersion casino game, integrate into existing DU platform

## Iteration 1 — MVP

**Goal:** Add Mersion game to the casino platform.

**What was built:**
- Game card in home/games grids
- Two-phase UI: setup (zone picker + bet) and dive (canvas + HUD)
- 5 zones with station names and fish counts
- Pre-generated encounter sequence
- Basic submarine + fish rendering

**Problem:** Player always wins. The pre-generated encounters gave guaranteed station multipliers at each depth. Not a real casino game.

## Iteration 2 — Real Casino Mechanics

**Goal:** Make the game work like a real casino — house must win long-term.

**Key changes:**
- Removed fixed station multipliers (no guaranteed payout at depth)
- Switched to real-time physics: fish swim around, physical collision = multiplier
- Canvas game loop with `requestAnimationFrame`
- Weighted random fish pools
- Coins displayed ON the submarine
- Flash effects on collision, encounter log

**Casino math approach:**
- Multiplicative game: `outcome = bet × m₁ × m₂ × ... × mₙ`
- `E[outcome] = bet × (avg_mult)^n`
- If avg_mult < 1.0, house wins long-term
- More fish (deeper zones) = more compounding = higher house edge

**Problem:** First pool design had positive EV — big multipliers (x3, x4, x5) compound exponentially even at low weights. Monte Carlo showed players winning 100-375x on deep dives.

**Fix:** Multiple rebalancing iterations. Capped max multiplier, used Python Monte Carlo (200k trials) to verify. Landed on pools with 0.928-0.97 avg/fish.

**New problem:** House edge way too steep. Zones 3-5 had 40-76% edge. Players never win — not fun.

## Iteration 3 — Visual Overhaul

**Goal:** Fish should look like fish (not circles), swim randomly, and add ancient city background.

**What was built:**
- `drawFishShape()` — bezier curve fish with animated tail, dorsal fin, belly, eye
- 28 decorative background fish (teal/cyan and orange/gold, various sizes)
- 40 bubbles with wobble animation
- `generateAncientCity()` — temple, columns, arch, ruins, pyramid
- `drawAncientCity()` — renders with progressive alpha tied to depth
- Detailed submarine: hull gradient, conning tower, periscope, viewport, 3-blade propeller with wash
- Light rays from surface that fade with depth

## Iteration 4 — Casino Math Rebalance

**Goal:** Players should have a REAL chance to win, but house still profits.

**Analysis of the problem:**

| Zone | Old RTP | Old Win Rate | Verdict |
|------|---------|-------------|---------|
| 1 | 88% | 30% | Okay but steep |
| 2 | 81% | 24% | Too harsh |
| 3 | 59% | 9% | Unplayable |
| 4 | 58% | 5% | Unplayable |
| 5 | 24% | 1% | Absurd |

**Root cause:** Per-fish averages were too far below 1.0 (0.928-0.97). In multiplicative games, even small deviations compound drastically.

**Solution:** Redesigned 3 pools with avg/fish much closer to 1.0:
- Pool 0 (Shallow): 0.990/fish
- Pool 1 (Mid): 0.988/fish
- Pool 2 (Deep): 0.985/fish

**Result (Monte Carlo verified, 300k trials):**

| Zone | RTP | House Edge | Win Rate | Comparison |
|------|-----|------------|----------|------------|
| 1 | 96% | 4% | 35% | Like blackjack |
| 2 | 93% | 7% | 31% | Like roulette |
| 3 | 88% | 12% | 24% | Like slots |
| 4 | 84% | 16% | 21% | Like slots (loose) |
| 5 | 77% | 23% | 13% | Like keno |

## Key Learnings

### 1. Multiplicative compounding is brutal
In `outcome = bet × m₁ × ... × mₙ`, even a 1% deviation from 1.0 per fish compounds dramatically. At 18 fish: `0.97^18 = 0.58` but `0.99^18 = 0.83`. The difference between "unplayable" and "fun" is just 2% per fish.

### 2. Big multipliers dominate arithmetic mean
A single x3.0 fish at 3% probability contributes 0.09 to the average — as much as an x0.9 fish at 10% probability. To compensate for exciting high-value fish, you need MANY common low-value fish.

### 3. Weighted average = per-fish expected multiplier
For independent multiplicative events, `E[product] = product of E[each]`. So the pool's weighted average mult is all you need to compute theoretical RTP: `RTP = (avg_mult)^n × 100%`.

### 4. Win RATE matters for engagement
A game with 96% RTP can feel terrible if the win rate is 5% (high-variance, rare big payouts). For Mersion, we need ~20-35% win rate so players regularly see their coins go UP, even though they lose on average.

### 5. Depth = natural difficulty scaling
More fish encounters = more multiplicative compounding. This gives a clean risk/reward curve without needing separate math per zone — just use the same pool with different encounter counts.

## Files Modified

- `index.html` — added Mersion game (HTML, CSS, JS) and rebalanced fish pools

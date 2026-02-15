# Mersion — Game Design Document

## Concept

A modernized submarine descends into marine depths. The player loads coins into the sub, chooses a depth zone, and watches the submarine dive through an ocean full of fish. Each fish carries a multiplier — when it collides with the submarine, the multiplier applies to the coins inside. The deeper you go, the more fish you encounter, and the wilder the multipliers become.

**Genre:** Casino / Luck-based
**Mechanic:** Multiplicative random encounters with physics-based collision
**Visual style:** Canvas-rendered underwater scene with ancient ruins backdrop

## Gameplay Flow

```
[Setup Phase]                    [Dive Phase]

  Select Zone ──► Enter Bet ──► Submarine descends
  (1-5)           (coins)       Fish swim randomly
                                Collision = multiplier applies
                                Progress bar fills
                                Reaches target depth
                                     │
                                     ▼
                              [Result: coins in sub]
                              Win if coins > bet
                              Loss if coins < bet
```

## Zones

| Zone | Name | Depth | Fish Count | Pool | RTP | House Edge | Win Rate |
|------|------|-------|------------|------|-----|------------|----------|
| 1 | Shallow Reef | 200m | 4 | Shallow | 96% | 4% | 35% |
| 2 | Coral Gardens | 500m | 7 | Shallow | 93% | 7% | 31% |
| 3 | Midnight Abyss | 1000m | 10 | Mid | 88% | 12% | 24% |
| 4 | Hadal Trench | 3000m | 14 | Mid | 85% | 16% | 21% |
| 5 | Mariana Deep | 6000m | 18 | Deep | 77% | 23% | 13% |

**Risk/reward:** deeper zones have more encounters (more compounding risk) but also higher variance — rare x2-x3 fish chains can yield massive payouts.

## Casino Math

### Core Formula

```
outcome = bet × m₁ × m₂ × ... × mₙ
```

Where `mᵢ` is the multiplier from fish encounter `i`, and `n` = fish count for the zone.

Since fish are independent: `E[outcome] = bet × (avg_mult)^n`

### Fish Pools

**Pool 0 — Shallow Reef** (avg = 0.990/fish)

| Fish | Mult | Weight | Probability |
|------|------|--------|-------------|
| 🦈 | x2.0 | 3 | 2.6% |
| 🐠 | x1.5 | 8 | 6.9% |
| 🐬 | x1.3 | 12 | 10.3% |
| 🐟 | x1.1 | 16 | 13.8% |
| 🪸 | x0.95 | 14 | 12.1% |
| 🦀 | x0.85 | 48 | 41.4% |
| 🦑 | x0.7 | 10 | 8.6% |
| 🐡 | x0.5 | 5 | 4.3% |

**Pool 1 — Twilight Zone** (avg = 0.988/fish)

| Fish | Mult | Weight | Probability |
|------|------|--------|-------------|
| 🐋 | x2.5 | 2 | 1.6% |
| 🦈 | x2.0 | 5 | 4.0% |
| 🐠 | x1.5 | 9 | 7.1% |
| 🐬 | x1.3 | 11 | 8.7% |
| 🐟 | x1.1 | 14 | 11.1% |
| 🪸 | x0.9 | 15 | 11.9% |
| 🦀 | x0.8 | 58 | 46.0% |
| 🦑 | x0.6 | 8 | 6.3% |
| 🐡 | x0.4 | 4 | 3.2% |

**Pool 2 — Deep Abyss** (avg = 0.985/fish)

| Fish | Mult | Weight | Probability |
|------|------|--------|-------------|
| 🐋 | x3.0 | 3 | 2.5% |
| 🦈 | x2.0 | 6 | 5.0% |
| 🐠 | x1.5 | 9 | 7.6% |
| 🐬 | x1.3 | 10 | 8.4% |
| 🐟 | x1.1 | 12 | 10.1% |
| 🪸 | x0.9 | 12 | 10.1% |
| 🦀 | x0.75 | 53 | 44.5% |
| 🦑 | x0.5 | 9 | 7.6% |
| 🪼 | x0.3 | 5 | 4.2% |

### Outcome Distribution (Zone 5, 18 fish)

```
Wipeout  (<10 coins):  46%  ██████████████████████████████████████
Loss     (10-99):      41%  ████████████████████████████████
Win      (100-199):     4%  ███
Big Win  (200-999):     7%  █████
Jackpot  (1000+):       1%  █
```

### Key Insight: Multiplicative Compounding

In multiplicative games, even if most fish are "small loss" (x0.85), a lucky chain of x2.0 → x1.5 → x1.3 can turn 100 coins into 390. This is what makes deep dives exciting — the variance increases with depth, creating rare but dramatic wins while the house still profits on average.

**Comparison to real casino games:**
- Slots: 85-98% RTP → Mersion Zone 1-3 is in this range
- Roulette: 94-97% RTP → Mersion Zone 1-2
- Keno: 75-80% RTP → Mersion Zone 5

## Visual Elements

### Canvas Rendering Pipeline

```
1. Ocean gradient (darkens with depth)
2. Light rays from surface (fade with progress)
3. Flash overlay (on fish collision)
4. Ancient underwater city (fades in with depth)
5. Bubbles (40, with wobble animation)
6. Depth particles
7. Background decorative fish (28, random swim patterns)
8. Active multiplier fish (with glow + label pills)
9. Submarine (hull, tower, periscope, viewport, propeller)
10. Coin text on submarine
```

### Fish Rendering

Fish are drawn using bezier curves (not circles/emojis):
- Proper body shape with head and tail
- Animated tail wag (sine wave)
- Dorsal fin
- Belly highlight
- Eye with pupil

**Multiplier fish:** green glow (good) or red glow (bad), with pill-shaped label showing the multiplier value.

**Background fish:** 28 decorative fish in teal/cyan and orange/gold hues, various sizes, random swim directions and wobble patterns.

### Ancient City

Procedurally generated structures on the ocean floor:
- Temple with 5 columns and triangular roof
- Broken column (left side)
- Stone arch (right side)
- Scattered ruin blocks
- Tall pillar
- Pyramid with step lines
- 12 seaweed patches with sway animation

City visibility is tied to dive progress (alpha increases as submarine descends).

## Function Reference

| Function | Purpose |
|----------|---------|
| `startMersion()` | Validate bet, init state, start dive |
| `initMersionCanvas()` | Set up canvas, create bubbles/bg fish/city |
| `mersionGameLoop(ts)` | Main game loop (progress, spawn, update, draw) |
| `spawnMersionFish()` | Create multiplier fish from weighted pool |
| `updateMersionFish()` | Move fish, check collisions |
| `applyFishHit(fish)` | Apply multiplier, flash, log, check wipeout |
| `drawMersionFrame(progress)` | Full canvas render |
| `drawFishShape(ctx, size, color, alpha)` | Bezier fish body |
| `drawAncientCity(ctx, state, progress)` | Render city structures |
| `generateAncientCity(W, H, dpr)` | Create city structure data |
| `finishMersionDive()` | Calculate result, payout, show notification |
| `resetMersion()` | Clean up state, show setup screen |
| `selectStation(id)` | UI: select depth zone |
| `pickWeightedFish(pool)` | Random fish from weighted pool |
| `getPoolForZone(zoneId)` | Map zone → fish pool |
| `mersionBack()` | Exit game (blocked during dive) |

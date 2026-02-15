# Mersion — Financial Model

## The Fundamental Equation

```
outcome = bet × m₁ × m₂ × ... × mₙ

E[outcome] = bet × μⁿ

where μ = weighted average multiplier per fish
      n = number of fish encounters in the zone
```

**RTP** (Return to Player) = `μⁿ × 100%`

**House Edge** = `1 − μⁿ`

**Solving for μ given target RTP:** `μ = RTP^(1/n)`

## The Key Insight

The entire margin model operates in a **~1.5% band around 1.0**. Tiny changes in μ produce dramatic changes in RTP at high n:

```
μ = 0.990 → at 18 fish: RTP = 83.5%
μ = 0.988 → at 18 fish: RTP = 80.6%
μ = 0.985 → at 18 fish: RTP = 76.2%
```

A 0.5% change in μ swings the house edge by ~7 percentage points on deep dives.

## Minimal Config

Three numbers control the entire model — one `target_mu` per pool:

```json
{
  "pools": [
    { "name": "Shallow", "target_mu": 0.990, "max_mult": 2.0, "volatility": "low"    },
    { "name": "Mid",     "target_mu": 0.988, "max_mult": 2.5, "volatility": "medium" },
    { "name": "Deep",    "target_mu": 0.985, "max_mult": 3.0, "volatility": "high"   }
  ],
  "zones": [
    { "id": 1, "name": "Shallow Reef",  "n": 4,  "pool": 0 },
    { "id": 2, "name": "Coral Gardens",  "n": 7,  "pool": 0 },
    { "id": 3, "name": "Midnight Abyss", "n": 10, "pool": 1 },
    { "id": 4, "name": "Hadal Trench",   "n": 14, "pool": 1 },
    { "id": 5, "name": "Mariana Deep",   "n": 18, "pool": 2 }
  ]
}
```

Everything else derives from these values.

## Derived Metrics

| Zone | n | μ | RTP | Edge | Win Rate | 2x+ | 5x+ |
|------|---|---|-----|------|----------|------|------|
| 1 Shallow Reef | 4 | 0.990 | 96.1% | 3.9% | 34% | 7% | 0.2% |
| 2 Coral Gardens | 7 | 0.990 | 93.2% | 6.8% | 31% | 9% | 0.7% |
| 3 Midnight Abyss | 10 | 0.988 | 88.6% | 11.4% | 22% | 9% | 2.3% |
| 4 Hadal Trench | 14 | 0.988 | 84.4% | 15.6% | 18% | 9% | 2.5% |
| 5 Mariana Deep | 18 | 0.985 | 76.2% | 23.8% | 11% | 6% | 2.5% |

## Sensitivity Table

How RTP shifts when μ changes by ±0.001:

### Pool 0 (Shallow, zones 1-2)

| Δμ | Zone 1 RTP | Zone 1 Edge | Zone 2 RTP | Zone 2 Edge |
|----|-----------|-------------|-----------|-------------|
| −0.003 | 94.9% | 5.1% | 91.2% | 8.8% |
| −0.001 | 95.7% | 4.3% | 92.5% | 7.5% |
| **0** | **96.1%** | **3.9%** | **93.2%** | **6.8%** |
| +0.001 | 96.4% | 3.6% | 93.9% | 6.1% |
| +0.003 | 97.2% | 2.8% | 95.2% | 4.8% |

### Pool 1 (Mid, zones 3-4)

| Δμ | Zone 3 RTP | Zone 3 Edge | Zone 4 RTP | Zone 4 Edge |
|----|-----------|-------------|-----------|-------------|
| −0.003 | 86.0% | 14.0% | 80.9% | 19.1% |
| −0.001 | 87.7% | 12.3% | 83.3% | 16.7% |
| **0** | **88.6%** | **11.4%** | **84.4%** | **15.6%** |
| +0.001 | 89.5% | 10.5% | 85.7% | 14.3% |
| +0.003 | 91.4% | 8.6% | 88.1% | 11.9% |

### Pool 2 (Deep, zone 5)

| Δμ | Zone 5 RTP | Zone 5 Edge |
|----|-----------|-------------|
| −0.003 | 72.1% | 27.9% |
| −0.001 | 74.8% | 25.2% |
| **0** | **76.2%** | **23.8%** |
| +0.001 | 77.6% | 22.4% |
| +0.003 | 80.5% | 19.5% |

## Variance and Engagement

Two pools with the same μ feel completely different:

- **Low variance** (all fish ≈ x0.99): every game returns ~96%. Boring — no wins, no drama.
- **High variance** (x0.3 to x3.0, avg = 0.99): wild swings. Losses hurt, but wins are thrilling.

The `volatility` parameter controls the spread. Higher volatility = wider range of fish multipliers = more drama per game while maintaining the same long-term house edge.

**Log-space variance** determines outcome spread: `Var[ln(outcome)] = n × Var[ln(m)]`

This means deeper zones (higher n) naturally have wider outcome distributions even with the same pool — creating a natural risk/reward progression.

## Pool Construction Algorithm

Given `target_mu`, `max_mult`, and `volatility`:

1. Define "exciting" fish (x1.1 to x_max) with fixed weights
2. Define "loss" fish (x0.3 to x0.7) with fixed weights
3. Calculate one **ballast fish** weight to hit exactly target_mu

```
ballast_weight = (sum_fixed - target_mu × total_fixed) / (target_mu - ballast_mult)
```

The ballast fish (x0.75–x0.85 depending on volatility) absorbs all the error, ensuring the mathematical average is precisely on target.

## Revenue Projection Formula

```
Daily GGR = Σ (bets_per_zone × avg_bet × house_edge_zone)
Monthly GGR = Daily GGR × 30
Blended Edge = Daily GGR / (total_bets × avg_bet)
```

Example at 500 bets/day, 50 coin avg bet, zone mix 30/25/25/12/8%:

| Metric | Value |
|--------|-------|
| Daily GGR | 2,374 coins |
| Monthly GGR | 71,213 coins |
| Blended house edge | 9.5% |
| Daily handle | 25,000 coins |

## Tuning Guide

| Want to... | Change | Direction |
|-----------|--------|-----------|
| Reduce house edge | Increase target_mu | +0.001 per step |
| More player wins | Increase target_mu OR reduce n per zone | |
| More drama/excitement | Increase volatility, increase max_mult | Keep μ same |
| Higher revenue | Decrease target_mu | −0.001 per step |
| Add new zone | Add entry to zones[] with n and pool ref | |
| Add new pool | Add pool with target_mu, recalculate fish | |

## Industry Benchmarks

| Game Type | Typical RTP | Our Comparable Zone |
|-----------|-------------|---------------------|
| Blackjack | 97-99.5% | Zone 1 (96%) |
| Roulette | 94-97% | Zone 1-2 (93-96%) |
| Slots (loose) | 92-97% | Zone 2 (93%) |
| Slots (tight) | 85-91% | Zone 3-4 (84-89%) |
| Keno | 75-80% | Zone 5 (76%) |

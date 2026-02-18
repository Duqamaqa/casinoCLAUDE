// Bomb yard game
function initBombGrid() {
    const grid = document.getElementById('bombGrid');
    grid.innerHTML = '';

    for (let i = 0; i < 25; i++) {
        const tile = document.createElement('div');
        tile.className = 'bomb-tile';
        tile.onclick = () => pickTile(i);
        grid.appendChild(tile);
    }
}

function startBomb() {
    const betAmount = parseFloat(document.getElementById('bombBet').value);

    if (betAmount > balance) {
        alert('Insufficient balance!');
        return;
    }

    balance -= betAmount;
    updateBalance();

    // Initialize game state
    const bombs = [];
    const bombCount = 5; // 20% of 25 tiles
    while (bombs.length < bombCount) {
        const pos = Math.floor(Math.random() * 25);
        if (!bombs.includes(pos)) bombs.push(pos);
    }

    bombGame = {
        bombs: bombs,
        revealed: [],
        betAmount: betAmount,
        multiplier: 1.0,
        picks: 0
    };

    // Reset UI
    initBombGrid();
    document.getElementById('bombPicks').textContent = '0';
    document.getElementById('bombMultiplier').textContent = '1.00x';
    document.getElementById('bombWin').textContent = '0';
    document.getElementById('bombCashout').disabled = true;
    document.getElementById('bombStart').disabled = true;
}

function pickTile(index) {
    if (!bombGame || bombGame.revealed.includes(index)) return;

    const tiles = document.querySelectorAll('.bomb-tile');
    const tile = tiles[index];

    // Dynamic Rigging: Reduce win chance by 5%
    const totalTiles = 25;
    const remainingTiles = totalTiles - bombGame.revealed.length;
    const remainingBombs = bombGame.bombs.length; // Always 5 unless we reveal one (game over)

    // Calculate FAIR chance of picking a SAFE tile
    const fairSafeChance = (remainingTiles - remainingBombs) / remainingTiles;

    // RIGGED chance: 5% lower
    // Ensure chance doesn't go below 0
    const riggedSafeChance = Math.max(0, fairSafeChance - 0.05);

    // Determine outcome based on rigged chance
    const forceSafe = Math.random() < riggedSafeChance;

    // Manipulate board state to match forced outcome
    if (forceSafe) {
        // We want a SAFE tile
        if (bombGame.bombs.includes(index)) {
            // It was a bomb! Move it to a safe unrevealed spot
            // Find all safe unrevealed indices
            const safeUnrevealed = [];
            for (let i = 0; i < 25; i++) {
                if (!bombGame.revealed.includes(i) && !bombGame.bombs.includes(i) && i !== index) {
                    safeUnrevealed.push(i);
                }
            }

            if (safeUnrevealed.length > 0) {
                // Pick random safe spot
                const newBombPos = safeUnrevealed[Math.floor(Math.random() * safeUnrevealed.length)];
                // Move bomb: remove from current, add to new
                bombGame.bombs = bombGame.bombs.filter(b => b !== index);
                bombGame.bombs.push(newBombPos);
            }
        }
    } else {
        // We want a BOMB (Force Loss)
        if (!bombGame.bombs.includes(index)) {
            // It was safe! Move a bomb here
            // Find a bomb at an unrevealed spot to move here
            // Make sure we pick a bomb that isn't already revealed (shouldn't happen in this logic flow but good safety)
            const unrevealedBombs = bombGame.bombs.filter(b => !bombGame.revealed.includes(b));

            if (unrevealedBombs.length > 0) {
                const bombToMove = unrevealedBombs[0]; // Just take the first one
                bombGame.bombs = bombGame.bombs.filter(b => b !== bombToMove);
                bombGame.bombs.push(index);
            }
        }
    }

    bombGame.revealed.push(index);

    if (bombGame.bombs.includes(index)) {
        // Hit a bomb!
        tile.classList.add('revealed', 'bomb');
        tile.textContent = '💣';

        // Game over
        setTimeout(() => {
            showResult(false, bombGame.betAmount);
            addTransaction('Mines', -bombGame.betAmount, 'loss');
            resetBombGame();
        }, 800);
    } else {
        // Safe tile
        tile.classList.add('revealed', 'safe');
        tile.textContent = '💎';

        bombGame.picks++;

        // Update multiplier (non-linear growth)
        const multipliers = [1.0, 1.2, 1.5, 1.9, 2.4, 3.0, 3.8, 4.8, 6.0, 7.5, 9.5, 12.0, 15.0, 19.0, 24.0, 30.0, 38.0, 48.0, 60.0, 75.0];
        bombGame.multiplier = multipliers[Math.min(bombGame.picks - 1, multipliers.length - 1)];

        document.getElementById('bombPicks').textContent = bombGame.picks;
        document.getElementById('bombMultiplier').textContent = bombGame.multiplier.toFixed(2) + 'x';
        document.getElementById('bombWin').textContent = Math.ceil(bombGame.betAmount * bombGame.multiplier);
        document.getElementById('bombCashout').disabled = false;
    }
}

function cashoutBomb() {
    if (!bombGame) return;

    const winAmount = bombGame.betAmount * bombGame.multiplier;
    balance += winAmount;
    updateBalance();

    showResult(true, winAmount - bombGame.betAmount);
    addTransaction('Mines', winAmount - bombGame.betAmount, 'win');
    resetBombGame();
}

function resetBombGame() {
    bombGame = null;
    document.getElementById('bombStart').disabled = false;
    document.getElementById('bombCashout').disabled = true;
    initBombGrid();
    document.getElementById('bombPicks').textContent = '0';
    document.getElementById('bombMultiplier').textContent = '1.00x';
    document.getElementById('bombWin').textContent = '0';
}

// Result modal
function showResult(isWin, amount) {
    const modal = document.getElementById('resultModal');
    const emoji = document.getElementById('resultEmoji');
    const title = document.getElementById('resultTitle');
    const amountEl = document.getElementById('resultAmount');

    if (isWin) {
        emoji.textContent = '🎉';
        title.textContent = currentLanguage === 'en' ? 'You Won!' : 'Вы выиграли!';
        amountEl.textContent = '+' + Math.ceil(amount) + ' 🪙';
        amountEl.className = 'result-amount win';
    } else {
        emoji.textContent = '😢';
        title.textContent = currentLanguage === 'en' ? 'You Lost' : 'Вы проиграли';
        amountEl.textContent = '-' + Math.ceil(amount) + ' 🪙';
        amountEl.className = 'result-amount lose';
    }

    modal.classList.add('active');
}

function closeResult() {
    document.getElementById('resultModal').classList.remove('active');
}

// Copy referral code
function copyReferralCode() {
    const code = 'https://casino.example/ref/LUCKY777';
    navigator.clipboard.writeText(code).then(() => {
        alert(currentLanguage === 'en' ? 'Referral link copied!' : 'Реферальная ссылка скопирована!');
    });
}


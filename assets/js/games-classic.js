// Dice game
function updateDiceChance() {
    const chance = document.getElementById('diceSlider').value;
    document.getElementById('diceChance').textContent = chance + '%';

    const multiplier = (100 / chance) * 0.97;
    document.getElementById('diceMultiplier').textContent = multiplier.toFixed(2) + 'x';
}

function playDice() {
    const betAmount = parseFloat(document.getElementById('diceBet').value);
    const chance = parseInt(document.getElementById('diceSlider').value);

    if (betAmount > balance) {
        alert('Insufficient balance!');
        return;
    }

    balance -= betAmount;
    updateBalance();

    const roll = Math.random() * 100;
    // Rigged: Real chance is displayed chance - 5%
    const win = roll < (chance - 5);

    if (win) {
        const multiplier = (100 / chance) * 0.97;
        const winAmount = betAmount * multiplier;
        balance += winAmount;
        showResult(true, winAmount - betAmount);
        addTransaction('Dice', winAmount - betAmount, 'win');
    } else {
        showResult(false, betAmount);
        addTransaction('Dice', -betAmount, 'loss');
    }

    updateBalance();
}

// Coin flip game
function selectCoin(side) {
    selectedCoin = side;
    document.getElementById('headsOption').classList.remove('selected');
    document.getElementById('tailsOption').classList.remove('selected');

    if (side === 'heads') {
        document.getElementById('headsOption').classList.add('selected');
    } else {
        document.getElementById('tailsOption').classList.add('selected');
    }
}

function playCoinFlip() {
    if (!selectedCoin) {
        alert('Select heads or tails!');
        return;
    }

    const betAmount = parseFloat(document.getElementById('coinBet').value);

    if (betAmount > balance) {
        alert('Insufficient balance!');
        return;
    }

    balance -= betAmount;
    updateBalance();

    // Win chance: 45% (Rigged: 5% lower than 50/50)
    const isWin = Math.random() < 0.45;

    // Determine result for internal consistency/logging if needed
    // If win, result matches selection. If loss, result is opposite.
    const result = isWin ? selectedCoin : (selectedCoin === 'heads' ? 'tails' : 'heads');
    const win = isWin;

    if (win) {
        const winAmount = betAmount * 2;
        balance += winAmount;
        showResult(true, winAmount - betAmount);
        addTransaction('Coin Flip', winAmount - betAmount, 'win');
    } else {
        showResult(false, betAmount);
        addTransaction('Coin Flip', -betAmount, 'loss');
    }

    updateBalance();
}

// Roulette game
function selectRoulette(color) {
    selectedRoulette = color;
    document.getElementById('redBet').classList.remove('selected');
    document.getElementById('blackBet').classList.remove('selected');
    document.getElementById('greenBet').classList.remove('selected');

    document.getElementById(color + 'Bet').classList.add('selected');
}

function playRoulette() {
    if (!selectedRoulette) {
        alert('Select a color!');
        return;
    }

    const betAmount = parseFloat(document.getElementById('rouletteBet').value);

    if (betAmount > balance) {
        alert('Insufficient balance!');
        return;
    }

    balance -= betAmount;
    updateBalance();

    // Wheel: 18 red, 18 black, 2 green = 38 total
    const roll = Math.random() * 38;
    let result;

    // Rigged Logic for Red/Black: Force 45% win chance
    if (selectedRoulette === 'red' || selectedRoulette === 'black') {
        const isWin = Math.random() < 0.45;
        if (isWin) {
            result = selectedRoulette;
        } else {
            // Force a loss (pick opposite or green)
            result = selectedRoulette === 'red' ? 'black' : 'red';
            // Small chance for green to mimic real wheel behavior on loss
            if (Math.random() < 0.05) result = 'green';
        }
    } else {
        // Standard logic for Green (or other bets if added)
        if (roll < 18) result = 'red';
        else if (roll < 36) result = 'black';
        else result = 'green';
    }

    // Animate wheel
    const wheel = document.getElementById('rouletteWheel');
    wheel.style.transform = 'rotate(720deg)';
    setTimeout(() => {
        wheel.style.transform = 'rotate(0deg)';
        wheel.textContent = result === 'red' ? '🔴' : result === 'black' ? '⚫' : '🟢';
    }, 1000);

    setTimeout(() => {
        const win = result === selectedRoulette;

        if (win) {
            const multiplier = result === 'green' ? 14 : 2;
            const winAmount = betAmount * multiplier;
            balance += winAmount;
            showResult(true, winAmount - betAmount);
            addTransaction('Roulette', winAmount - betAmount, 'win');
        } else {
            showResult(false, betAmount);
            addTransaction('Roulette', -betAmount, 'loss');
        }

        updateBalance();
    }, 1500);
}


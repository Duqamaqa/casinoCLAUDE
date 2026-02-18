// Global state
let balance = 1000; // Balance in game coins (1 coin = $0.01 USD)
let currentLanguage = 'en';
let selectedCoin = null;
let selectedRoulette = null;
let bombGame = null;
let transactions = [];

// Update balance display
function updateBalance() {
    document.getElementById('headerBalance').textContent = Math.ceil(balance);
    document.getElementById('mainBalance').textContent = Math.ceil(balance);
    // Update USD equivalent in wallet only
    const usdBalanceEl = document.getElementById('usdBalance');
    if (usdBalanceEl) {
        usdBalanceEl.textContent = (balance * 0.01).toFixed(2);
    }
}

// Add transaction
function addTransaction(game, amount, type) {
    const transaction = {
        game: game,
        amount: amount,
        type: type,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    transactions.unshift(transaction);
    if (transactions.length > 20) transactions.pop(); // Keep last 20
    renderTransactions();
}

// Render transactions
function renderTransactions() {
    const list = document.getElementById('transactionList');
    list.innerHTML = '';

    if (transactions.length === 0) {
        list.innerHTML = '<div style="text-align: center; color: var(--text-tertiary); padding: 20px;">No transactions yet</div>';
        return;
    }

    transactions.forEach(tx => {
        const item = document.createElement('div');
        item.className = 'transaction-item';

        const amountClass = tx.amount > 0 ? 'positive' : 'negative';
        const amountSign = tx.amount > 0 ? '+' : '';

        item.innerHTML = `
            <div class="transaction-info">
                <div class="transaction-type">${tx.game}</div>
                <div class="transaction-time">${tx.time}</div>
            </div>
            <div class="transaction-amount ${amountClass}">${amountSign}${Math.ceil(tx.amount)} 🪙</div>
        `;

        list.appendChild(item);
    });
}

// Screen navigation
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');

    // Update nav active state
    document.querySelectorAll('.nav-item').forEach((item, index) => {
        item.classList.remove('active');
    });

    const navMap = {
        'homeScreen': 0,
        'gamesScreen': 1,
        'walletScreen': 2,
        'referralsScreen': 3,
        'profileScreen': 4
    };

    if (navMap[screenId] !== undefined) {
        document.querySelectorAll('.nav-item')[navMap[screenId]].classList.add('active');
    }
}

function showGame(gameId) {
    const gameMap = {
        'dice': 'diceGame',
        'coinflip': 'coinflipGame',
        'roulette': 'rouletteGame',
        'bombyard': 'bombyardGame',
        'mersion': 'mersionGame'
    };
    showScreen(gameMap[gameId]);
}

// Language toggle
function toggleLanguage() {
    currentLanguage = currentLanguage === 'en' ? 'ru' : 'en';
    document.getElementById('langText').textContent = currentLanguage.toUpperCase();

    // Update all translatable elements
    document.querySelectorAll('[data-en]').forEach(el => {
        el.textContent = el.getAttribute('data-' + currentLanguage);
    });

    // Update profile language display
    document.getElementById('profileLang').textContent = currentLanguage === 'en' ? 'English' : 'Русский';
}


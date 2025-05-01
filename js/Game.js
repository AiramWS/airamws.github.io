
window.gameState = {
    currentPlayer: null,
    player1Color: selectedColorLeft,
    player2Color: selectedColorRight,
    cells: [],
    originalNames: { player1: '', player2: '' }
};

document.addEventListener('DOMContentLoaded', () => {
    gameState.originalNames.player1 = document.querySelector('#left-panel h1').textContent;
    gameState.originalNames.player2 = document.querySelector('#right-panel h1').textContent;

    // Game mode buttons
    document.querySelectorAll('.m-button[data-mode]').forEach(button => {
        button.addEventListener('click', function() {
            if (window.isGameActive) return;
            startGame(this.dataset.mode);
        });
    });
});

function startGame(gameMode) {
    window.isGameActive = true;
    gameState.gameMode = gameMode; // Store game mode

    if (gameMode === '1vBOT') {
        gameState.currentPlayer = 'player1'; // Human always starts first against bot
    } else {
        gameState.currentPlayer = Math.random() < 0.5 ? 'player1' : 'player2';
    }

    document.querySelectorAll('.user-panel').forEach(panel => {
        const saveBtn = panel.querySelector('.save-settings');
        if (saveBtn) closeUserSettings(saveBtn);
    });

    document.querySelector('.menu').style.display = 'none';
    document.getElementById('game-grid').style.display = 'grid';


    document.querySelectorAll('.user-settings, .save-settings').forEach(btn => {
        btn.style.pointerEvents = 'none';
        btn.style.opacity = '0.5';
    });

    // Initialize game
    gameState.cells = [];
    createGameGrid(8);
    updateTurnIndicator();

    if (gameMode === '1vBOT' && gameState.currentPlayer === 'player2') {
        setTimeout(botMakeMove, 1000);
    }
    document.getElementById('game-grid').classList.remove('bot-turn');
}

function botMakeMove() {
    if (!window.isGameActive || gameState.gameMode !== '1vBOT') return;

    // Get all empty cells
    const validMoves = gameState.cells
        .map((cell, index) => ({ cell, index }))
        .filter(({ cell }) => cell.owner === null)
        .map(move => move.index);

    if (validMoves.length === 0) return;

    // Randomly select a valid move
    const randomIndex = Math.floor(Math.random() * validMoves.length);
    const selectedMove = validMoves[randomIndex];

    setTimeout(() => {
        document.getElementById('game-grid').classList.remove('bot-turn');
        handleCellClick(selectedMove);
    }, 1000);
}

function createGameGrid(size) {
    const container = document.getElementById('game-grid');
    container.innerHTML = '';
    container.style.gridTemplateColumns = `repeat(${size}, 1fr)`;

    for (let i = 0; i < size * size; i++) {
        const cell = document.createElement('div');
        cell.className = 'grid-cell';
        
        gameState.cells[i] = {
            element: cell,
            owner: null,
            x: Math.floor(i / size),
            y: i % size
        };

        cell.addEventListener('click', () => handleCellClick(i));
        container.appendChild(cell);
    }
}

function handleCellClick(index) {
    
    if (!window.isGameActive || gameState.cells[index].owner) return;

    // Immediately update the clicked cell
    gameState.cells[index].owner = gameState.currentPlayer;
    gameState.cells[index].element.style.backgroundColor = 
        gameState.currentPlayer === 'player1' 
        ? gameState.player1Color 
        : gameState.player2Color;

    // Then check for captures
    checkCaptures(index);
    
    // Switch turns
    gameState.currentPlayer = gameState.currentPlayer === 'player1' ? 'player2' : 'player1';
    updateTurnIndicator();

    if (gameState.gameMode === '1vBOT' && 
        gameState.currentPlayer === 'player2' && 
        !isGridFull()) {
        // Add visual feedback for bot's turn
        document.getElementById('game-grid').classList.add('bot-turn');
        setTimeout(botMakeMove, 1000);
    }

    if (isGridFull()) endGame();
}

function checkCaptures(index, simulate = false, simulatedState = null) {
    const state = simulate ? simulatedState : gameState;
    const currentPlayer = simulate ? 'player2' : state.currentPlayer;
    let totalCaptured = 0;

    const directions = [
        { dx: -1, dy: 0 }, { dx: 1, dy: 0 },
        { dx: 0, dy: -1 }, { dx: 0, dy: 1 },
        { dx: -1, dy: -1 }, { dx: 1, dy: 1 },
        { dx: -1, dy: 1 }, { dx: 1, dy: -1 }
    ];

    directions.forEach(({ dx, dy }) => {
        let x = state.cells[index].x + dx;
        let y = state.cells[index].y + dy;
        const toFlip = [];

        while (x >= 0 && x < 8 && y >= 0 && y < 8) {
            const cellIndex = x * 8 + y;
            const cell = state.cells[cellIndex];

            if (!cell.owner) break;
            if (cell.owner === currentPlayer) {
                totalCaptured += toFlip.length;
                if (!simulate) {
                    toFlip.forEach(i => {
                        gameState.cells[i].owner = state.currentPlayer;
                        gameState.cells[i].element.style.backgroundColor = 
                            state.currentPlayer === 'player1' 
                            ? gameState.player1Color 
                            : gameState.player2Color;
                    });
                }
                break;
            } else {
                toFlip.push(cellIndex);
            }
            x += dx;
            y += dy;
        }
    });
    
    return totalCaptured;
}

function updateTurnIndicator() {
    const playerName = gameState.currentPlayer === 'player1' 
        ? gameState.originalNames.player1 
        : gameState.originalNames.player2;
    document.querySelector('#central-panel h1').textContent = `${playerName}'s turn`;
}

function isGridFull() {
    return gameState.cells.every(cell => cell.owner !== null);
}

function endGame() {
    window.isGameActive = false;
    const p1Cells = gameState.cells.filter(c => c.owner === 'player1').length;
    const p2Cells = gameState.cells.filter(c => c.owner === 'player2').length;

    const player1Name = document.querySelector('#left-panel h1').textContent;
    const player2Name = document.querySelector('#right-panel h1').textContent;
    
    const winner = p1Cells === p2Cells ? 'It\'s a tie!' 
        : p1Cells > p2Cells 
        ? `${player1Name} Wins!` 
        : `${player2Name} Wins!`;

    // Create game over modal
    const modal = document.createElement('div');
    modal.className = 'game-over-modal';
    modal.innerHTML = `
        <h2>Game Over!</h2>
        <p>${winner}</p>
        <button id="return-to-menu">Return to Menu</button>
    `;

    // Add click handler for return button
    modal.querySelector('#return-to-menu').addEventListener('click', () => {
        // Reset game state
        document.getElementById('game-grid').style.display = 'none';
        document.querySelector('.menu').style.display = 'flex';
        
        // Reset central panel text
        const centralPanel = document.getElementById('central-panel');
        centralPanel.querySelector('h1').textContent = '· COLOR BATTLE ·';
        
        // Reset panel sizing
        centralPanel.style.width = ''; // Remove any inline width
        centralPanel.style.height = ''; // Remove any inline height
        
        // Re-enable settings buttons
        document.querySelectorAll('.user-settings, .save-settings').forEach(btn => {
            btn.style.pointerEvents = 'auto';
            btn.style.opacity = '1';
        });
    
        modal.remove();
    });

    document.body.appendChild(modal);
}
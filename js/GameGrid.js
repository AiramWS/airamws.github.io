function createGameGrid(size) {
    const container = document.getElementById('game-grid');
    container.style.gridTemplateColumns = `repeat(${size}, 1fr)`;

    for (let i = 0; i < size * size; i++) {
        const cell = document.createElement('div');
        cell.className = 'grid-cell';
        
        const row = Math.floor(i / size);
        const col = i % size;
        
        if ((row + col) % 2 === 1) {
            cell.classList.add('dark');
        }
        
        container.appendChild(cell);
    }
}


document.addEventListener('DOMContentLoaded', function() {
    createGameGrid(8);
});
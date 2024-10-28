const gridContainer = document.getElementById('grid-container');
const scoreDisplay = document.getElementById('score');
const restartButton = document.getElementById('restart-button');
let score = 0;
let grid = [];

function init() {
    grid = Array.from({ length: 4 }, () => Array(4).fill(0));
    score = 0;
    scoreDisplay.textContent = score;
    drawGrid();
    addRandomTile();
    addRandomTile();
}

function drawGrid() {
    gridContainer.innerHTML = '';
    grid.forEach((row) => {
        row.forEach((value) => {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.classList.add(`cell-${value}`);
            cell.textContent = value !== 0 ? value : '';
            gridContainer.appendChild(cell);
        });
    });
}

function addRandomTile() {
    const emptyCells = [];
    grid.forEach((row, rowIndex) => {
        row.forEach((value, colIndex) => {
            if (value === 0) emptyCells.push({ row: rowIndex, col: colIndex });
        });
    });
    if (emptyCells.length > 0) {
        const { row, col } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        grid[row][col] = Math.random() < 0.9 ? 2 : 4;
    }
}

function move(direction) {
    let moved = false;
    let merged = Array.from({ length: 4 }, () => Array(4).fill(false));

    const getRowOrCol = (index) => (direction === 'left' || direction === 'right' ? grid[index] : grid.map(row => row[index]));
    const setRowOrCol = (index, newValue) => {
        if (direction === 'left' || direction === 'right') {
            grid[index] = newValue;
        } else {
            grid.forEach((row, rowIndex) => {
                row[index] = newValue[rowIndex];
            });
        }
    };

    for (let i = 0; i < 4; i++) {
        const originalRowOrCol = getRowOrCol(i).filter(value => value !== 0);
        const newRowOrCol = [];
        let j = 0;

        while (j < originalRowOrCol.length) {
            if (originalRowOrCol[j] === originalRowOrCol[j + 1] && !merged[i][j]) {
                newRowOrCol.push(originalRowOrCol[j] * 2);
                score += originalRowOrCol[j] * 2;
                merged[i][j] = true;
                j += 2;
            } else {
                newRowOrCol.push(originalRowOrCol[j]);
                j++;
            }
        }

        while (newRowOrCol.length < 4) {
            newRowOrCol.push(0);
        }

        if (JSON.stringify(originalRowOrCol) !== JSON.stringify(newRowOrCol)) {
            moved = true;
            setRowOrCol(i, newRowOrCol);
            animateTiles(originalRowOrCol, newRowOrCol, i);
        }
    }

    if (moved) {
        addRandomTile();
        drawGrid();
        scoreDisplay.textContent = score;
        checkGameOver();
    }
}

function animateTiles(originalRowOrCol, newRowOrCol, index) {
    originalRowOrCol.forEach((value, j) => {
        if (value !== newRowOrCol[j]) {
            const cell = gridContainer.children[index * 4 + j];
            anime({
                targets: cell,
                scale: [
                    { value: 0, duration: 150 },
                    { value: 1, duration: 150 }
                ],
                translateY: [
                    { value: value > newRowOrCol[j] ? -100 : 100, duration: 150 },
                    { value: 0, duration: 150 }
                ],
                easing: 'easeInOutExpo'
            });
        }
    });
}

function checkGameOver() {
    if (grid.flat().every(cell => cell !== 0)) {
        alert('Game Over! Your score: ' + score);
        init();
    }
}

document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowLeft':
            move('left');
            break;
        case 'ArrowRight':
            move('right');
            break;
        case 'ArrowUp':
            move('up');
            break;
        case 'ArrowDown':
            move('down');
            break;
    }
});

restartButton.addEventListener('click', init);

// Start the game on load
init();

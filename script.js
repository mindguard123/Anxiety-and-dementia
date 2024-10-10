function hideAllGames() {
    const games = document.querySelectorAll('#game-area > div');
    games.forEach(game => game.style.display = 'none');
}
function startTicTacToe() {
    hideAllGames();
    const ticTacToeGame = document.getElementById('tic-tac-toe-game');
    ticTacToeGame.style.display = 'block';

    ticTacToeGame.innerHTML = `
        <h3>Tic-Tac-Toe</h3>
        <div id="tic-tac-toe-board">
            <div class="tic-tac-toe-cell" data-cell="0"></div>
            <div class="tic-tac-toe-cell" data-cell="1"></div>
            <div class="tic-tac-toe-cell" data-cell="2"></div>
            <div class="tic-tac-toe-cell" data-cell="3"></div>
            <div class="tic-tac-toe-cell" data-cell="4"></div>
            <div class="tic-tac-toe-cell" data-cell="5"></div>
            <div class="tic-tac-toe-cell" data-cell="6"></div>
            <div class="tic-tac-toe-cell" data-cell="7"></div>
            <div class="tic-tac-toe-cell" data-cell="8"></div>
        </div>
        <p id="tic-tac-toe-status">Player X's turn</p>
    `;

    const cells = document.querySelectorAll('#tic-tac-toe-board .tic-tac-toe-cell');
    let currentPlayer = 'X';
    let gameActive = true;

    function checkWinner() {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]              
        ];

        for (const pattern of winPatterns) {
            const [a, b, c] = pattern;
            if (cells[a].textContent && cells[a].textContent === cells[b].textContent && cells[a].textContent === cells[c].textContent) {
                document.getElementById('tic-tac-toe-status').textContent = `Player ${currentPlayer} wins!`;
                gameActive = false;
                return;
            }
        }

        if ([...cells].every(cell => cell.textContent)) {
            document.getElementById('tic-tac-toe-status').textContent = 'It\'s a draw!';
            gameActive = false;
        }
    }

    cells.forEach(cell => {
        cell.addEventListener('click', function() {
            if (gameActive && !this.textContent) {
                this.textContent = currentPlayer;
                checkWinner();
                currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
                document.getElementById('tic-tac-toe-status').textContent = `Player ${currentPlayer}'s turn`;
            }
        });
    });
}

function startPuzzleGame() {
    const puzzleGame = document.getElementById('puzzle-game');
    const grid = [...Array(8).keys()].map(x => x + 1).concat(null);
    shuffle(grid);

    puzzleGame.innerHTML = '';
    grid.forEach((num, index) => {
        const cell = document.createElement('div');
        cell.className = 'puzzle-cell';
        if (num !== null) {
            cell.textContent = num;
            cell.addEventListener('click', () => moveTile(index));
        } else {
            cell.className += ' empty';
        }
        puzzleGame.appendChild(cell);
    });
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function moveTile(index) {
    const puzzleGame = document.getElementById('puzzle-game');
    const grid = Array.from(puzzleGame.children);
    const emptyIndex = grid.findIndex(cell => cell.className.includes('empty'));
    
    const rowIndex = Math.floor(index / 3);
    const colIndex = index % 3;
    const emptyRowIndex = Math.floor(emptyIndex / 3);
    const emptyColIndex = emptyIndex % 3;

    const isValidMove = (Math.abs(rowIndex - emptyRowIndex) === 1 && colIndex === emptyColIndex) ||
                        (Math.abs(colIndex - emptyColIndex) === 1 && rowIndex === emptyRowIndex);

    if (isValidMove) {
        [grid[emptyIndex].textContent, grid[index].textContent] = [grid[index].textContent, grid[emptyIndex].textContent];
        grid[emptyIndex].className = 'puzzle-cell';
        grid[index].className += ' empty';
        if (isPuzzleSolved()) {
            alert('Congratulations! You solved the puzzle.');
        }
    }
}

function isPuzzleSolved() {
    const puzzleGame = document.getElementById('puzzle-game');
    const grid = Array.from(puzzleGame.children);
    return grid.every((cell, index) => {
        const expectedValue = index === grid.length - 1 ? null : index + 1;
        return (cell.textContent === expectedValue || (expectedValue === null && cell.className.includes('empty')));
    });
}

function startMemoryGame() {
    const memoryGame = document.getElementById('memory-game');
    const icons = ['🍎', '🍌', '🍇', '🍓', '🍎', '🍌', '🍇', '🍓'];
    shuffle(icons);
    let revealed = [];
    let matches = 0;

    memoryGame.innerHTML = '';
    icons.forEach(icon => {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.addEventListener('click', () => {
            if (revealed.length < 2 && !card.classList.contains('revealed')) {
                card.textContent = icon;
                card.classList.add('revealed');
                revealed.push(card);
                if (revealed.length === 2) {
                    if (revealed[0].textContent === revealed[1].textContent) {
                        matches++;
                        revealed = [];
                        if (matches === icons.length / 2) {
                            setTimeout(() => alert('You win!'), 100);
                        }
                    } else {
                        setTimeout(() => {
                            revealed.forEach(card => {
                                card.textContent = '';
                                card.classList.remove('revealed');
                            });
                            revealed = [];
                        }, 1000);
                    }
                }
            }
        });
        memoryGame.appendChild(card);
    });
}

function startSudoku() {
    const sudokuGame = document.getElementById('sudoku-game');
    const board = [
        [5, 3, '', '', 7, '', '', '', ''],
        [6, '', '', 1, 9, 5, '', '', ''],
        ['', 9, 8, '', '', '', '', 6, ''],
        [8, '', '', '', 6, '', '', '', 3],
        [4, '', '', 8, '', 3, '', '', 1],
        [7, '', '', '', 2, '', '', '', 6],
        ['', 6, '', '', '', '', 2, 8, ''],
        ['', '', '', 4, 1, 9, '', '', 5],
        ['', '', '', '', 8, '', '', 7, 9]
    ];

    sudokuGame.innerHTML = '';
    const table = document.createElement('table');
    table.className = 'sudoku-board';

    board.forEach((row, i) => {
        const tr = document.createElement('tr');
        row.forEach((cell, j) => {
            const td = document.createElement('td');
            const input = document.createElement('input');
            input.type = 'number';
            input.min = 1;
            input.max = 9;
            input.value = cell;
            input.disabled = cell !== '';
            td.appendChild(input);
            tr.appendChild(td);
        });
        table.appendChild(tr);
    });

    sudokuGame.appendChild(table);
}

function startSimonGame() {
    const simonGame = document.getElementById('simon-game');
    simonGame.innerHTML = '';
    const colors = ['red', 'green', 'blue', 'yellow'];
    const sequence = [];
    let playerSequence = [];
    let level = 0;

    const startButton = document.createElement('button');
    startButton.textContent = 'Start Simon Game';
    startButton.addEventListener('click', nextSequence);
    simonGame.appendChild(startButton);

    function nextSequence() {
        level++;
        playerSequence = [];
        const randomColor = colors[Math.floor(Math.random() * 4)];
        sequence.push(randomColor);
        showSequence();
    }

    function showSequence() {
        let index = 0;
        const interval = setInterval(() => {
            const color = sequence[index];
            flashColor(color);
            index++;
            if (index >= sequence.length) {
                clearInterval(interval);
            }
        }, 1000);
    }

    function flashColor(color) {
        const button = document.createElement('button');
        button.style.backgroundColor = color;
        button.className = 'simon-button';
        simonGame.appendChild(button);
        setTimeout(() => simonGame.removeChild(button), 500);
    }
}

function start2048Game() {
    const game2048 = document.getElementById('2048-game');
    const size = 4;
    let board = Array(size).fill().map(() => Array(size).fill(0));
    generateNewTile();
    generateNewTile();
    drawBoard();

    window.addEventListener('keydown', handleKeyPress);

    function generateNewTile() {
        let emptyTiles = [];
        for (let r = 0; r < size; r++) {
            for (let c = 0; c < size; c++) {
                if (board[r][c] === 0) emptyTiles.push({ r, c });
            }
        }
        if (emptyTiles.length > 0) {
            const { r, c } = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
            board[r][c] = Math.random() < 0.9 ? 2 : 4;
        }
    }

    function drawBoard() {
        game2048.innerHTML = '';
        board.forEach(row => {
            const rowElement = document.createElement('div');
            rowElement.className = 'row';
            row.forEach(cell => {
                const cellElement = document.createElement('div');
                cellElement.className = 'cell';
                cellElement.textContent = cell === 0 ? '' : cell;
                rowElement.appendChild(cellElement);
            });
            game2048.appendChild(rowElement);
        });
    }

    function handleKeyPress(e) {
        switch (e.key) {
            case 'ArrowUp':
                moveUp();
                break;
            case 'ArrowDown':
                moveDown();
                break;
            case 'ArrowLeft':
                moveLeft();
                break;
            case 'ArrowRight':
                moveRight();
                break;
        }
        generateNewTile();
        drawBoard();
    }

    function moveUp() {
    }

    function moveDown() {
    }

    function moveLeft() {
    }

    function moveRight() {
    }
}

function startMinesweeper() {
    const minesweeperGame = document.getElementById('minesweeper-game');
    const rows = 8;
    const columns = 8;
    const mineCount = 10;
    let grid = Array(rows).fill().map(() => Array(columns).fill({ mine: false, revealed: false }));
    placeMines();
    drawGrid();

    function placeMines() {
        let minesPlaced = 0;
        while (minesPlaced < mineCount) {
            const row = Math.floor(Math.random() * rows);
            const col = Math.floor(Math.random() * columns);
            if (!grid[row][col].mine) {
                grid[row][col].mine = true;
                minesPlaced++;
            }
        }
    }

    function drawGrid() {
        minesweeperGame.innerHTML = '';
        for (let r = 0; r < rows; r++) {
            const rowElement = document.createElement('div');
            rowElement.className = 'minesweeper-row';
            for (let c = 0; c < columns; c++) {
                const cellElement = document.createElement('div');
                cellElement.className = 'minesweeper-cell';
                cellElement.addEventListener('click', () => revealCell(r, c));
                rowElement.appendChild(cellElement);
            }
            minesweeperGame.appendChild(rowElement);
        }
    }

    function revealCell(row, col) {
        if (grid[row][col].revealed) return;
        grid[row][col].revealed = true;
        const cellElement = minesweeperGame.children[row].children[col];
        if (grid[row][col].mine) {
            cellElement.textContent = '💣';
            alert('Game Over!');
            drawGrid();
        } else {
            const count = countAdjacentMines(row, col);
            cellElement.textContent = count > 0 ? count : '';
        }
    }

    function countAdjacentMines(row, col) {
        let count = 0;
        for (let r = row - 1; r <= row + 1; r++) {
            for (let c = col - 1; c <= col + 1; c++) {
                if (r >= 0 && r < rows && c >= 0 && c < columns && grid[r][c].mine) count++;
            }
        }
        return count;
    }
}

function startWordSearch() {
    const wordSearchGame = document.getElementById('word-search-game');
    const grid = [
        ['C', 'A', 'T', 'X', 'P', 'T', 'C'],
        ['T', 'H', 'O', 'R', 'D', 'O', 'G'],
        ['K', 'X', 'R', 'S', 'O', 'X', 'A'],
        ['X', 'B', 'I', 'R', 'D', 'P', 'T'],
        ['V', 'X', 'T', 'A', 'X', 'X', 'U'],
        ['U', 'X', 'Q', 'X', 'I', 'H', 'F'],
        ['F', 'I', 'S', 'H', 'R', 'I', 'B'],
    ];

    const wordsToFind = ['CAT', 'DOG', 'BIRD', 'FISH', 'THOR'];
    wordSearchGame.innerHTML = `<p>Find the following words: ${wordsToFind.join(', ')}</p>`;

    const table = document.createElement('table');
    table.className = 'word-search-grid';
    grid.forEach(row => {
        const tr = document.createElement('tr');
        row.forEach(letter => {
            const td = document.createElement('td');
            td.textContent = letter;
            tr.appendChild(td);
        });
        table.appendChild(tr);
    });
    wordSearchGame.appendChild(table);
}

function startConnectFour() {
    const connectFourGame = document.getElementById('connect-four-game');
    const rows = 6;
    const columns = 7;
    let currentPlayer = 'Red';
    const grid = Array.from({ length: rows }, () => Array(columns).fill(null));

    connectFourGame.innerHTML = '';
    const board = document.createElement('div');
    board.className = 'connect-four-board';

    for (let r = 0; r < rows; r++) {
        const row = document.createElement('div');
        row.className = 'connect-four-row';
        for (let c = 0; c < columns; c++) {
            const cell = document.createElement('div');
            cell.className = 'connect-four-cell';
            cell.addEventListener('click', () => dropDisc(c));
            row.appendChild(cell);
        }
        board.appendChild(row);
    }

    connectFourGame.appendChild(board);

    function dropDisc(column) {
        for (let r = rows - 1; r >= 0; r--) {
            if (!grid[r][column]) {
                grid[r][column] = currentPlayer;
                updateBoard();
                if (checkWin(currentPlayer)) {
                    setTimeout(() => alert(`${currentPlayer} wins!`), 100);
                }
                currentPlayer = currentPlayer === 'Red' ? 'Yellow' : 'Red';
                break;
            }
        }
    }

    function updateBoard() {
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < columns; c++) {
                const cell = board.children[r].children[c];
                cell.style.backgroundColor = grid[r][c];
            }
        }
    }

    function checkWin(player) {
        const directions = [
            { r: 0, c: 1 }, { r: 1, c: 0 },
            { r: 1, c: 1 }, { r: 1, c: -1 }
        ];

        return directions.some(({ r: dr, c: dc }) => {
            return grid.some((row, r) => {
                return row.some((cell, c) => {
                    return cell === player && [1, 2, 3].every(i => {
                        const nr = r + dr * i;
                        const nc = c + dc * i;
                        return grid[nr] && grid[nr][nc] === player;
                    });
                });
            });
        });
    }
}

function startWhackAMole() {
    const whackAMoleGame = document.getElementById('whack-a-mole-game');
    whackAMoleGame.innerHTML = '';

    const gridSize = 9; // 3x3 grid
    const moles = Array(gridSize).fill(false); // Tracks active moles
    let score = 0; // Player score

    // Create the grid
    for (let i = 0; i < gridSize; i++) {
        const mole = document.createElement('div');
        mole.className = 'mole-hole';
        mole.addEventListener('click', () => whackMole(i));
        whackAMoleGame.appendChild(mole);
    }

    // Function to display a mole at a random position
    function showMole() {
        const randomIndex = Math.floor(Math.random() * gridSize);
        moles[randomIndex] = true;
        const moleHole = whackAMoleGame.children[randomIndex];
        moleHole.classList.add('mole');
        setTimeout(() => hideMole(randomIndex), 1000); // Mole disappears after 1 second
    }

    // Function to hide the mole
    function hideMole(index) {
        moles[index] = false;
        const moleHole = whackAMoleGame.children[index];
        moleHole.classList.remove('mole');
    }

    // Function to handle mole whacking
    function whackMole(index) {
        if (moles[index]) {
            score++;
            moles[index] = false;
            const moleHole = whackAMoleGame.children[index];
            moleHole.classList.remove('mole');
            document.getElementById('whack-a-mole-score').textContent = `Score: ${score}`;
        }
    }

    // Game loop to show moles randomly
    setInterval(showMole, 1500); // A new mole appears every 1.5 seconds

    // Display the score
    const scoreBoard = document.createElement('div');
    scoreBoard.id = 'whack-a-mole-score';
    scoreBoard.textContent = `Score: ${score}`;
    whackAMoleGame.appendChild(scoreBoard);
}

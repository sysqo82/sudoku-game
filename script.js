document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('sudoku-container');
    const submitButton = document.getElementById('submit-button');
    const levelSelect = document.getElementById('level-select');

    let solution = generateSudokuSolution();
    let puzzle = generateSudokuPuzzle(solution, 'easy');

    function renderPuzzle(puzzle) {
        container.innerHTML = '';
        for (let i = 0; i < 81; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');

            const input = document.createElement('input');
            input.type = 'text';
            input.maxLength = 1;

            const row = Math.floor(i / 9);
            const col = i % 9;

            if (puzzle[row][col] !== 0) {
                input.value = puzzle[row][col];
                input.disabled = true;
            }

            cell.appendChild(input);
            container.appendChild(cell);
        }
    }

    renderPuzzle(puzzle);

    levelSelect.addEventListener('change', () => {
        const level = levelSelect.value;
        puzzle = generateSudokuPuzzle(solution, level);
        renderPuzzle(puzzle);
    });

    submitButton.addEventListener('click', () => {
        const inputs = container.querySelectorAll('input');
        let isCorrect = true;

        inputs.forEach((input, index) => {
            const row = Math.floor(index / 9);
            const col = index % 9;
            const value = parseInt(input.value);

            if (value !== solution[row][col]) {
                input.style.backgroundColor = 'red';
                isCorrect = false;
            } else {
                input.style.backgroundColor = 'green';
            }
        });

        if (isCorrect) {
            alert('Congratulations! You solved the Sudoku puzzle correctly.');
        } else {
            alert('Some answers are incorrect. Please try again.');
        }
    });
});

function generateSudokuSolution() {
    const solution = Array.from({ length: 9 }, () => Array(9).fill(0));
    fillGrid(solution);
    return solution;
}

function fillGrid(grid) {
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (grid[row][col] === 0) {
                shuffleArray(numbers);
                for (let num of numbers) {
                    if (isValid(grid, row, col, num)) {
                        grid[row][col] = num;
                        if (fillGrid(grid)) {
                            return true;
                        }
                        grid[row][col] = 0;
                    }
                }
                return false;
            }
        }
    }
    return true;
}

function isValid(grid, row, col, num) {
    for (let x = 0; x < 9; x++) {
        if (grid[row][x] === num || grid[x][col] === num) {
            return false;
        }
    }

    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (grid[startRow + i][startCol + j] === num) {
                return false;
            }
        }
    }

    return true;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function generateSudokuPuzzle(solution, level) {
    // This function generates a Sudoku puzzle from the solution.
    // The number of cells to remove depends on the level.
    const puzzle = solution.map(row => row.slice());
    let removeCount;

    switch (level) {
        case 'easy':
            removeCount = 20;
            break;
        case 'medium':
            removeCount = 40;
            break;
        case 'hard':
            removeCount = 60;
            break;
        default:
            removeCount = 40;
    }

    let removed = 0;
    while (removed < removeCount) {
        const row = Math.floor(Math.random() * 9);
        const col = Math.floor(Math.random() * 9);
        if (puzzle[row][col] !== 0) {
            puzzle[row][col] = 0;
            removed++;
        }
    }

    return puzzle;
}
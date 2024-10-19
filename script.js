class SudokuGame {
    constructor() {
        this.container = document.getElementById('sudoku-container');
        this.submitButton = document.getElementById('submit-button');
        this.levelSelect = document.getElementById('level-select');
        this.solution = this.generateSudokuSolution();
        this.puzzle = this.generateSudokuPuzzle(this.solution, 'easy');

        this.init();
    }

    init() {
        this.renderPuzzle(this.puzzle);
        this.levelSelect.addEventListener('change', this.handleLevelChange.bind(this));
        this.submitButton.addEventListener('click', this.handleSubmit.bind(this));
    }

    handleLevelChange() {
        const level = this.levelSelect.value;
        this.puzzle = this.generateSudokuPuzzle(this.solution, level);
        this.renderPuzzle(this.puzzle);
    }

    handleSubmit() {
        const inputs = this.container.querySelectorAll('input');
        let isCorrect = true;

        inputs.forEach((input, index) => {
            const row = Math.floor(index / 9);
            const col = index % 9;
            const value = parseInt(input.value);

            if (value !== this.solution[row][col]) {
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
    }

    renderPuzzle(puzzle) {
        this.container.innerHTML = '';
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
            this.container.appendChild(cell);
        }
    }

    generateSudokuSolution() {
        const solution = Array.from({ length: 9 }, () => Array(9).fill(0));
        this.fillGrid(solution);
        return solution;
    }

    fillGrid(grid) {
        const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (grid[row][col] === 0) {
                    this.shuffleArray(numbers);
                    for (let num of numbers) {
                        if (this.isValid(grid, row, col, num)) {
                            grid[row][col] = num;
                            if (this.fillGrid(grid)) {
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

    isValid(grid, row, col, num) {
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

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    generateSudokuPuzzle(solution, level) {
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

        if (level === 'easy') {
            this.ensureIncomplete3x3Grids(puzzle);
        }

        return puzzle;
    }

    ensureIncomplete3x3Grids(puzzle) {
        for (let boxRow = 0; boxRow < 3; boxRow++) {
            for (let boxCol = 0; boxCol < 3; boxCol++) {
                let filledCount = 0;
                const cells = [];
                for (let row = 0; row < 3; row++) {
                    for (let col = 0; col < 3; col++) {
                        const cellRow = boxRow * 3 + row;
                        const cellCol = boxCol * 3 + col;
                        if (puzzle[cellRow][cellCol] !== 0) {
                            filledCount++;
                            cells.push([cellRow, cellCol]);
                        }
                    }
                }
                if (filledCount === 9) {
                    const [removeRow, removeCol] = cells[Math.floor(Math.random() * cells.length)];
                    puzzle[removeRow][removeCol] = 0;
                }
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new SudokuGame();
});
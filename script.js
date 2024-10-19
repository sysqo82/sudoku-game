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
    // This function generates a complete, valid Sudoku solution.
    // For simplicity, we'll use a pre-defined solution here.
    return [
        [5, 3, 4, 6, 7, 8, 9, 1, 2],
        [6, 7, 2, 1, 9, 5, 3, 4, 8],
        [1, 9, 8, 3, 4, 2, 5, 6, 7],
        [8, 5, 9, 7, 6, 1, 4, 2, 3],
        [4, 2, 6, 8, 5, 3, 7, 9, 1],
        [7, 1, 3, 9, 2, 4, 8, 5, 6],
        [9, 6, 1, 5, 3, 7, 2, 8, 4],
        [2, 8, 7, 4, 1, 9, 6, 3, 5],
        [3, 4, 5, 2, 8, 6, 1, 7, 9]
    ];
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
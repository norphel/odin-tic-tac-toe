const player = (name, mark) => {
    const getName = () => name;
    const getMark = () => mark;
    return { getName, getMark };
}

const gameBoard = (() => {
    let board = []; 
    
    const getBoard = () => board;

    const markAlreadyExists = (index) => {
        if (board[index] === undefined) {
            return false;
        }
        return true;
    }

    const addPlayerMark = (index, playerMark) => {
        board[index] = playerMark;
    }

    const resetBoard = () => {
        board = [];
    }

    return { getBoard, markAlreadyExists, addPlayerMark, resetBoard };
})();

const displayController = (() => {

    const renderGameBoard = (board) => {
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => cell.textContent = board[cell.id]);
    }

    const displayResult = (message) => {
        const msg = document.querySelector('.message');
        msg.textContent = message;
        const replay = document.createElement('button');
        replay.textContent = "Replay";
        replay.setAttribute('class', 'replay');
        msg.appendChild(replay);
    }

    return { renderGameBoard, displayResult };
})();

const gameLogic = (() => {
    const playerX = player('playerX', 'X');
    const playerO = player('playerO', 'O');
    let current_player = playerX;


    //add player mark
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.addEventListener('click', addPlayerMark);
    })

    function addPlayerMark(e) {
        // check if a mark already exits at the clicked cell
        const index = e.target.id;
        if (gameBoard.markAlreadyExists(index)) {
            return;
        } else {
            gameBoard.addPlayerMark(index, current_player.getMark()); 
            displayController.renderGameBoard(gameBoard.getBoard()); 

            const result = wonOrTied(current_player.getMark()); 
            if (result.win === true) {
                displayController.displayResult(current_player.getName() + ' wins!');
                
                //disable continuing of game once the current player wins
                cells.forEach(cell => {
                    cell.removeEventListener('click', addPlayerMark);
                })
            } else if (result.tie === true) {
                displayController.displayResult('Tie!');
            }

            current_player = changeCurrentPlayer();
        }
    }

    function changeCurrentPlayer() {
        return current_player === playerX ? playerO : playerX;
    } 

    function wonOrTied(playerMark) {
        const winConditions = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];
        
        let win = false;
        let tie = false;

        for (let i = 0; i < winConditions.length; i++) {
            if (gameBoard.getBoard()[winConditions[i][0]] === playerMark && gameBoard.getBoard()[winConditions[i][1]] === playerMark && gameBoard.getBoard()[winConditions[i][2]] === playerMark) {
                win = true;
            }
        }
        if (win === false) {
            let flag = true;
            for (let i = 0; i < 9; i++) {
                if (gameBoard.getBoard()[i] === undefined) {
                    flag = false;
                }
            }
            if (flag === true) {
                tie = true;
            }
        }
        return { win, tie };
    }
})();
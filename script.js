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

    let players = [];

    const renderPage = () => {

        console.log('Called renderPage');

        const playerXName = document.getElementById('player-x-name').value;
        const playerOName = document.getElementById('player-o-name').value;
        const playerX = player(playerXName, 'X');
        const playerO = player(playerOName, 'O');
        players.push(playerX);
        players.push(playerO);

        const main = document.querySelector('main');
        main.innerHTML = "";

        const playerDetails = document.createElement('div');
        playerDetails.classList.add('players');

        const playerXDetail = document.createElement('div');
        playerXDetail.classList.add('playerX');
        playerXDetail.textContent = `X: ${playerXName}`;

        const playerODetail = document.createElement('div');
        playerODetail.classList.add('playerO');
        playerODetail.textContent = `O: ${playerOName}`;

        playerDetails.appendChild(playerXDetail);
        playerDetails.appendChild(playerODetail);

        const gameBoard = document.createElement('div');
        gameBoard.classList.add('game-board');

        for (let i = 0; i < 9; i++) {
            const div = document.createElement('div');
            div.classList.add('cell');
            div.setAttribute('id', i);
            gameBoard.appendChild(div);
        }

        const result = document.createElement('div');
        result.classList.add('message');

        main.appendChild(playerDetails);
        main.appendChild(gameBoard);
        main.appendChild(result);

        gameLogic.playGame();
        
    }

    const getPlayers = () => players;

    const renderGameBoard = (board) => {
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => cell.textContent = board[cell.id]);
    }

    const displayResult = (message) => {
        const msg = document.querySelector('.message');
        msg.textContent = message;

        const btns = document.createElement('div');
        btns.classList.add('re-buttons');
        const replay = document.createElement('button');
        replay.textContent = "Replay";
        replay.setAttribute('class', 'replay');

        const restart = document.createElement('button');
        restart.textContent = "Restart";
        restart.setAttribute('class', 'restart');

        replay.addEventListener('click', gameLogic.replayGame);
        restart.addEventListener('click', gameLogic.restartGame);

        btns.appendChild(replay);
        btns.appendChild(restart);
        msg.appendChild(btns);
    }

    const restartPage = () => {
        const main = document.querySelector('main');
        main.innerHTML = "";

        const form = document.createElement('form');
        form.setAttribute('action', "");
        form.classList.add('start-game');

        const playerXDiv = document.createElement('div');
        playerXDiv.classList.add('player');

        const playerXLabel = document.createElement('label');
        playerXLabel.setAttribute('for', "player-x-name");
        playerXLabel.textContent = 'Player X name:';

        const playerXInput = document.createElement('input');
        playerXInput.setAttribute('type', 'text');
        playerXInput.setAttribute('id', 'player-x-name');
        playerXInput.setAttribute('name', 'player-x-name');
        playerXInput.setAttribute('required', '');

        playerXDiv.appendChild(playerXLabel);
        playerXDiv.appendChild(playerXInput);

        const playerODiv = document.createElement('div');
        playerODiv.classList.add('player');

        const playerOLabel = document.createElement('label');
        playerOLabel.setAttribute('for', "player-o-name");
        playerOLabel.textContent = 'Player O name:';

        const playerOInput = document.createElement('input');
        playerOInput.setAttribute('type', 'text');
        playerOInput.setAttribute('id', 'player-o-name');
        playerOInput.setAttribute('name', 'player-o-name');
        playerOInput.setAttribute('required', '');

        playerODiv.appendChild(playerOLabel);
        playerODiv.appendChild(playerOInput);

        const br = document.createElement('br');

        const btnDiv = document.createElement('div');
        const btn = document.createElement('button');
        btn.setAttribute('type', 'submit');
        btn.textContent = 'Let\'s Play!';
        btnDiv.appendChild(btn);

        form.appendChild(playerXDiv);
        form.appendChild(br);
        form.appendChild(playerODiv);
        form.appendChild(br);
        form.appendChild(btnDiv);

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            renderPage();
        });

        main.appendChild(form);
    }

    return { renderPage, getPlayers, renderGameBoard, displayResult, restartPage };
})();

const gameLogic = (() => {
    const playGame = () => {
        const [playerX, playerO] = displayController.getPlayers();
        let current_player = playerX;
        const players = displayController.getPlayers();
        console.log(players[0]);


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
    }

    const replayGame = () => {
        gameBoard.resetBoard();
        displayController.renderGameBoard(gameBoard.getBoard());
        const msg = document.querySelector('.message');
        msg.textContent = "";
        playGame();
    }

    const restartGame = () => {
        gameBoard.resetBoard();
        displayController.restartPage();
    }

    return { playGame, replayGame, restartGame };
})();

displayController.restartPage();
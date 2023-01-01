const player = (name, mark) => {
    const getName = () => name;
    const getMark = () => mark;
    return {getName, getMark};
}
const gameBoard = (() => {
    let board = ['X', 'O', 'X', 'O', 'X', 'O', 'X', 'O', 'X']; // manual for now
    
    return {board}
})();
const displayController = (() => {
    const areas = document.querySelectorAll('.area');
    areas.forEach((area) =>
        area.addEventListener('click', (e) => {
            console.log(e.target.id);
        }));

    const board = gameBoard.board;
    const renderGameBoard = () => {
        for (let i = 0; i < board.length; i++) {
            console.log(board[i]);
        }
    }
    return {renderGameBoard}
})();
displayController.renderGameBoard();
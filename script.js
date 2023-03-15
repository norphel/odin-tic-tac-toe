const player = (name, mark) => {
    const getName = () => name;
    const getMark = () => mark;
    return {getName, getMark};
}
const gameBoard = (() => {
    let board = ['X', 'O', 'X', 'O', 'X', 'O', 'X', 'O', 'X']; // manual for now
    
    const renderGameBoard = () => {
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => cell.textContent = board[cell.id]);
    }
    return {renderGameBoard}
})();
const displayController = (() => {
    // const cells = document.querySelectorAll('.cell');
    // cells.forEach((cell) =>
    //     cell.addEventListener('click', (e) => {
    //         console.log(e.target.id);
    //     }));
    // gameBoard.renderGameBoard();
})();
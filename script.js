
window.addEventListener('DOMContentLoaded', () => {
    const tiles = Array.from(document.querySelectorAll('.cell'));
    const playerDisplay = document.querySelector('.display-player');
    const resetButton = document.querySelector('.new-game');
    const announcer = document.querySelector('.announcer');

    // multiple sources had the board set up as an empty array of strings to count for each cell we made in the html.
    // i knew i needed something to represent the board and since my data cell indexes in the html doc are numbered i tried using an array of 0-8 but i ran into a hiccup where 
    // the x and o would not place on the board and therefore no winning conditions could come forward
    // the empty board array came from https://dev.to/bornasepic/pure-and-simple-tic-tac-toe-with-javascript-4pgn
    let board = ['', '', '', '', '', '', '', '', ''];
    let currentPlayer = 'X';
    let isGameActive = true;

    const PLAYERX_WON = 'PLAYERX_WON';
    const PLAYERO_WON = 'PLAYERO_WON';
    const TIE = 'TIE';


    // this seems to be the most common way to set up the winning conditions, multiple different sources i saw before i even started coding this game used this method
    // it is an array of arrays that lists out indexes of every possible win condition with a combination of rows, columns, and diagonals with the cells starting at 0 and ending at 8
    const winningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    
    function handleResultValidation() {
        let roundWon = false;
        // runs after each turn to see if someone has won or if there is a tie. the continue tells it to keep going while the break signifies that the game has been won
        for (let i = 0; i <= 7; i++) {
            const winCondition = winningConditions[i];
            // i was actually very stuck on this part when doing my original code. i got to the for loop and then my brain made the windows shut down noise
            // but basically what is going on here is that there are three sub arrays 0,1,2 and each contain 3 numbers of the board. using strict equality, we are checking to see if there
            // are any blank tiles on the board (' ') then we skip the loop and the game keeps going. if the tiles are filled in any winning combination then break takes us out of the loop
            // and then the win condition gets called with either player x or player o winning. if there are no empty spaces left but no winning conditions fulfilled then the game ends
            // in a tie
            // from https://dev.to/bornasepic/pure-and-simple-tic-tac-toe-with-javascript-4pgn
            const a = board[winCondition[0]];
            const b = board[winCondition[1]];
            const c = board[winCondition[2]];
            if (a === '' || b === '' || c === '') {
                continue;
            }
            if (a === b && b === c) {
                roundWon = true;
                break;
            }
        }

    if (roundWon) {
        // ternary operator https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator
            announce(currentPlayer === 'X' ? PLAYERX_WON : PLAYERO_WON);
            isGameActive = false;
            return;
        }

    if (!board.includes(''))
        announce(TIE);
    }

    const announce = (type) => {
        switch(type){
            case PLAYERO_WON:
                announcer.innerHTML = '✨Player <span class="playerO">O</span> Won✨';
                break;
            case PLAYERX_WON:
                announcer.innerHTML = '✨Player <span class="playerX">X</span> Won✨';
                break;
            case TIE:
                announcer.innerText = 'Both players are Tied!';
        }
        announcer.classList.remove('hide');
    };

    const isValidAction = (tile) => {
        // this fuction makes sure the players can only put their letters on empty tiles. it says if the inner text of a tile is x or o then being a valid move is false and then
        // the player letter will not show up in the tile but if it comes back as true then it will be able to be played
        if (tile.innerText === 'X' || tile.innerText === 'O'){
            return false;
        }

        return true;
    };

    const updateBoard =  (index) => {
        // sets the value of the board array equal to the current player
        board[index] = currentPlayer;
    }

    const changePlayer = () => {
        playerDisplay.classList.remove(`player${currentPlayer}`);
        // changes the current player to x if it was o or vice versa. it is a conditional that uses a ternary operator. i did have to look this up bc i kept seeing this notation in a lot
        // of sources and i just could not wrap my head around what it meant lol. a ternary operator gives a truthy/falsy result and can be used as an alternative to an if else statement
        // found it at https://dev.to/bornasepic/pure-and-simple-tic-tac-toe-with-javascript-4pgn but a lot of other places used it as well. this is the only source that explained what
        // it was and had a link for learning more. personally i think it's easier for me to understand than a tradition if else statement in terms of writing my own
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        playerDisplay.innerText = currentPlayer;
        playerDisplay.classList.add(`player${currentPlayer}`);
    }

    const userAction = (tile, index) => {
        // from this video https://youtu.be/B3pmT7Cpi24?t=396
        // function is called when the user clicks on a tile and is used to change turns. it uses the isValidAction function to check if someone won or if there is a tie.
        if(isValidAction(tile) && isGameActive) {
            tile.innerText = currentPlayer;
            tile.classList.add(`player${currentPlayer}`);
            updateBoard(index);
            handleResultValidation();
            changePlayer();
        }
    }
    
    const resetBoard = () => {
        // i was having trouble with my original function getting it to actually clear the board
        // from https://youtu.be/B3pmT7Cpi24?t=593 and https://dev.to/bornasepic/pure-and-simple-tic-tac-toe-with-javascript-4pgn 
        board = ['', '', '', '', '', '', '', '', ''];
        isGameActive = true;
        announcer.classList.add('hide');

        if (currentPlayer === 'O') {
            changePlayer();
        }

        tiles.forEach(tile => {
            tile.innerText = '';
            tile.classList.remove('playerX');
            tile.classList.remove('playerO');
        });
    }

    // got this specific code snippet from this video https://youtu.be/B3pmT7Cpi24?t=372
    // for some reason whenever i would try to code some functionality into the game none of the buttons would work and the x and o would not appear on the board
    tiles.forEach( (tile, index) => {
        tile.addEventListener('click', () => userAction(tile, index));
    });

    resetButton.addEventListener('click', resetBoard);
});
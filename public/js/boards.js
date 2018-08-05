/**
 * @name setupBoards
 * @desc sets up the player and opponent boards at the start of the game
 */
window.setupBoards = function setupBoards() {
  // set boards to their html elements
  const opponentBoardElement = document.getElementById('opponentBoard');
  const playerBoardElement = document.getElementById('playerBoard');
  for (let i = 0; i < window.boardSize; i += 1) { // loop through double array to create array and create td elements to create table
    // board will be 10x10
    player2Board[i] = Array(window.boardSize);
    player1Board[i] = Array(window.boardSize);
    // create row element so it creates a new row every 10 spaces
    const opponentRowElement = document.createElement('tr');
    const playerRowElement = document.createElement('tr');
    // add row element to the table
    opponentBoardElement.appendChild(opponentRowElement);
    playerBoardElement.appendChild(playerRowElement);
    for (let j = 0; j < window.boardSize; j += 1) {
      // set them all to the string false since we'll have more statuses than true and false
      player2Board[i][j] = 'false';
      player1Board[i][j] = 'false';
      // create table data element (space)
      const opponentSpaceElement = document.createElement('td');
      const playerSpaceElement = document.createElement('td');
      // add an id to the space with the number
      opponentSpaceElement.setAttribute('id', `opponentBoard${(i * window.boardSize) + j}`);
      playerSpaceElement.setAttribute('id', `playerBoard${(i * window.boardSize) + j}`);
      // add the click function
      opponentSpaceElement.setAttribute('onclick', `checkIfHit(${i},${j})`);
      playerSpaceElement.setAttribute('onclick', `removeShip(${i},${j})`);
      // add drag and drop function calls
      playerSpaceElement.setAttribute('ondragover', 'allowDrop(event)');
      playerSpaceElement.setAttribute('ondrop', `drop(event, ${(i * window.boardSize) + j}, ${i}, ${j})`);
      // add the space element to the table row
      opponentRowElement.appendChild(opponentSpaceElement);
      playerRowElement.appendChild(playerSpaceElement);
    }
  }
};

/**
 * @name checkIfHit
 * @param {number} x first index of the associated array of space element getting hit
 * @param {number} y second index of the associated array of space element getting hit
 * @desc check if the click hits a ship, set the status of the space on the array, and change the color of the space depending on the status
 */
window.checkIfHit = function checkIfHit(x, y) {
  if (window.gameStatus !== 'attack') return false;
  const shipType = window.opponentArray[x][y];
  const opponentSpaceElem = document.getElementById(`opponentBoard${(x * window.boardSize) + y}`);
  const playerSpaceElem = document.getElementById(`playerBoard${(x * window.boardSize) + y}`);
  if (['carrier', 'battleship', 'cruiser', 'submarine', 'destroyer'].includes(window.opponentArray[x][y])) { // move was a hit
    window.opponentArray[x][y] = 'hit';
    playerSpaceElem.style.backgroundColor = window.hitColor;
    opponentSpaceElem.style.backgroundColor = window.hitColor;
    if (!window.checkForWinCondition() && !window.checkIfShipSunk(shipType)) { // check if the player won the game before going to the next turn
      alert('HIT!');
      window.nextTurn();
    }
  } else if (window.opponentArray[x][y] === 'miss' || window.opponentArray[x][y] === 'hit') { // move has already been tried
    alert('Already Taken. Try again.');
  } else { // move was a miss
    window.opponentArray[x][y] = 'miss';
    opponentSpaceElem.style.backgroundColor = window.missColor;
    alert('Miss.');
    window.nextTurn();
  }
};

/**
 * @name switchBoards
 * @desc switch which board is which since it's the next player's turn
 */
window.switchBoards = function switchBoards() {
  // switch which array we use
  if (window.playerTurn === 1) {
    window.playerArray = window.player1Board;
    window.opponentArray = window.player2Board;
  } else {
    window.playerArray = window.player2Board;
    window.opponentArray = window.player1Board;
  }
  // switch colors displayed on boards
  for (let i = 0; i < window.boardSize; i += 1) {
    for (let j = 0; j < window.boardSize; j += 1) {
      const playerSpaceElem = document.getElementById(`playerBoard${(i * window.boardSize) + j}`);
      const opponentSpaceElem = document.getElementById(`opponentBoard${(i * window.boardSize) + j}`);
      if (window.playerArray[i][j] === 'hit') playerSpaceElem.style.backgroundColor = window.hitColor;
      else if (window.playerArray[i][j] === 'miss') playerSpaceElem.style.backgroundColor = window.missColor;
      else if (['carrier', 'battleship', 'cruiser', 'submarine', 'destroyer'].includes(window.playerArray[i][j])) playerSpaceElem.style.backgroundColor = window.shipColor;
      else playerSpaceElem.style.backgroundColor = window.defaultColor;
      if (window.opponentArray[i][j] === 'hit') opponentSpaceElem.style.backgroundColor = window.hitColor;
      else if (window.opponentArray[i][j] === 'miss') opponentSpaceElem.style.backgroundColor = window.missColor;
      else opponentSpaceElem.style.backgroundColor = window.defaultColor;
    }
  }
};

/**
 * @name checkIfShipSunk
 * @param {string} ship
 * @desc check if the player sunk a ship
 */
window.checkIfShipSunk = function checkIfShipSunk(ship) {
  for (let i = 0; i < window.boardSize; i += 1) {
    for (let j = 0; j < window.boardSize; j += 1) {
      if (window.opponentArray[i][j] === ship) return false;
    }
  }
  alert(`You sunk their ${ship}.`);
  window.nextTurn();
  return true;
};

/**
 * @name checkForWinCondition
 * @desc check if the hit won the game
 * @return bool for win or not
 */
window.checkForWinCondition = function checkForWinCondition() {
  for (let i = 0; i < window.boardSize; i += 1) {
    for (let j = 0; j < window.boardSize; j += 1) {
      if (['carrier', 'battleship', 'cruiser', 'submarine', 'destroyer'].includes(window.opponentArray[i][j])) return false;
    }
  }
  alert('WIN!');
  window.newGame();
  return true;
};

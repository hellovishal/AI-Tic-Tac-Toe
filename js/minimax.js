var box = document.querySelectorAll('td');
var currentState;
var max_depth;
var startingPlayer;
var player;
var resultDisplay = document.querySelector('p');

function setDepth(num) {
  max_depth = Number(num);
}

function setRival(str) {
  startingPlayer = str;
}

function newGame() {
  for (var i = 0; i < box.length; i++) {
    box[i].textContent = '';
    box[i].style.backgroundColor = 'gray';
    resultDisplay.textContent = '';
  }

  var si = new State(undefined);
  currentState = si;

  if (startingPlayer == 'aiagent') {
    //Choosing a random index
    var choosenIndex = Math.floor(Math.random() * 6);
    var arr = [0, 2, 4, 6, 8];

    box[arr[choosenIndex]].textContent = 'X';
    var j = box[arr[choosenIndex]].getAttribute('value');
    currentState.board[j] = 'X';
  }

  for (var i = 0; i < box.length; i++) {
    box[i].addEventListener('click', function () {
      if (this.textContent == '' && !currentState.isGameOver()) {
        this.textContent = 'O';

        var j = this.getAttribute('value');
        currentState.board[j] = 'O';
        currentState.showResult();
        if (!currentState.isGameOver()) {
          makeMove(currentState, 0, true);
        }
      }
    });
  }
}

function State(old) {
  this.player = '';
  this.winner = { direction: undefined, index: undefined, symbol: undefined };
  this.board = ['E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E'];

  if (typeof old !== 'undefined') {
    // if the state is constructed using a copy of another state
    var len = old.board.length;
    this.board = new Array(len);
    for (var itr = 0; itr < len; itr++) {
      this.board[itr] = old.board[itr];
    }
  }

  this.availableCells = function () {
    var indxs = [];
    for (var itr = 0; itr < 9; itr++) {
      if (this.board[itr] === 'E') {
        indxs.push(itr);
      }
    }
    return indxs;
  };

  this.isGameOver = function () {
    var B = this.board;

    //check rows
    for (var i = 0; i <= 6; i = i + 3) {
      if (B[i] !== 'E' && B[i] === B[i + 1] && B[i + 1] == B[i + 2]) {
        this.winner = { direction: 'H', index: i, symbol: B[i] }; //update the state result

        return true;
      }
    }

    //check columns
    for (var i = 0; i <= 2; i++) {
      if (B[i] !== 'E' && B[i] === B[i + 3] && B[i + 3] === B[i + 6]) {
        this.winner = { direction: 'V', index: i, symbol: B[i] }; //update the state result
        return true;
      }
    }

    //check diagonals
    for (var i = 0, j = 4; i <= 2; i = i + 2, j = j - 2) {
      if (B[i] !== 'E' && B[i] == B[i + j] && B[i + j] === B[i + 2 * j]) {
        this.winner = { direction: 'D', index: i, symbol: B[i] }; //update the state result

        return true;
      }
    }

    var available = this.availableCells();
    if (available.length == 0) {
      //the game is draw
      this.winner = { direction: undefined, index: undefined, symbol: 'draw' }; //update the state result
      return true;
    } else {
      return false;
    }
  };

  this.showResult = function () {
    var checkBool = currentState.isGameOver();
    if (checkBool) {
      //change here
      //useful variables
      var direction = currentState.winner.direction;
      var index = currentState.winner.index;
      //displaying result
      if (currentState.winner.symbol == 'draw') {
        resultDisplay.textContent = "Alas! It's a draw!";
      }
      if (box[index].textContent == 'O') {
        resultDisplay.textContent = 'Woah, You deafeated AI';
      } else if (box[index].textContent == 'X') {
        resultDisplay.textContent = 'You lost   , Better luck next time';
      }

      if (direction == 'H') {
        for (var k = index; k <= index + 2; k++) {
          box[k].style.backgroundColor = '#D8B5FF';
        }
      } else if (direction == 'V') {
        for (var k = index; k <= index + 6; k += 3) {
          box[k].style.backgroundColor = '#D8B5FF';
        }
      } else if (direction == 'D') {
        if (index) {
          for (var k = index; k <= index + 4; k += 2) {
            box[k].style.backgroundColor = '#D8B5FF';
          }
        } else {
          for (var k = index; k <= index + 8; k += 4) {
            box[k].style.backgroundColor = '#D8B5FF';
          }
        }
      }
    }
    // if (isGameOver()) {
    //   overlay.style.display = 'block';
    // }
  };
}

function minimax(state, depth, alpha, beta, isMaximizing) {
  if (state.isGameOver() || depth == max_depth) {
    //return static evalution of the state
    if (state.winner.symbol === 'X') {
      return { move: undefined, score: 100 - depth }; //correct sign of depth
    } else if (state.winner.symbol === 'O') {
      return { move: undefined, score: -100 + depth };
    }
    return { move: undefined, score: 0 };
  }

  var result = { move: undefined, score: undefined };

  if (isMaximizing) {
    var best = { move: undefined, score: -Infinity };

    var availablePositions = state.availableCells();

    for (var i = 0; i < availablePositions.length; i++) {
      var nextState = new State(state);
      //nextState.insert("X", availablePositions[i]);
      nextState.board[availablePositions[i]] = 'X';
      // var current=[availablePositions[i], -infinity]
      var smallOutput = minimax(nextState, depth + 1, alpha, beta, false);
      smallOutput.move = availablePositions[i];

      if (smallOutput.score > best.score) {
        best = smallOutput; //make object
      }
      alpha = Math.max(alpha, smallOutput.score);
      if (beta <= alpha) {
        break;
      }
    }

    return best;
  }

  if (!isMaximizing) {
    var best = { move: undefined, score: Infinity };
    var availablePositions = state.availableCells();

    for (var i = 0; i < availablePositions.length; i++) {
      var nextState = new State(state);
      nextState.board[availablePositions[i]] = 'O';
      var smallOutput = minimax(nextState, depth + 1, alpha, beta, true);
      smallOutput.move = availablePositions[i];

      if (smallOutput.score < best.score) {
        best = smallOutput;
      }

      beta = Math.min(beta, smallOutput.score);
      if (beta <= alpha) {
        break;
      }
    }
    return best;
  }
}

function makeMove(state, depth, isMaximizing) {
  var result = minimax(state, depth, -Infinity, Infinity, isMaximizing);

  var s = new State(state);
  box[result.move].textContent = 'X';
  s.board[result.move] = 'X';
  currentState = s;
  currentState.showResult();
}

// Modal code for

// const overlay = document.querySelector('.overlay');
// const modal = document.querySelector('.modal');
// const closebtn = document.querySelector('#closebtn');

// closebtn.addEventListener('click', () => {
//   overlay.style.display = 'none';
// });

let name1;
let name2;
let nameArr = document.querySelectorAll(".playerName");
let player = document.querySelector("#playerLabel");
var p1 = document.getElementById("p1Name");
var p2 = document.getElementById("p2Name");
let back = document.querySelector("#backToMenu")
var winning = document.querySelector(".winMessage");
let submit = document.querySelector("#submitButton");

submit.addEventListener("click", startTwoPlayer);

function startTwoPlayer(){
  name1 = p1.value;
  name2 = p2.value;
  setName();
  document.querySelector(".launchForm").classList.add("hideBoard");
  document.querySelector(".board").classList.remove("hideBoard");
}

function setName(){
    if(!name1){
      name1 = "Player 1"
      nameArr[0].textContent = name1;
    }
    else{
      nameArr[0].textContent = name1;
    }

    if(!name2){
      name2 = "Player 2"
      nameArr[1].textContent = name2;
    }
    else{
      nameArr[1].textContent = name2;
    }
    player.textContent = "It's " + name1 + "'s turn!";
}

back.addEventListener("click", ()=>{
  for (let i = 0; i < boxes.length; i++) {
    boxes[i].innerHTML = "";
    boxes[i].style.backgroundColor = "#dee9ec";
    boxes[i].style.color = "black";
  }
  currentPlayer = "x";
  name1 = "";
  name2 = "";
  p1.value = "";
  p2.value = "";
  nameArr[0].textContent = "";
  nameArr[1].textContent = "";

  document.querySelector(".launchForm").classList.remove("hideBoard");
  document.querySelector(".board").classList.add("hideBoard");
  gameStatus = true;
})

//stores player turns
let currentPlayer = "x";
let currentPlayerName = name1;

//stores the status of the game, whether its over or still in play
let gameStatus = true;

//Gets all Boxes elements
const boxes = document.getElementsByClassName("box");

//loops through all the elements
for (let i = 0; i < boxes.length; i++) {
  //adds event listener to each box;
  boxes[i].addEventListener("click", function() {
    //checks if the box has an x or an o in it and also checks if the game is still on
    if (boxes[i].innerHTML.trim() == "" && gameStatus) {
      //adds x or o for the current play in their choosen box
      boxes[i].textContent = currentPlayer;
      hasWonMagicSquare(currentPlayer, currentPlayerName);

      if(!gameStatus){
        
      }

      //changes player turns
      currentPlayer = (currentPlayer == "x" ? "o" : "x");
      currentPlayerName = (currentPlayer == "x" ? name1 : name2);

      player.textContent = "It's " + currentPlayerName + "\'s turn";

    }
  });
}

function hasWonMagicSquare(currentPlayer, currentPlayerName) {
  for (var i = 0; i < 9; i++){
    for (var j = 0; j < 9; j++){
      for (var k = 0; k < 9; k++){
        if (i != j && i != k && j != k){
          if (boxes[i].textContent == currentPlayer && boxes[j].textContent == currentPlayer && boxes[k].textContent == currentPlayer){
            if (Number(boxes[i].getAttribute("value")) + Number(boxes[j].getAttribute("value"))  + Number(boxes[k].getAttribute("value"))  == 15){
              showWinner(i, j, k, currentPlayerName); 
            } 
          }             
        }
      }
    }
  }
}

//resets the game
document.getElementById("reset").addEventListener("click", function() {
  for (let i = 0; i < boxes.length; i++) {
    boxes[i].innerHTML = "";
    boxes[i].style.backgroundColor = "#dee9ec";
    boxes[i].style.color = "black";
  }
  currentPlayer = "x";
  player.textContent = "It's " + name1 + "\'s turn";
  winning.textContent = "";
  gameStatus = true;
});

//displays the winner

function showWinner(x, y, z, currentPlayerName) {
  boxes[x].style.backgroundColor = "#0d8b70";
  boxes[x].style.color = "white";
  boxes[y].style.background = "#0d8b70";
  boxes[y].style.color = "white";
  boxes[z].style.background = "#0d8b70";
  boxes[z].style.color = "white";
  player.textContent = ""
  winning.textContent = currentPlayerName + " has won";
  
  gameStatus = false;
  
}

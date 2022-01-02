let playground = document.getElementById('playground');
let ROWS = 60;
let COLS = 60;

let grids = new Map();

function initializeCanvas () {
  for (let i=0; i < ROWS; i++) {
    for (let j=0; j < COLS; j++) {
      let grid = document.createElement('div');
      grid.style.position = 'absolute';
      grid.style.left = j*10 + 'px';
      grid.style.top = i*10 + 'px';
      grid.style.height = '10px';
      grid.style.width = '10px';
      grid.style.backgroundColor = 'black';
      playground.appendChild(grid);
      let gridPosition = i+ '_' +j;
      grids.set(gridPosition, grid);
    }
  }
}
initializeCanvas();

function drawSnake(snake) {
  let snakePositions = new Set();
  for(let [x, y] of snake) {
    snakePositions.add(x+ '_' +y);
  }

  for (let i=0; i < ROWS; i++) {
    for (let j=0; j < COLS; j++) {
      let grid = grids.get(i+ '_' +j);
      if (snakePositions.has(i+ '_' +j)){
        grid.style.backgroundColor = 'green'
      } else if (currentFood[0] == i && currentFood[1] == j) {
        grid.style.backgroundColor = 'red'
      } else {
        grid.style.backgroundColor = 'black';
      }
    }
  }
}

let currentSnake = [
  [0, 0],
]

let currentFood = [Math.floor(Math.random() * ROWS), Math.floor(Math.random() * COLS)];

let moveLeft = ([x, y]) => [x, y-1];
let moveRight = ([x, y]) => [x, y+1];
let moveUp = ([x, y]) => [x-1, y];
let moveDown = ([x, y]) => [x+1, y];

var currentDirection = moveRight;

document.onkeydown = (e) => {
  e = e || window.event;

  if (e.key == 'ArrowUp' && currentDirection !== moveDown) {
    currentDirection = moveUp;
  }
  else if (e.key == 'ArrowDown' && currentDirection !== moveUp) {
    currentDirection = moveDown;

  }
  else if (e.key == 'ArrowLeft' && currentDirection !== moveRight) {
    currentDirection = moveLeft;

  }
  else if (e.key == 'ArrowRight' && currentDirection !== moveLeft) {
    currentDirection = moveRight;
  }

};

//check if snake collided
function isValidMove([x, y]) {
  if(x<0 || y<0 || x>=ROWS || y>=COLS){
    return false;
  }
  return true;
}

//check if snake ate itself
function snakeAteItself([x, y], currentSnake ) {
  let found = currentSnake.find((item) => {
    if(item[0] == x && item[1] == y){
      return item;
    }
  })
  if (found) {
    return true;
  } return false;
}

//stop game
function stopGame() {
  playground.style.borderColor = 'red';
  clearInterval(interval_id[0]);
}

//check if snake ate food
function snakeAteFood(currentSnake ) {
  let found = currentSnake.find((item) => {
    if(item[0] == currentFood[0] && item[1] == currentFood[1]){
      return item;
    }
  })
  if (found) {
    return true;
  } return false;
}

//reposition snake food 
function repositionFood() {
  currentFood = [Math.floor(Math.random() * ROWS), Math.floor(Math.random() * COLS)]
}

function move() {
  let head = currentSnake[currentSnake.length -1];
  let nextHead = currentDirection(head);
  if(!isValidMove(nextHead) || snakeAteItself(nextHead, currentSnake)) {
    stopGame();
    return;
  }
  if (snakeAteFood(currentSnake)) {
    currentSnake.push(nextHead);
    drawSnake(currentSnake);
    repositionFood();
  }
  currentSnake.shift();
  currentSnake.push(nextHead);
  drawSnake(currentSnake);
}


drawSnake(currentSnake);

function createInterval () {
  let interval_id = setInterval(() => {
    move();
  }, 100);
  return interval_id;
}

function restartGame () {
  playground.style.borderColor = '';
  createInterval();
}
 
let interval_id = [createInterval()];

//clicking restart button
let restartBtn = document.getElementById('restart-btn');
restartBtn.addEventListener('click', () => {
    clearInterval(interval_id[0]);
    //remove previous interval
    interval_id.shift();
    //add new interval
    interval_id.push(createInterval());
    playground.style.borderColor = '';
    currentSnake = [
      [0, 0]
    ]
    currentFood = [Math.floor(Math.random() * ROWS), Math.floor(Math.random() * COLS)];
})





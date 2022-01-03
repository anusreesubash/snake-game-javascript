let playground = document.getElementById('playground');
let ROWS = 60;
let COLS = 60;

let grids = new Map();
let initialSnake = [
  [0, 0],
  [0, 1],
  [0, 2],
]

function initializeCanvas () {
  for (let i=0; i < ROWS; i++) {
    for (let j=0; j < COLS; j++) {
      let grid = document.createElement('div');
      grid.style.position = 'absolute';
      grid.style.left = j*10 + 'px';
      grid.style.top = i*10 + 'px';
      grid.style.height = '10px';
      grid.style.width = '10px';
      grid.style.backgroundColor = '#1a211c';
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
        grid.style.backgroundColor = '#1a211c';
      }
    }
  }
}

let currentSnake = initialSnake;
let score = 0;

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
    //disable play/pause btn
    document.getElementById('play-pause-btn').disabled = true;
    return;
  }
  if (snakeAteFood(currentSnake)) {
    score = score + 1;
    document.getElementById('score-board').innerHTML = `SCORE: ${score*5}`
    currentSnake.push(nextHead);
    drawSnake(currentSnake);
    repositionFood();
  }
  currentSnake.shift();
  currentSnake.push(nextHead);
  drawSnake(currentSnake);
}


drawSnake(currentSnake);

var isPaused = false;

function createInterval () {
  let interval_id = setInterval(() => {
    if (!isPaused) {
      move();
    }
  }, 100);
  return interval_id;
}

let interval_id = [createInterval()];
document.getElementById('play-pause-btn').innerHTML = 'PAUSE';

//stop game
function stopGame() {
  document.getElementById('game-status').style.display = 'block';
  if (interval_id[0]) {
    clearInterval(interval_id[0]);
  }
}

//clicking restart button
let restartBtn = document.getElementById('restart-btn');
restartBtn.addEventListener('click', () => {
  clearInterval(interval_id[0]);
  //remove previous interval
  interval_id.shift();
  //add new interval
  interval_id.push(createInterval());
  isPaused = false;
  document.getElementById('play-pause-btn').disabled = false;
  document.getElementById('play-pause-btn').innerHTML = 'PAUSE';
  playground.style.borderColor = '';
  document.getElementById('game-status').style.display = 'none';
  currentSnake = [
    [0, 0],
    [0, 1],
    [0, 2]
  ]
  currentFood = [Math.floor(Math.random() * ROWS), Math.floor(Math.random() * COLS)];
})

//toggle play/pause button
let playPauseBtn = document.getElementById('play-pause-btn');
playPauseBtn.addEventListener('click', () => {
  isPaused = !isPaused;
  isPaused ? document.getElementById('play-pause-btn').innerHTML = 'PLAY' :  document.getElementById('play-pause-btn').innerHTML = 'PAUSE';

  console.log(isPaused)
});






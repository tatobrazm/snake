const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const score = document.querySelector(".score--value");
const maxScore = document.querySelector(".max--value");
const finalScore = document.querySelector(".final-score > span");
const menu = document.querySelector(".menu-screen");
const buttonPlay = document.querySelector(".btn-play");
const audio = new Audio("../assets/audio.mp3");
const size = 15;
const initialPosition = { x: 270, y: 240 };
let snake = [initialPosition];
let direction, loopId;
let points = 0;
let velocidade = 300;
let cont = 1;
let statusSnake = true;

if (
  localStorage.getItem("maxScore") === null ||
  localStorage.getItem("maxScore") == 0
) {
  localStorage.setItem("maxScore", 0);
}
maxScore.innerText = localStorage.getItem("maxScore");

const incrementScore = () => {
  points += 10;
  score.innerText = points;
};

const randomNumber = (min, max) => {
  return Math.round(Math.random() * (max - min) + min);
};

const randomPosition = () => {
  const number = randomNumber(0, canvas.width - size);
  return Math.round(number / 15) * 15;
};

const randomColor = () => {
  const red = randomNumber(0, 255);
  const green = randomNumber(0, 255);
  const blue = randomNumber(0, 255);
  return `rgb(${red}, ${green}, ${blue})`;
};

const food = {
  x: randomPosition(),
  y: randomPosition(),
  color: randomColor(),
};

const drawFood = () => {
  const { x, y, color } = food;
  ctx.shadowColor = color;
  ctx.shadowBlur = 6;
  ctx.fillStyle = color;
  ctx.fillRect(x, y, size, size);
  ctx.shadowBlur = 0;
};

const drawSnake = () => {
  ctx.fillStyle = "#ddd";

  snake.forEach((position, index) => {
    if (index == snake.length - 1) {
      ctx.fillStyle = "#FFEFD5";
    }
    ctx.fillRect(position.x, position.y, size, size);
  });
};

const moveSnake = () => {
  if (!direction) return;

  const head = snake[snake.length - 1];

  if (direction == "right") {
    snake.push({ x: head.x + size, y: head.y });
  }

  if (direction == "left") {
    snake.push({ x: head.x - size, y: head.y });
  }

  if (direction == "down") {
    snake.push({ x: head.x, y: head.y + size });
  }

  if (direction == "up") {
    snake.push({ x: head.x, y: head.y - size });
  }

  snake.shift();
};

const drawGrid = () => {
  ctx.lineWidth = 1;
  ctx.strokeStyle = "#191919";

  for (let i = 15; i < canvas.width; i += 15) {
    ctx.beginPath();
    ctx.lineTo(i, 0);
    ctx.lineTo(i, 600);
    ctx.stroke();

    ctx.beginPath();
    ctx.lineTo(0, i);
    ctx.lineTo(600, i);
    ctx.stroke();
  }
};

const checkEat = () => {
  const head = snake[snake.length - 1];

  if (head.x == food.x && head.y == food.y) {
    incrementScore();
    snake.push(head);
    audio.play();

    let x = randomPosition();
    let y = randomPosition();

    while (snake.find((position) => position.x == x && position.y == y)) {
      x = randomPosition();
      y = randomPosition();
    }

    food.x = x;
    food.y = y;
    food.color = randomColor();
  }
};

const checkCollision = () => {
  const head = snake[snake.length - 1];
  const canvasLimit = canvas.width - size;
  const neckIndex = snake.length - 2;

  const wallCollision =
    head.x < 0 || head.x > canvasLimit || head.y < 0 || head.y > canvasLimit;

  const selfCollision = snake.find((position, index) => {
    return index < neckIndex && position.x == head.x && position.y == head.y;
  });

  if (wallCollision || selfCollision) {
    statusSnake = false;
    gameOver();
  }
};

const gameOver = () => {
  if (localStorage.getItem("maxScore") < points) {
    localStorage.setItem("maxScore", points);
    maxScore.innerText = localStorage.getItem("maxScore");
  }
  statusSnake = false;
  direction = undefined;
  menu.style.display = "flex";
  finalScore.innerText = points;
  canvas.style.filter = "blur(2px)";
};

const gameLoop = () => {
  clearInterval(loopId);
  ctx.clearRect(0, 0, 600, 600);
  drawGrid();
  drawFood();
  moveSnake();
  drawSnake();
  checkEat();
  checkCollision();

  if (+points == 100 * cont) {
    velocidade -= 50;
    cont++;
  }

  loopId = setTimeout(() => {
    gameLoop();
  }, velocidade);
};

gameLoop();

document.addEventListener("keydown", ({ key }) => {
  if (statusSnake) {
    if (key == "ArrowRight" && direction != "left") {
      direction = "right";
    }
    if (key == "ArrowLeft" && direction != "right") {
      direction = "left";
    }
    if (key == "ArrowDown" && direction != "up") {
      direction = "down";
    }
    if (key == "ArrowUp" && direction != "down") {
      direction = "up";
    }
  }
});

let area = document.querySelector("#canvas");
let centerPosition = {
  x: area.clientWidth / 2,
  y: area.clientHeight / 2,
};

area.onclick = (event) => {
  let clickPosition = {
    x: event.offsetX,
    y: event.offsetY,
  };

  let x = clickPosition.x - centerPosition.x;
  let y = clickPosition.y - centerPosition.y;

  if (Math.abs(x) > Math.abs(y)) {
    if (x > 0) {
      if (direction != "left") {
        direction = "right";
      }
    } else {
      if (direction != "right") {
        direction = "left";
      }
    }
  } else {
    if (y > 0) {
      if (direction != "up") {
        direction = "down";
      }
    } else {
      if (direction != "down") {
        direction = "up";
      }
    }
  }
};

buttonPlay.addEventListener("click", () => {
  score.innerText = "00";
  menu.style.display = "none";
  canvas.style.filter = "none";
  snake = [initialPosition];
  let x = randomPosition();
  let y = randomPosition();
  while (snake.find((position) => position.x == x && position.y == y)) {
    x = randomPosition();
    y = randomPosition();
  }
  food.x = x;
  food.y = y;
  food.color = randomColor();
  statusSnake = true;
});

const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const socket = io();

let heroX = canvas.width * 0.75;
let heroY = canvas.height / 2;
let enemyX = canvas.width * 0.25;
let enemyY = canvas.height / 2;
const enemyRadius = 10;
const heroRadius = 10;
let heroScore = 0;
let enemyScore = 0;
let targetX = canvas.width / 2;
let targetY = canvas.height / 2;
const target = 10;
const heroSpeed = 4;
const enemySpeed = 4;

const keys = {
  left: false,
  up: false,
  right: false,
  down: false,
};

document.addEventListener("keyup", (event) => keyHandler(event, false));
document.addEventListener("keydown", (event) => keyHandler(event, true));

function keyHandler(event, bool) {
  const kc = event.keyCode;

  if (kc === 37) keys.left = bool;
  if (kc === 38) keys.up = bool;
  if (kc === 39) keys.right = bool;
  if (kc === 40) keys.down = bool;
}

socket.emit("new player", { x: Math.random() * canvas.width, y: Math.random() *canvas.height });
setInterval(() => socket.emit("movement", keys), 1000 / 60);

function detectCollision(x1, y1, x2, y2) {
  // detection with border
  if (x1 > canvas.width) {
    socket.emit("collision", { x: 0, y: y1 });
  }
  if (x1 < 0) {
    socket.emit("collision", { x: canvas.width, y: y1 });
  }
  if (y1 > canvas.height) {
    socket.emit("collision", { x: x1, y: 0 });
  }
  if (y1 < 0) {
    socket.emit("collision", { x: x1, y: canvas.height });
  }

  // Enemy Detection with border
  if (x2 > canvas.width) x2 = 0;
  if (x2 < 0) x2 = canvas.width;
  if (y2 > canvas.height) y2 = 0;
  if (y2 < 0) y2 = canvas.height;

  // hero detection with target
  const heroXC = x1 - targetX;
  const heroYC = x2 - targetY;
  const distance1 = Math.sqrt(heroXC * heroXC + heroYC * heroYC);

  if (distance1 < heroRadius + target) {
    targetX = Math.floor(Math.random() * 370) + 10;
    targetY = Math.floor(Math.random() * 390) + 10;
    heroScore++;
  }
  // enemy detection with target
  const enemyXC = enemyX - targetX;
  const enemyYC = enemyY - targetY;
  const distance2 = Math.sqrt(enemyXC * enemyXC + enemyYC * enemyYC);

  if (distance2 < enemyRadius + target) {
    targetX = Math.floor(Math.random() * 370) + 10;
    targetY = Math.floor(Math.random() * 390) + 10;
    enemyScore++;
  }
}

// function movePlayers() {
//   if (keys.left) heroX -= heroSpeed;
//   if (keys.right) heroX += heroSpeed;
//   if (keys.up) heroY -= heroSpeed;
//   if (keys.down) heroY += heroSpeed;
//   if (keys.a) enemyX -= enemySpeed;
//   if (keys.w) enemyY -= enemySpeed;
//   if (keys.d) enemyX += enemySpeed;
//   if (keys.s) enemyY += enemySpeed;
// }

function drawHero(x, y) {
  ctx.beginPath();
  ctx.arc(x, y, heroRadius, 0, Math.PI * 2);
  ctx.fillStyle = "blue";
  ctx.fill();
  ctx.closePath();
}

// function drawEnemy() {
//   ctx.beginPath();
//   ctx.arc(enemyX, enemyY, enemyRadius, 0, Math.PI * 2);
//   ctx.fillStyle = "red";
//   ctx.fill();
//   ctx.closePath();
// }

function drawtarget() {
  ctx.beginPath();
  ctx.arc(targetX, targetY, target, 0, Math.PI * 2);
  ctx.fillStyle = "black";
  ctx.fill();
  ctx.closePath();
}

function drawHeroScore() {
  ctx.font = "15px Helvetica";
  ctx.fillStyle = "blue";
  ctx.fillText("Score: " + heroScore, 530, 20);
}

function drawEnemyScore() {
  ctx.font = "15px Helvetica";
  ctx.fillStyle = "red";
  ctx.fillText("Score: " + enemyScore, 10, 20);
}

function checkGameOver() {
  if (heroScore === 20) {
    heroScore = 0;
    enemyScore = 0;
  } else if (enemyScore === 20) {
    heroScore = 0;
    enemyScore = 0;
  }
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

socket.on("state", (players) => {
  clearCanvas();
  for (let id in players) {
    const player = players[id];
    drawHero(player.x, player.y);
    detectCollision(player.x, player.y);
  }
  drawHero();
  drawtarget();
  drawHeroScore();
  drawEnemyScore();
  checkGameOver();
});
// function main() {
//   clearCanvas();
//   drawHero();
//   drawEnemy();
//   drawtarget();
//   drawHeroScore();
//   drawEnemyScore();
//   checkGameOver();
//   detectCollision();
//   movePlayers();
// }

// setInterval(main, 1000 / 60);

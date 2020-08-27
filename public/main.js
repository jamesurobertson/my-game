const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const socket = io();

const playerRadius = 10;

//initial Target details
let targetX = canvas.width / 2;
let targetY = canvas.height / 2;
const targetRadius = 10;

// when there is a new connection emit new player
socket.emit("new player", {
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  targetX,
  targetY,
});

// player movement mapping
const keys = {
  left: false,
  up: false,
  right: false,
  down: false,
};

document.addEventListener("keyup", (event) => keyHandler(event, false));
document.addEventListener("keydown", (event) => keyHandler(event, true));

// key presses update key movement
function keyHandler(event, bool) {
  const kc = event.keyCode;

  if (kc === 37) keys.left = bool;
  if (kc === 38) keys.up = bool;
  if (kc === 39) keys.right = bool;
  if (kc === 40) keys.down = bool;
}

// emit player movement at 60 fps
// TODO: Fix Lag. Does it have to do with this?
setInterval(() => socket.emit("movement", keys), 1000 / 60);

function drawPlayer(player) {
  ctx.beginPath();
  ctx.arc(player.x, player.y, playerRadius, 0, Math.PI * 2);
  ctx.fillStyle = player.color;
  ctx.fill();
  ctx.closePath();
}

function drawtarget(target) {
  ctx.beginPath();
  ctx.arc(target.x, target.y, targetRadius, 0, Math.PI * 2);
  ctx.fillStyle = "black";
  ctx.fill();
  ctx.closePath();
}

function drawScores(players) {
  // x index of where the leaderboard starts drawing
  let start = 20;

  // drawing 'Leaderboard'
  ctx.font = "17px Helvetica";
  ctx.fillStyle = "black";
  ctx.fillText("Leaderboard", 490, start);
  start += 25;

  // push player objects into an array
  let playersArr = [];
  for (let id in players) {
    playersArr.push(players[id]);
  }

  // sort by score
  playersArr.sort((a, b) => b.score - a.score);

  // we will only display top 5 scores on the leaderboard
  const len = playersArr.length > 5 ? 5 : playersArr.length;
  playersArr.slice(0, len).forEach((player, i) => {
    ctx.font = "15px Helvetica";
    ctx.fillStyle = player.color;
    ctx.fillText(`${i + 1}. ` + player.score, 480, start);
    start += 15;
  });

  // if activePlayer isn't on leaderboard, show their score
  const activePlayer = players[socket.id];
  if (!playersArr.slice(0, 5).includes(activePlayer)) {
    ctx.font = "15px Helvetica";
    ctx.fillStyle = activePlayer.color;
    ctx.fillText(
      `${playersArr.indexOf(activePlayer) + 1}. ` + activePlayer.score,
      480,
      start
    );
  }
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Canvas Refreshing when receiving updated state'
socket.on("state", (players, target) => {
  if (!players || !target) return;
  clearCanvas();
  for (let id in players) {
    const player = players[id];
    drawPlayer(player);
  }
  drawScores(players);
  drawtarget(target);
});

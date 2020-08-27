const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const socket = io();

const playerRadius = 10;
let targetX = canvas.width / 2;
let targetY = canvas.height / 2;
const target = 10;

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

socket.emit("new player", { x: Math.random() * canvas.width, y: Math.random() *canvas.height, targetX, targetY});
setInterval(() => socket.emit("movement", keys), 1000 / 60);

function drawPlayer(player) {
  ctx.beginPath();
  ctx.arc(player.x, player.y, playerRadius, 0, Math.PI * 2);
  ctx.fillStyle = player.color
  ctx.fill();
  ctx.closePath();
}


function drawtarget() {
  ctx.beginPath();
  ctx.arc(targetX, targetY, target, 0, Math.PI * 2);
  ctx.fillStyle = "black";
  ctx.fill();
  ctx.closePath();
}

function drawScores(players) {
    let start = 20
    ctx.font = "17px Helvetica";
    ctx.fillStyle = "black";
    ctx.fillText("Leaderboard", 490, start);
    if (!players) return
    start += 25
    let playersArr = []
    for (let id in players) {
        playersArr.push(players[id])
    }

    playersArr.sort((a, b) => b.score - a.score)
    const len = playersArr.length > 5 ? 5 : playersArr.length
    playersArr.slice(0, len).forEach((player, i) => {
        ctx.font = "15px Helvetica";
        ctx.fillStyle = player.color
        ctx.fillText(`${i + 1}. ` + player.score, 480, start);
        start += 15
    })

    const activePlayer = players[socket.id]
    if (!playersArr.slice(0, 5).includes(activePlayer)) {
        ctx.font = "15px Helvetica";
        ctx.fillStyle = activePlayer.color
        ctx.fillText(`${playersArr.indexOf(activePlayer) + 1}. ` + activePlayer.score, 480, start);
    }
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

socket.on("state", (players, target) => {
  clearCanvas();
  for (let id in players) {
    const player = players[id];
    drawPlayer(player);
  }
  if (target) targetX = target.x
  if (target) targetY = target.y
  drawScores(players)
  drawtarget();
});

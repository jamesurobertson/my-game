const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const colors = require('./colors')
app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// players and target objects
let canvasWidth = 600
let canvasHeight = 400

const players = {};
const target = { x: canvasWidth/2, y: canvasHeight/2 };

io.on("connection", (socket) => {

  socket.on("disconnect", () => {
    delete players[socket.id];
    io.emit("state", players);
  });

  socket.on("new player", (data) => {
    target.x = data.targetX;
    target.y = data.targetY;
    players[socket.id] = {
      x: data.x,
      y: data.y,
      score: 0,
      color: colors[Math.floor(Math.random() * colors.length)]
    };
    io.emit("state", players);
  });

  //TODO: optimize this. Cause for lag?
  socket.on("movement", (data) => {
    const player = players[socket.id] || {};
    if (data.left) player.x -= 4;
    if (data.right) player.x += 4;
    if (data.up) player.y -= 4;
    if (data.down) player.y += 4;
    if (player.x > canvasWidth) player.x = 0;
    if (player.x < 0) player.x = canvasWidth;
    if (player.y > canvasHeight) player.y = 0;
    if (player.y < 0) player.y = canvasHeight;
    detectCollision(player, target);
    io.emit("state", players, target);
  });

  function detectCollision(player, target) {
    const xc = player.x - target.x;
    const yc = player.y - target.y;
    const distance = Math.sqrt(xc * xc + yc * yc);
    if (distance < 10 + 10) {
      target.x = Math.floor(Math.random() * 370) + 10;
      target.y = Math.floor(Math.random() * 390) + 10;
      player.score++;
    }
  }
});

http.listen(process.env.PORT || 5000, () =>
  console.log("Server is running...")
);

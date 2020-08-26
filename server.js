const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

const colors = [
  "Navy",
  "MediumBlue",
  "Blue",
  "DarkGreen",
  "Green",
  "Teal",
  "DarkCyan",
  "DeepSkyBlue",
  "DarkTurquoise",
  "MediumSpringGreen",
  "Lime",
  "SpringGreen",
  "Aqua",
  "Cyan",
  "DodgerBlue",
  "LightSeaGreen",
  "ForestGreen",
  "SeaGreen",
  "DarkSlateGray",
  "DarkSlateGrey",
  "LimeGreen",
  "MediumSeaGreen",
  "Turquoise",
  "RoyalBlue",
  "SteelBlue",
  "DarkSlateBlue",
  "MediumTurquoise",
  "Indigo  ",
  "DarkOliveGreen",
  "CadetBlue",
  "CornflowerBlue",
  "RebeccaPurple",
  "MediumAquaMarine",
  "DimGray",
  "DimGrey",
  "SlateBlue",
  "OliveDrab",
  "SlateGray",
  "SlateGrey",
  "LightSlateGray",
  "LightSlateGrey",
  "MediumSlateBlue",
  "LawnGreen",
  "Chartreuse",
  "Aquamarine",
  "Maroon",
  "Purple",
  "Olive",
  "Gray",
  "Grey",
  "SkyBlue",
  "LightSkyBlue",
  "BlueViolet",
  "DarkRed",
  "DarkMagenta",
  "SaddleBrown",
  "DarkSeaGreen",
  "LightGreen",
  "MediumPurple",
  "DarkViolet",
  "PaleGreen",
  "DarkOrchid",
  "YellowGreen",
  "Sienna",
  "Brown",
  "DarkGray",
  "DarkGrey",
  "LightBlue",
  "GreenYellow",
  "PaleTurquoise",
  "LightSteelBlue",
  "PowderBlue",
  "FireBrick",
  "DarkGoldenRod",
  "MediumOrchid",
  "RosyBrown",
  "DarkKhaki",
  "Silver",
  "MediumVioletRed",
  "IndianRed ",
  "Peru",
  "Chocolate",
  "Tan",
  "LightGray",
  "LightGrey",
  "Thistle",
  "Orchid",
  "GoldenRod",
  "PaleVioletRed",
  "Crimson",
  "Gainsboro",
  "Plum",
  "BurlyWood",
  "LightCyan",
  "Lavender",
  "DarkSalmon",
  "Violet",
];
const players = {};
const target = { x: 0, y: 0 };
io.on("connection", (socket) => {
  let [canvasWidth, canvasHeight] = [600, 400];

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

  const lastUpdatedTime = new Date().getTime();
  socket.on("movement", (data) => {
    const player = players[socket.id] || {};
    const currentTime = new Date().getTime();
    const timeDiff = currentTime - lastUpdatedTime;
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

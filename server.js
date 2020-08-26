const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

const players = {};
io.on("connection", (socket) => {
  console.log("user connected");
  socket.on("disconnect", () => {
    delete players[socket.id];
    console.log("user disconnected");
    io.emit("state", players);
  });

  io.on("connection", (socket) => {
    socket.on("new player", (data) => {
      players[socket.id] = {
        x: data.x,
        y: data.y,
      };
      io.emit("state", players);
    });
    socket.on("movement", (data) => {
      const player = players[socket.id] || {};
      if (data.left) player.x -= 2;
      if (data.right) player.x += 2;
      if (data.up) player.y -= 2;
      if (data.down) player.y += 2;
      io.emit("state", players);
    });

    socket.on("collision", (data) => {
      const player = players[socket.id] || {};
      console.log(player);
      player.x = data.x;
      player.y = data.y;
      io.emit("state", players);
    });
  });
});

http.listen(5000, () => console.log("Listening on port 5000..."));

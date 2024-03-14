const express = require("express");
const app = express();
const path = require("path");
const http = require("http");
const server = http.Server(app);
const io = require("socket.io")(server);

const {
  userJoin,
  getCurrentUser,
  userLeave,
  totalusers,
} = require("./utils/users");

const formatMessage = require("./utils/messages");

// setting static folder
app.use(express.static(path.join(__dirname, "public")));

// runs when client connects
io.on("connection", (socket) => {
  socket.on("joinUser", ({ username }) => {
    const user = userJoin(socket.id, username);

    socket.join(user);

    // Broadcast when a user connects
    socket.broadcast.emit("message", `${username} has joined the chat`);

    io.emit("totalUsers", {
      users: totalusers,
    });
  });

  // Listen for chatMessage
  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);

    io.emit("message", formatMessage(user, msg));
  });

  // Runs when client disconnects
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);

    if (user) {
      io.emit("message", formatMessage(user.username, `has left the chat`));

      // Send users and  info
      io.emit("totalUsers", {
        users: totalusers,
      });
    }
  });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log("Server started on port 3001");
});

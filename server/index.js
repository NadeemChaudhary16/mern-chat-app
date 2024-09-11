const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const authRoute = require("./routes/AuthRoute");
const ChatRoute = require("./routes/ChatRoute");
const MessageRoute=require("./routes/MessageRoute")
const app = express();

dotenv.config();
const port = process.env.PORT || 3000;
const dbUrl = process.env.DATABASE_URL;

app.use(
  cors({
    origin: process.env.ORIGIN || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

// connection with the database
mongoose
  .connect(dbUrl)
  .then(() => {
    console.log("connection successfull");
  })
  .catch((e) => {
    console.log(e.message);
  });
app.use(cookieParser());
app.use(express.json()); //to accept json data
app.use("/api/user", authRoute);
app.use("/api/chat", ChatRoute);
app.use("/api/message", MessageRoute);

// Catch-all for unknown routes
app.all("*", (req, res, next) => {
  const error = new Error("Page Not Found!");
  error.status = 404;
  next(error);
});

// Error handling middleware
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).json({ message });
});

const server = app.listen(port, () => {
  console.log(`app is listening on port ${port}`);
});

const io = require("socket.io")(server, {
  // pingTimeout: 60000,
  cors: {
    origin: process.env.ORIGIN,
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");

  socket.on("setup", (userData) => {
    if (!userData || !userData.id) {
      console.log("Invalid userData:", userData);
      return; // Avoid joining the room if userData is invalid
    }

    socket.join(userData.id);
    console.log("User connected with ID:", userData.id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData?.id); // Check if userData exists before leaving the room
  });
});


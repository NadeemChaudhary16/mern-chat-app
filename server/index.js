const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const authRoute = require("./routes/AuthRoute");
const ChatRoute = require("./routes/ChatRoute");
const MessageRoute = require("./routes/MessageRoute");
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
async function connectToDB() {
  try {
    await mongoose.connect(dbUrl);
    console.log("MongoDB connection successful!");
  } catch (e) {
    console.log("MongoDB connection error:", e.message);
  }
}

connectToDB();


app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // to accept json data

// Logging middleware for incoming requests
app.use((req, res, next) => {
  console.log(`${req.method} request to ${req.url}`);
  next();
});

app.use("/api/user", authRoute);
app.use("/api/chat", ChatRoute);
app.use("/api/message", MessageRoute);

// --------------------------deployment------------------------------
const __dirname1 = path.resolve();
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "../client/build")));

  app.get("*", (req, res) =>
      res.sendFile(path.resolve(__dirname1, "../client/build", "index.html"))
  );
}
else {
  app.get("/", (req, res) => {
    res.send("API is running...");
  });
}

// --------------------------deployment------------------------------


// Catch-all for unknown routes
app.all("*", (req, res, next) => {
  console.log("Invalid route accessed:", req.originalUrl);
  const error = new Error("Page Not Found!");
  error.status = 404;
  next(error);
});

// Error handling middleware
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  console.error("Error occurred:", err); // Log the full error
  res.status(statusCode).json({ message });
});

const server = app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

const io = require("socket.io")(server, {
  // pingTimeout: 60000,
  cors: {
    origin: process.env.ORIGIN,
    credentials: true,
  },
});

io.on("connection", (socket) => {
  // console.log("A new client connected with socket ID:", socket.id);

  socket.on("setup", (userData) => {
    console.log("User setup data:", userData);
    if (!userData || !userData._id) {
      // console.log("Invalid userData received during setup:", userData);
      return; // Avoid joining the room if userData is invalid
    }

    socket.join(userData._id);
    console.log("User joined room with ID:", userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    console.log(`User with socket ID: ${socket.id} joined chat room: ${room}`);
    socket.join(room);
  });

  socket.on("typing", (room) => {
    console.log(`User is typing in room: ${room}`);
    socket.in(room).emit("typing");
  });

  socket.on("stop typing", (room) => {
    console.log(`User stopped typing in room: ${room}`);
    socket.in(room).emit("stop typing");
  });

  socket.on("new message", (newMessageRecieved) => {
    console.log("New message received:", newMessageRecieved);
    const chat = newMessageRecieved.chat;
    
    if (!chat.users) {
      return console.log("chat.users not defined for message:", newMessageRecieved);
    }

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) {
        // console.log(`Message sender and user are the same, skipping user: ${user._id}`);
        return;
      }

      // console.log(`Emitting message to user: ${user._id}`);
      socket.in(user._id).emit("message received", newMessageRecieved);
    });
  });

  socket.on("disconnect", () => {
    console.log(`Socket with ID: ${socket.id} disconnected`);
  });

  socket.off("setup", () => {
    console.log("User disconnected from setup event");
    socket.leave(userData?._id); // Check if userData exists before leaving the room
  });
});

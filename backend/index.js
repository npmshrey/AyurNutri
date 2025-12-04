import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import http from "http";
import { Server } from "socket.io";

// ROUTES
import patientsRouter from "./routes/patients.js";
import authRouter from "./routes/auth.js";
import patientPortalRouter from "./routes/patientPortal.js";
import patientMeRouter from "./routes/patientMe.js";
import subscribeRouter from "./routes/subscribe.js";
import foodScanRoutes from "./routes/foodScanRoutes.js";
import chatbotRoute from "./routes/chatbot.js";
import chatRoutes from "./routes/chat.js";
import doctorRoutes from "./routes/doctors.js";
import appointmentRoutes from "./routes/appointments.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// --------------------------
// FIXED CORS — NOW ALLOWS DELETE
// --------------------------
app.use(
  cors({
    origin: "http://localhost:4028",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(express.json());

// --------------------------
// SERVE UPLOADED FILES
// --------------------------
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --------------------------
// ROUTES
// --------------------------
app.use("/api/patients", patientsRouter);
app.use("/api/auth", authRouter);
app.use("/api/patient", patientPortalRouter);
app.use("/api/patient", patientMeRouter);
app.use("/api", subscribeRouter);
app.use("/api/food-scan", foodScanRoutes);
app.use("/api/chatbot", chatbotRoute);
app.use("/api/chat", chatRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/appointments", appointmentRoutes);

// Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", ts: new Date().toISOString() });
});

// --------------------------
// DATABASE + SERVER START
// --------------------------
const PORT = process.env.PORT || 9000;
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/ayurveda";

// HTTP server for WebSockets
const server = http.createServer(app);

// --------------------------
// SOCKET.IO
// --------------------------
const io = new Server(server, {
  cors: {
    origin: "http://localhost:4028",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

let onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("🔥 New socket connected:", socket.id);

  socket.on("user-online", ({ userId, role }) => {
    onlineUsers.set(userId, socket.id);
    io.emit("online-users", Array.from(onlineUsers.keys()));
  });

  socket.on("send-message", (msg) => {
    const receiverSocket = onlineUsers.get(msg.receiverId);
    if (receiverSocket) {
      io.to(receiverSocket).emit("receive-message", msg);
    }
  });

  socket.on("typing", ({ receiverId }) => {
    const receiverSocket = onlineUsers.get(receiverId);
    if (receiverSocket) {
      io.to(receiverSocket).emit("typing", { from: socket.id });
    }
  });

  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected:", socket.id);

    for (let [userId, sockId] of onlineUsers.entries()) {
      if (sockId === socket.id) {
        onlineUsers.delete(userId);
        io.emit("online-users", Array.from(onlineUsers.keys()));
        break;
      }
    }
  });
});

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    server.listen(PORT, () =>
      console.log(`🔥 Realtime + Upload Server running at http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

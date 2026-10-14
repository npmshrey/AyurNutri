import "dotenv/config";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import http from "http";
import { Server } from "socket.io";

import connectDB from "./config/db.js";

// MODELS
import ChatMessage from "./models/ChatMessage.js";

// ROUTES
import patientsRouter from "./routes/patients.js";
import authRouter from "./routes/auth.js";
import patientPortalRouter from "./routes/patientPortal.js";
import subscribeRouter from "./routes/subscribe.js";
import foodScanRoutes from "./routes/foodScanRoutes.js";
import chatbotRoute from "./routes/chatbot.js";
import chatRoutes from "./routes/chat.js";
import doctorRoutes from "./routes/doctors.js";
import appointmentRoutes from "./routes/appointments.js";
import weekPlanLogsRoutes from "./routes/weekPlanLogs.js";
import aiPlansGeminiRoutes from "./routes/aiPlansGemini.js";
import patientReportsRoutes from "./routes/patientReports.js";
import quizRoutes from "./routes/quizRoutes.js";
import orgAuthRoutes from "./routes/orgAuth.js";
import orgAdminRoutes from "./routes/orgAdmin.js";
import foodsRoutes from "./routes/foods.js";
import statsRoutes from "./routes/stats.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

/* =========================
   CORS
   Configurable via FRONTEND_ORIGIN so this isn't hardcoded to a single
   local dev port — it used to break the moment this was deployed anywhere.
========================= */
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:4028";

app.use(
  cors({
    origin: FRONTEND_ORIGIN,
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("*", cors());

/* =========================
   BODY PARSER (VERY IMPORTANT)
========================= */
app.use(express.json());

/* =========================
   STATIC FILES
========================= */
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* =========================
   ROUTES
========================= */
app.use("/api/auth", authRouter);
app.use("/api/patients", patientsRouter);
app.use("/api/patient", patientPortalRouter);
app.use("/api/patient/reports", patientReportsRoutes);

app.use("/api", subscribeRouter);
app.use("/api/food-scan", foodScanRoutes);
app.use("/api/chatbot", chatbotRoute); // ✅ CHATBOT
app.use("/api/chat", chatRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api", weekPlanLogsRoutes);
app.use("/api/ai", aiPlansGeminiRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/foods", foodsRoutes);
app.use("/api/stats", statsRoutes);

// Organisation-admin portal: login, then doctor approve/reject. These
// existed in the codebase already but were never mounted, so they always
// 404'd — the whole org-admin role was unreachable from the outside.
app.use("/api/org-admin/auth", orgAuthRoutes);
app.use("/api/org-admin", orgAdminRoutes);

/* =========================
   HEALTH CHECK
========================= */
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", ts: new Date().toISOString() });
});

/* =========================
   DATABASE + SERVER
========================= */
const PORT = process.env.PORT || 9000;

const server = http.createServer(app);

/* =========================
   SOCKET.IO
========================= */
const io = new Server(server, {
  cors: {
    origin: FRONTEND_ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

let onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("🔥 Socket connected:", socket.id);

  socket.on("user-online", ({ userId, role }) => {
    socket.userId = userId;
    socket.role = role;
    onlineUsers.set(userId, socket.id);
    io.emit("online-users", Array.from(onlineUsers.keys()));
  });

  socket.on("send-message", async (msg) => {
    try {
      const receiverSocket = onlineUsers.get(msg.receiverId);
      const senderId =
        msg.senderRole === "patient" ? msg.patientId : msg.doctorId;

      if (receiverSocket) {
        io.to(receiverSocket).emit("receive-message", msg);

        if (msg._id) {
          await ChatMessage.findByIdAndUpdate(msg._id, {
            status: "delivered",
            deliveredAt: new Date(),
          });
        }

        const senderSocket = onlineUsers.get(senderId);
        if (senderSocket && msg._id) {
          io.to(senderSocket).emit("message-status-update", {
            messageId: msg._id,
            status: "delivered",
          });
        }
      }
    } catch (err) {
      console.error("send-message error:", err);
    }
  });

  socket.on("message-seen", async ({ messageIds, otherUserId }) => {
    try {
      if (!messageIds?.length) return;

      await ChatMessage.updateMany(
        { _id: { $in: messageIds } },
        { status: "seen", seenAt: new Date() }
      );

      const otherSocket = onlineUsers.get(otherUserId);
      if (otherSocket) {
        io.to(otherSocket).emit("message-status-update", {
          messageIds,
          status: "seen",
        });
      }
    } catch (err) {
      console.error("message-seen error:", err);
    }
  });

  socket.on("disconnect", () => {
    for (const [userId, sockId] of onlineUsers.entries()) {
      if (sockId === socket.id) {
        onlineUsers.delete(userId);
        io.emit("online-users", Array.from(onlineUsers.keys()));
        break;
      }
    }
  });
});

connectDB()
  .then(() => {
    server.listen(PORT, () =>
      console.log(`🚀 Server running at http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err?.name, "-", err?.message);
    // Exiting straight away can cut this message off on hosts like Render
    // (stdout is a pipe there and writes are asynchronous), which is why
    // failed deploys showed no error at all. Give it a moment to flush.
    setTimeout(() => process.exit(1), 500);
  });

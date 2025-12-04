import mongoose from "mongoose";

const chatMessageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },

    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" },

    senderRole: {
      type: String,
      enum: ["doctor", "patient"],
      required: true,
    },

    // TEXT SUPPORT
    text: { type: String, default: "" },

    // ⭐ FILE SUPPORT
    fileUrl: { type: String, default: null },   // stored path → "/uploads/..."
    fileType: { type: String, default: null },  // mimetype (image/png, pdf, mp3)

    messageType: {
      type: String,
      enum: ["text", "file"],
      default: "text",
    },
  },
  { timestamps: true }
);

export default mongoose.model("ChatMessage", chatMessageSchema);

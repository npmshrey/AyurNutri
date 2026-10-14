// backend/config/db.js
// The single place the app connects to MongoDB.
import mongoose from "mongoose";

// "mongodb+srv://user:pass@host/db?x" -> "mongodb+srv://user:***@host/db"
// so logs show which database we're using without leaking the password.
const redact = (uri) => uri.replace(/\/\/([^:/@]+):[^@]*@/, "//$1:***@").replace(/\?.*$/, "");

export default async function connectDB() {
  const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ayurveda";

  console.log("Connecting to MongoDB at", redact(uri));
  if (!process.env.MONGO_URI) {
    console.warn("MONGO_URI is not set; falling back to a local database.");
  }

  // Fail after 15s instead of the 30s default, with a clear message.
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 15000 });

  console.log("✅ MongoDB connected");
  console.log("Connected host:", mongoose.connection.host);
  console.log("Connected DB:", mongoose.connection.name);

  return mongoose.connection;
}

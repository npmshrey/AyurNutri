// backend/config/db.js
// Was written with CommonJS require()/module.exports in a project whose
// package.json sets "type": "module" — importing this anywhere used to
// crash immediately. It was also never actually imported, so index.js
// duplicated this logic inline instead. This is now the single place
// the app connects to MongoDB.
import mongoose from "mongoose";

export default async function connectDB() {
  const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ayurveda";

  await mongoose.connect(uri);

  console.log("✅ MongoDB connected");
  console.log("Connected host:", mongoose.connection.host);
  console.log("Connected DB:", mongoose.connection.name);

  return mongoose.connection;
}

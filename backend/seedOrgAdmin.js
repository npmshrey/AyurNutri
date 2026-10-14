import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import mongoose from "mongoose";
import OrgAdmin from "./models/OrgAdmin.js";

dotenv.config();
await mongoose.connect(process.env.MONGO_URI);

const run = async () => {
  const hashed = await bcrypt.hash("Admin@123", 10);

  await OrgAdmin.create({
    organisationName: "AyurNutri HQ",
    email: "admin@ayurnutri.org",
    password: hashed
  });

  console.log("Admin created!");
  process.exit();
};

run();
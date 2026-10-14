import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import OrgAdmin from "../models/OrgAdmin.js";

const router = express.Router();

const getJwtSecret = () => process.env.JWT_SECRET || "dev-secret";

// 1️⃣ ADMIN LOGIN (FIXED)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await OrgAdmin.findOne({ email });
    if (!admin) return res.status(400).json({ message: "Admin not found" });

    const validPass = await bcrypt.compare(password, admin.password);
    if (!validPass)
      return res.status(400).json({ message: "Invalid credentials" });

    // ✅ MUST INCLUDE organisationName INSIDE THE JWT
    const token = jwt.sign(
      {
        id: admin._id,
        role: "org-admin",
        organisationName: admin.organisationName,
      },
      getJwtSecret(),
      { expiresIn: "7d" }
    );

    return res.json({
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        organisationName: admin.organisationName,
        role: admin.role
      }
    });
  } catch (err) {
    console.error("Admin login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
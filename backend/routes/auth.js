import Patient from "../models/Patient.js";
import Doctor from "../models/doctor.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import express from "express";
import crypto from "crypto";
import nodemailer from "nodemailer";

const router = express.Router();

// Read at call time, exactly like authMiddleware.js does, so signing and
// verification always agree on the secret. Same "dev-secret" fallback.
const getJwtSecret = () => process.env.JWT_SECRET || "dev-secret";

// Helper: Create JWT Token
function createToken(id, role, email) {
  return jwt.sign({ id, role, email }, getJwtSecret(), {
    expiresIn: "7d",
  });
}

/* ============================
   PATIENT SIGNUP
   ============================ */
router.post("/signup/patient", async (req, res) => {
  try {
    let { fullName, email, password, phoneNumber, age, gender } = req.body;

    if (!fullName || !email || !password || !phoneNumber || !age || !gender) {
      return res.status(400).json({ message: "All fields are required." });
    }

    email = email.trim().toLowerCase();

    const exists = await Patient.findOne({
      $or: [{ email }, { phoneNumber }],
    });

    if (exists) {
      return res
        .status(409)
        .json({ message: "Email or phone already in use" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const patient = await Patient.create({
      fullName,
      email,
      phoneNumber,
      age: Number(age),
      gender,
      passwordHash,
    });

    const token = createToken(patient._id, "patient", email);

    return res.status(201).json({
      message: "Patient registered successfully",
      patientId: patient._id, // ⭐ IMPORTANT
      user: {
        id: patient._id,
        role: "patient",
        fullName,
        email,
        phoneNumber,
        age: patient.age,
        gender,
      },
      token,
    });
  } catch (err) {
    console.log("Signup error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ============================
   PATIENT LOGIN (FIXED)
   ============================ */
router.post("/login", async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;

    const patient = await Patient.findOne({
      $or: [
        { email: emailOrPhone.toLowerCase() },
        { phoneNumber: emailOrPhone },
      ],
    });

    if (!patient) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const ok = await bcrypt.compare(password, patient.passwordHash);
    if (!ok) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = createToken(patient._id, "patient", patient.email);

    return res.json({
      message: "Login successful",
      patientId: patient._id, // ⭐ CRITICAL FOR BOOKING
      user: {
        id: patient._id,
        role: "patient",
        fullName: patient.fullName,
        email: patient.email,
        phoneNumber: patient.phoneNumber,
        age: patient.age,
        gender: patient.gender,
      },
      token,
    });
  } catch (err) {
    console.log("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ============================
   DOCTOR SIGNUP (AUTO VERIFIED)
   ============================ */
router.post("/signup/doctor", async (req, res) => {
  try {
    let {
      fullName,
      email,
      password,
      phoneNumber,
      gender,
      reg_no,
      council,
      organisationName,
    } = req.body;

    if (!fullName || !email || !password || !reg_no || !council) {
      return res.status(400).json({
        message: "fullName, email, password, reg_no, council are required",
      });
    }

    email = email.toLowerCase().trim();

    const query = [{ email }];
    if (phoneNumber && phoneNumber.trim() !== "") {
      query.push({ phoneNumber });
    }

    const exists = await Doctor.findOne({ $or: query });

    if (exists) {
      return res
        .status(409)
        .json({ message: "Email or phone number already in use" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const doctor = await Doctor.create({
      fullName,
      email,
      phoneNumber: phoneNumber?.trim() || undefined,
      gender,
      passwordHash,
      reg_no,
      council,
      verified: true, // AUTO VERIFIED — can still log in immediately
      organisationName: organisationName?.trim() || undefined,
    });

    const token = createToken(doctor._id, "doctor", email);

    return res.status(201).json({
      message: "Doctor registered successfully",
      user: {
        id: doctor._id,
        role: "doctor",
        fullName,
        email,
        phoneNumber,
        gender,
        reg_no,
        council,
        verified: true,
      },
      token,
    });
  } catch (err) {
    console.log("Doctor signup error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ============================
   DOCTOR LOGIN
   ============================ */
router.post("/login/doctor", async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;

    const doctor = await Doctor.findOne({
      $or: [
        { email: emailOrPhone.toLowerCase() },
        { phoneNumber: emailOrPhone },
      ],
    });

    if (!doctor)
      return res.status(401).json({ message: "Invalid credentials" });

    if (!doctor.verified)
      return res
        .status(403)
        .json({ message: "Doctor not verified. Cannot login." });

    const ok = await bcrypt.compare(password, doctor.passwordHash);
    if (!ok)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = createToken(doctor._id, "doctor", doctor.email);

    return res.json({
      message: "Login successful",
      user: {
        id: doctor._id,
        role: "doctor",
        fullName: doctor.fullName,
        email: doctor.email,
        phoneNumber: doctor.phoneNumber,
        gender: doctor.gender,
        reg_no: doctor.reg_no,
        council: doctor.council,
        verified: doctor.verified,
      },
      token,
    });
  } catch (err) {
    console.log("Doctor login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ============================
   FORGOT PASSWORD
   Shared by both the patient and doctor "Forgot password?" links
   (frontend/src/pages/sign-in/ResetPassword.jsx), since one account can
   only live in one of the two collections at a time.
   ============================ */
const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

const resetTransporter =
  process.env.EMAIL_USER && process.env.EMAIL_PASS
    ? nodemailer.createTransport({
        service: "gmail",
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
      })
    : null;

router.post("/forgot-password", async (req, res) => {
  // Always return the same generic message whether or not the email
  // exists, so this endpoint can't be used to enumerate accounts.
  const genericReply = {
    message:
      "If an account exists for that email, a password reset link has been sent.",
  };

  try {
    const email = String(req.body?.email || "").trim().toLowerCase();
    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    const account =
      (await Patient.findOne({ email })) || (await Doctor.findOne({ email }));

    if (!account) {
      return res.json(genericReply);
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

    account.resetTokenHash = tokenHash;
    account.resetTokenExpires = new Date(Date.now() + RESET_TOKEN_TTL_MS);
    await account.save();

    const frontendOrigin =
      process.env.FRONTEND_ORIGIN || "http://localhost:4028";
    const resetLink = `${frontendOrigin}/reset/confirm?token=${rawToken}`;

    if (resetTransporter) {
      await resetTransporter.sendMail({
        from: `"AyurNutri" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Reset your AyurNutri password",
        html: `
          <p>Someone requested a password reset for this AyurNutri account.</p>
          <p><a href="${resetLink}">Click here to set a new password</a>. This link expires in 1 hour.</p>
          <p>If you didn't request this, you can ignore this email.</p>
        `,
      });
    } else {
      // No EMAIL_USER/EMAIL_PASS configured in this environment — don't
      // silently drop the request, log the link so the flow is still
      // testable locally without real SMTP credentials.
      console.warn(
        "EMAIL_USER/EMAIL_PASS not set — password reset link (dev only):",
        resetLink
      );
    }

    return res.json(genericReply);
  } catch (err) {
    console.error("forgot-password error:", err);
    // Still return the generic reply — don't leak whether something broke
    // that would hint at an account's existence.
    return res.json(genericReply);
  }
});

/* ============================
   RESET PASSWORD (with token)
   ============================ */
router.post("/reset-password", async (req, res) => {
  try {
    const { token, password } = req.body || {};

    if (!token || !password || String(password).length < 6) {
      return res.status(400).json({
        message: "A reset token and a password of at least 6 characters are required.",
      });
    }

    const tokenHash = crypto.createHash("sha256").update(String(token)).digest("hex");
    const now = new Date();

    let account = await Patient.findOne({
      resetTokenHash: tokenHash,
      resetTokenExpires: { $gt: now },
    }).select("+resetTokenHash +resetTokenExpires");

    if (!account) {
      account = await Doctor.findOne({
        resetTokenHash: tokenHash,
        resetTokenExpires: { $gt: now },
      }).select("+resetTokenHash +resetTokenExpires");
    }

    if (!account) {
      return res.status(400).json({
        message: "This reset link is invalid or has expired. Please request a new one.",
      });
    }

    account.passwordHash = await bcrypt.hash(password, 10);
    account.resetTokenHash = undefined;
    account.resetTokenExpires = undefined;
    await account.save();

    return res.json({ message: "Password updated. You can now sign in." });
  } catch (err) {
    console.error("reset-password error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;

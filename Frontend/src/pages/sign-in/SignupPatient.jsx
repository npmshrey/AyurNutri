// src/pages/sign-in/SignupPatient.jsx
// The old form never asked for age, but the backend requires it, so every
// patient signup failed with "All fields are required." Age is now part of
// the form and checked here before the request goes out.
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import {
  AuthLayout,
  PasswordField,
  SelectField,
  FormMessage,
  AuthLink,
} from "../../components/auth/AuthLayout";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:9000";

const EMPTY = { fullName: "", email: "", phoneNumber: "", age: "", gender: "", password: "", confirmPassword: "" };

const validate = (f) => {
  const errors = {};
  if (!f.fullName.trim()) errors.fullName = "Tell us your name.";
  if (!/^\S+@\S+\.\S+$/.test(f.email.trim())) errors.email = "Enter a valid email address.";
  if (!/^[0-9+\-\s]{7,15}$/.test(f.phoneNumber.trim())) errors.phoneNumber = "Enter a valid phone number.";
  const age = Number(f.age);
  if (!f.age || !Number.isInteger(age) || age < 1 || age > 120) errors.age = "Enter your age in years.";
  if (!f.gender) errors.gender = "Choose an option.";
  if (f.password.length < 6) errors.password = "Use at least 6 characters.";
  if (f.confirmPassword !== f.password) errors.confirmPassword = "Passwords don't match.";
  return errors;
};

const SignupPatient = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length) return;

    try {
      setLoading(true);
      const res = await axios.post(`${API_BASE}/api/auth/signup/patient`, {
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phoneNumber: form.phoneNumber.trim(),
        age: Number(form.age),
        gender: form.gender,
        password: form.password,
      });
      const { token, user, patientId } = res.data || {};
      if (token) localStorage.setItem("authToken", token);
      if (user) localStorage.setItem("currentUser", JSON.stringify(user));
      if (patientId) localStorage.setItem("patientId", patientId);
      navigate("/personal-wellness-hub", { replace: true });
    } catch (err) {
      setServerError(
        err?.response?.data?.message ||
          (err?.request ? "Can't reach the server. Check your connection and try again." : "Sign up failed.")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      aside={{
        kicker: "Patients",
        heading: "Start with your dosha.",
        body: "Create a free account, take the questionnaire, and your practitioner can build a plan around the result.",
        points: [
          "A short dosha questionnaire with results you keep",
          "Weekly plans approved by a real practitioner",
          "Daily check-ins that take seconds",
        ],
      }}
      eyebrow="Create account"
      title="Patient profile"
      subtitle="Takes about a minute."
      footer={
        <>
          Already registered? <AuthLink to="/signin">Sign in</AuthLink>
          <span className="mx-2 text-border">·</span>
          Practitioner? <AuthLink to="/signup/doctor">Register here</AuthLink>
        </>
      }
    >
      <FormMessage>{serverError}</FormMessage>
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div data-auth-item>
          <Input label="Full name" autoComplete="name" required value={form.fullName} onChange={set("fullName")} error={errors.fullName} />
        </div>
        <div data-auth-item className="grid gap-4 sm:grid-cols-2">
          <Input label="Email" type="email" autoComplete="email" required value={form.email} onChange={set("email")} error={errors.email} />
          <Input label="Phone" type="tel" autoComplete="tel" required value={form.phoneNumber} onChange={set("phoneNumber")} error={errors.phoneNumber} />
        </div>
        <div data-auth-item className="grid gap-4 sm:grid-cols-2">
          <Input label="Age" type="number" inputMode="numeric" min={1} max={120} required value={form.age} onChange={set("age")} error={errors.age} />
          <div>
            <SelectField label="Gender" required value={form.gender} onChange={set("gender")}>
              <option value="">Select</option>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
              <option value="Non-binary">Non-binary</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </SelectField>
            {errors.gender && <p className="mt-1.5 text-xs text-destructive">{errors.gender}</p>}
          </div>
        </div>
        <div data-auth-item className="grid gap-4 sm:grid-cols-2">
          <PasswordField autoComplete="new-password" required value={form.password} onChange={set("password")} error={errors.password} />
          <PasswordField label="Confirm password" autoComplete="new-password" required value={form.confirmPassword} onChange={set("confirmPassword")} error={errors.confirmPassword} />
        </div>
        <div data-auth-item>
          <Button type="submit" loading={loading} fullWidth size="lg" className="rounded-full">
            Create account
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
};

export default SignupPatient;

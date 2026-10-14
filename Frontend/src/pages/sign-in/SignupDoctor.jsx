// src/pages/sign-in/SignupDoctor.jsx
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

const EMPTY = {
  fullName: "",
  email: "",
  phoneNumber: "",
  gender: "",
  regNo: "",
  council: "",
  organisationName: "",
  password: "",
  confirmPassword: "",
};

const validate = (f) => {
  const errors = {};
  if (!f.fullName.trim()) errors.fullName = "Enter your full name.";
  if (!/^\S+@\S+\.\S+$/.test(f.email.trim())) errors.email = "Enter a valid email address.";
  if (f.phoneNumber && !/^[0-9+\-\s]{7,15}$/.test(f.phoneNumber.trim())) errors.phoneNumber = "Enter a valid phone number.";
  if (!f.regNo.trim()) errors.regNo = "Your registration number is required.";
  if (!f.council.trim()) errors.council = "Name the council you're registered with.";
  if (f.password.length < 6) errors.password = "Use at least 6 characters.";
  if (f.confirmPassword !== f.password) errors.confirmPassword = "Passwords don't match.";
  return errors;
};

const SignupDoctor = () => {
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
      const res = await axios.post(`${API_BASE}/api/auth/signup/doctor`, {
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        password: form.password,
        phoneNumber: form.phoneNumber.trim() || undefined,
        gender: form.gender || undefined,
        reg_no: form.regNo.trim(),
        council: form.council.trim(),
        organisationName: form.organisationName.trim() || undefined,
      });
      const { token, user } = res.data || {};
      if (token) localStorage.setItem("authToken", token);
      if (user) localStorage.setItem("currentUser", JSON.stringify(user));
      navigate("/professional-dashboard-portal", { replace: true });
    } catch (err) {
      setServerError(
        err?.response?.data?.message ||
          (err?.request ? "Can't reach the server. Check your connection and try again." : "Registration failed.")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      wide
      aside={{
        kicker: "Practitioners",
        heading: "Register your practice.",
        body: "Your registration number and council are recorded with your account. If you work with a clinic, add its name so its admin can see you.",
        points: [
          "Build and approve weekly plans for each patient",
          "Clinical notes and uploaded reports in one place",
          "Chat and appointments without extra tools",
        ],
      }}
      eyebrow="Create account"
      title="Practitioner details"
      subtitle="Fields marked * are required."
      footer={
        <>
          Already registered? <AuthLink to="/signin/doctor">Sign in</AuthLink>
          <span className="mx-2 text-border">·</span>
          Patient? <AuthLink to="/signup">Create a patient account</AuthLink>
        </>
      }
    >
      <FormMessage>{serverError}</FormMessage>
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div data-auth-item className="grid gap-4 sm:grid-cols-2">
          <Input label="Full name" autoComplete="name" required value={form.fullName} onChange={set("fullName")} error={errors.fullName} />
          <SelectField label="Gender" value={form.gender} onChange={set("gender")}>
            <option value="">Prefer not to say</option>
            <option value="Female">Female</option>
            <option value="Male">Male</option>
            <option value="Non-binary">Non-binary</option>
          </SelectField>
        </div>
        <div data-auth-item className="grid gap-4 sm:grid-cols-2">
          <Input label="Email" type="email" autoComplete="email" required value={form.email} onChange={set("email")} error={errors.email} />
          <Input label="Phone" type="tel" autoComplete="tel" value={form.phoneNumber} onChange={set("phoneNumber")} error={errors.phoneNumber} description="Optional" />
        </div>
        <div data-auth-item className="grid gap-4 sm:grid-cols-2">
          <Input label="Registration number" required value={form.regNo} onChange={set("regNo")} error={errors.regNo} />
          <Input label="Council" placeholder="e.g. Central Council of Indian Medicine" required value={form.council} onChange={set("council")} error={errors.council} />
        </div>
        <div data-auth-item>
          <Input
            label="Clinic or organisation"
            value={form.organisationName}
            onChange={set("organisationName")}
            description="Optional. Lets your clinic's admin find and approve you."
          />
        </div>
        <div data-auth-item className="grid gap-4 sm:grid-cols-2">
          <PasswordField autoComplete="new-password" required value={form.password} onChange={set("password")} error={errors.password} />
          <PasswordField label="Confirm password" autoComplete="new-password" required value={form.confirmPassword} onChange={set("confirmPassword")} error={errors.confirmPassword} />
        </div>
        <div data-auth-item>
          <Button type="submit" loading={loading} fullWidth size="lg" className="rounded-md">
            Create practitioner account
          </Button>
        </div>
        <p data-auth-item className="text-center text-xs text-text-secondary">
          By creating an account you agree to the <AuthLink to="/terms">Terms and Conditions</AuthLink> and{" "}
          <AuthLink to="/privacy">Privacy Policy</AuthLink>.
        </p>
      </form>
    </AuthLayout>
  );
};

export default SignupDoctor;

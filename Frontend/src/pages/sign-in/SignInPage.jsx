import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { AuthLayout, PasswordField, FormMessage, AuthLink } from "../../components/auth/AuthLayout";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:9000";

const SignInPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // If a guard sent us here, go back to where the patient was headed.
  const from = location.state?.from?.pathname;
  const destination = from && from.startsWith("/personal-wellness-hub") ? from : "/personal-wellness-hub";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!emailOrPhone.trim() || !password) {
      setErrorMsg("Enter your email or phone number and your password.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${API_BASE}/api/auth/login`, {
        emailOrPhone: emailOrPhone.trim(),
        password,
      });
      const { token, user, patientId } = res.data || {};
      if (token) localStorage.setItem("authToken", token);
      if (user) localStorage.setItem("currentUser", JSON.stringify(user));
      if (patientId) localStorage.setItem("patientId", patientId);
      navigate(destination, { replace: true });
    } catch (err) {
      setErrorMsg(
        err?.response?.data?.message ||
          (err?.request ? "Can't reach the server. Check your connection and try again." : "Sign in failed.")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      aside={{
        kicker: "Patients",
        heading: "Welcome back.",
        body: "Pick up where you left off: this week's plan, your dosha results, and messages from your practitioner.",
        points: [
          "Your approved meal plan, day by day",
          "Tick off meals and exercise as you go",
          "Scan a dish for a quick nutrient estimate",
        ],
      }}
      eyebrow="Sign in"
      title="Patient account"
      subtitle="Use the email or phone number you registered with."
      footer={
        <>
          New here? <AuthLink to="/signup">Create a patient account</AuthLink>
          <span className="mx-2 text-border">·</span>
          Practitioner? <AuthLink to="/signin/doctor">Sign in here</AuthLink>
        </>
      }
    >
      <FormMessage>{errorMsg}</FormMessage>
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div data-auth-item>
          <Input
            label="Email or phone"
            autoComplete="username"
            placeholder="you@example.com"
            required
            value={emailOrPhone}
            onChange={(e) => setEmailOrPhone(e.target.value)}
          />
        </div>
        <div data-auth-item>
          <PasswordField
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="mt-2 text-right text-sm">
            <AuthLink to="/reset">Forgot password?</AuthLink>
          </div>
        </div>
        <div data-auth-item>
          <Button type="submit" loading={loading} fullWidth size="lg" className="rounded-full">
            Sign in
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
};

export default SignInPage;

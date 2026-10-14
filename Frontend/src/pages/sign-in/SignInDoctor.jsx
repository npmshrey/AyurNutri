import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { AuthLayout, PasswordField, FormMessage, AuthLink } from "../../components/auth/AuthLayout";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:9000";

const DOCTOR_AREAS = ["/professional-dashboard-portal", "/doctor/"];

const SignInDoctor = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname;
  const destination =
    from && DOCTOR_AREAS.some((p) => from.startsWith(p)) ? from : "/professional-dashboard-portal";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!emailOrPhone.trim() || !password) {
      setErrorMsg("Enter your registered email or phone number and your password.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${API_BASE}/api/auth/login/doctor`, {
        emailOrPhone: emailOrPhone.trim(),
        password,
      });
      const { token, user } = res.data || {};
      if (token) localStorage.setItem("authToken", token);
      if (user) localStorage.setItem("currentUser", JSON.stringify(user));
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
        kicker: "Practitioners",
        heading: "Your patients, their plans, one workspace.",
        body: "Review AI-drafted weekly plans, adjust them, and see how each patient is actually getting on.",
        points: [
          "Link patients by the email or phone they signed up with",
          "Approve every plan before a patient sees it",
          "Adherence and daily logs without chasing anyone",
        ],
      }}
      eyebrow="Sign in"
      title="Practitioner account"
      subtitle="Use your registered professional email or phone."
      footer={
        <>
          New to AyurNutri? <AuthLink to="/signup/doctor">Register your practice</AuthLink>
          <span className="mx-2 text-border">·</span>
          Patient? <AuthLink to="/signin">Sign in here</AuthLink>
        </>
      }
    >
      <FormMessage>{errorMsg}</FormMessage>
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div data-auth-item>
          <Input
            label="Email or phone"
            autoComplete="username"
            placeholder="doctor@clinic.in"
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

export default SignInDoctor;

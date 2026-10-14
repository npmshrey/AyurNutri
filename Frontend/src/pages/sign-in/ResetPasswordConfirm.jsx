// src/pages/sign-in/ResetPasswordConfirm.jsx
// Reached from the emailed link: /reset/confirm?token=...
import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import Button from "../../components/ui/Button";
import { AuthLayout, PasswordField, FormMessage, AuthLink } from "../../components/auth/AuthLayout";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:9000";

const ResetPasswordConfirm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | done | error
  const [errorMsg, setErrorMsg] = useState("");

  const fail = (msg) => {
    setStatus("error");
    setErrorMsg(msg);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!token) return fail("This link is missing its reset token. Request a new one.");
    if (password.length < 6) return fail("Use at least 6 characters.");
    if (password !== confirmPassword) return fail("Passwords don't match.");

    setStatus("loading");
    try {
      await axios.post(`${API_BASE}/api/auth/reset-password`, { token, password });
      setStatus("done");
      setTimeout(() => navigate("/auth-selection"), 2200);
    } catch (err) {
      fail(err?.response?.data?.message || "This reset link is invalid or has expired. Request a new one.");
    }
  };

  return (
    <AuthLayout
      eyebrow="Account recovery"
      title="Choose a new password"
      subtitle="You'll use it for your next sign in."
      footer={<>Link expired? <AuthLink to="/reset">Request a new one</AuthLink></>}
    >
      {!token && status !== "done" && (
        <FormMessage>This page needs the link from your reset email. Request a new one below.</FormMessage>
      )}
      {status === "done" ? (
        <div data-auth-item>
          <FormMessage kind="success">Password updated. Taking you to sign in…</FormMessage>
        </div>
      ) : (
        <>
          <FormMessage>{status === "error" ? errorMsg : ""}</FormMessage>
          <form onSubmit={submit} className="space-y-4" noValidate>
            <div data-auth-item>
              <PasswordField
                label="New password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                description="At least 6 characters."
              />
            </div>
            <div data-auth-item>
              <PasswordField
                label="Confirm new password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <div data-auth-item>
              <Button type="submit" loading={status === "loading"} disabled={!token} fullWidth size="lg" className="rounded-md">
                Update password
              </Button>
            </div>
          </form>
        </>
      )}
    </AuthLayout>
  );
};

export default ResetPasswordConfirm;

// src/pages/sign-in/ResetPassword.jsx
import React, { useState } from "react";
import axios from "axios";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { AuthLayout, FormMessage, AuthLink } from "../../components/auth/AuthLayout";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:9000";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | sent | error
  const [errorMsg, setErrorMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setStatus("error");
      setErrorMsg("Enter the email address you registered with.");
      return;
    }
    setStatus("loading");
    setErrorMsg("");
    try {
      await axios.post(`${API_BASE}/api/auth/forgot-password`, { email: email.trim() });
      // The server replies the same way whether or not the account exists.
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err?.response?.data?.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <AuthLayout
      eyebrow="Account recovery"
      title="Reset your password"
      subtitle="Works for both patient and practitioner accounts."
      footer={
        <>
          Remembered it? <AuthLink to="/signin">Patient sign in</AuthLink>
          <span className="mx-2 text-border">·</span>
          <AuthLink to="/signin/doctor">Practitioner sign in</AuthLink>
        </>
      }
    >
      {status === "sent" ? (
        <div data-auth-item>
          <FormMessage kind="success">
            If an account exists for <strong>{email.trim()}</strong>, a reset link is on its way. Check your
            inbox and spam folder. The link expires in an hour.
          </FormMessage>
          <Button variant="outline" fullWidth className="rounded-full" onClick={() => setStatus("idle")}>
            Use a different email
          </Button>
        </div>
      ) : (
        <>
          <FormMessage>{status === "error" ? errorMsg : ""}</FormMessage>
          <form onSubmit={submit} className="space-y-4" noValidate>
            <div data-auth-item>
              <Input
                label="Email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div data-auth-item>
              <Button type="submit" loading={status === "loading"} fullWidth size="lg" className="rounded-full">
                Send reset link
              </Button>
            </div>
          </form>
        </>
      )}
    </AuthLayout>
  );
};

export default ResetPassword;

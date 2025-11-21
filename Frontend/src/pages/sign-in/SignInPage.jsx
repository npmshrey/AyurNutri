// src/pages/sign-in/SignInPage.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Icon from "../../components/AppIcon";
import Button from "../../components/ui/Button";

const SignInPage = () => {
  const [mode] = useState("patientLogin"); // left for future expansion
  const [lang, setLang] = useState("EN");
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const submit = (e) => {
    e?.preventDefault();
    console.log("SIGNIN:", { username, password });
    // TODO: real auth -> on success navigate(...)
    // navigate('/personal-wellness-hub');
  };

  const BrandLogo = () => (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary/10">
        <Icon name="Leaf" size={18} className="text-primary" />
      </div>
      <div>
        <div className="text-xl lg:text-2xl font-display font-semibold text-primary leading-tight">AyurNutri</div>
        <div className="text-xs text-text-secondary">Ancient Wisdom • Modern Precision</div>
      </div>
    </div>
  );

  const Input = ({ placeholder, value, onChange, type = "text" }) => (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full border-2 border-border rounded-md py-2.5 px-3 text-sm text-center placeholder:text-primary/60 focus:outline-none focus:ring-0"
    />
  );

  return (
    <div className="min-h-screen flex items-start justify-center bg-background/60 py-12">
      <div className="w-full px-4">
        <div className="mx-auto max-w-xl">
          <div className="bg-card rounded-2xl border-4 border-border p-6 sm:p-8 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <BrandLogo />
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setLang("HI")}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${lang === "HI" ? 'bg-brand-gold text-white' : 'bg-white border border-border text-primary'}`}
                >
                  HINDI
                </button>
                <button
                  onClick={() => setLang("EN")}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${lang === "EN" ? 'bg-white border-2 border-border text-primary' : 'bg-white text-primary/80'}`}
                >
                  ENGLISH
                </button>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 mb-5">
              <button className="px-5 py-2 rounded-full text-sm font-semibold bg-primary text-primary-foreground shadow">
                LOGIN
              </button>
              <Link to="/signup" className="px-4 py-2 rounded-full text-sm font-semibold bg-white border-2 border-border text-text-secondary">
                SIGNUP
              </Link>
            </div>

            <form onSubmit={submit} className="space-y-3">
              <Input placeholder={lang === "EN" ? "USERNAME / EMAIL" : "उपयोगकर्ता नाम / ईमेल"} value={username} onChange={setUsername} />
              <Input placeholder={lang === "EN" ? "PASSWORD" : "पासवर्ड"} type="password" value={password} onChange={setPassword} />

              <div className="flex flex-col sm:flex-row items-center gap-3 justify-center mt-3">
                <Button type="submit" className="w-full sm:w-auto bg-primary text-primary-foreground px-6 py-2">LOGIN</Button>

                <Link to="/signup/doctor" className="w-full sm:w-auto flex items-center justify-center border-2 border-border px-4 py-2 rounded-md text-sm">
                  DOCTOR SIGNUP
                </Link>
              </div>

              <div className="text-center mt-2">
                <Link to="/reset" className="text-primary text-sm font-medium">FORGOT PASSWORD?</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;

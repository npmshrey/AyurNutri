// src/pages/sign-in/SignupPatient.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Icon from "../../components/AppIcon";
import Button from "../../components/ui/Button";

const SignupPatient = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "", name: "", email: "", password: "", confirmPassword: "", age: "", gender: ""
  });

  const handleChange = (key) => (val) => setForm(prev => ({ ...prev, [key]: val }));

  const submit = (e) => {
    e?.preventDefault();
    console.log("PATIENT SIGNUP:", form);
    // TODO: call API then navigate to signin or dashboard
    // navigate('/signin');
  };

  return (
    <div className="min-h-screen flex items-start justify-center bg-background/60 py-12">
      <div className="w-full px-4">
        <div className="mx-auto max-w-lg">
          <div className="bg-card rounded-2xl border-4 border-border p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary/10">
                <Icon name="User" size={18} className="text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-primary">Patient Signup</h2>
                <div className="text-xs text-text-secondary">Create your AyurNutri account</div>
              </div>
            </div>

            <form onSubmit={submit} className="space-y-3">
              <input className="w-full border-2 border-border rounded-md py-2 px-3 text-sm" placeholder="USERNAME" value={form.username} onChange={e => handleChange('username')(e.target.value)} />
              <input className="w-full border-2 border-border rounded-md py-2 px-3 text-sm" placeholder="FULL NAME" value={form.name} onChange={e => handleChange('name')(e.target.value)} />
              <input className="w-full border-2 border-border rounded-md py-2 px-3 text-sm" placeholder="EMAIL" value={form.email} onChange={e => handleChange('email')(e.target.value)} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input type="password" className="w-full border-2 border-border rounded-md py-2 px-3 text-sm" placeholder="PASSWORD" value={form.password} onChange={e => handleChange('password')(e.target.value)} />
                <input type="password" className="w-full border-2 border-border rounded-md py-2 px-3 text-sm" placeholder="CONFIRM PASSWORD" value={form.confirmPassword} onChange={e => handleChange('confirmPassword')(e.target.value)} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input className="w-full border-2 border-border rounded-md py-2 px-3 text-sm" placeholder="AGE" value={form.age} onChange={e => handleChange('age')(e.target.value)} />
                <input className="w-full border-2 border-border rounded-md py-2 px-3 text-sm" placeholder="GENDER" value={form.gender} onChange={e => handleChange('gender')(e.target.value)} />
                <input className="w-full border-2 border-border rounded-md py-2 px-3 text-sm" placeholder="COUNTRY (optional)" />
              </div>

              <div className="flex items-center justify-center gap-3 mt-2">
                <Button type="submit" className="bg-primary text-primary-foreground px-6 py-2">CREATE ACCOUNT</Button>
                <Link to="/signin" className="bg-white border-2 border-border px-4 py-2 rounded-md">BACK TO LOGIN</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPatient;

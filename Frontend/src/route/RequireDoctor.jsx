// src/route/RequireDoctor.jsx
import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { readSession } from "./session";

const RequireDoctor = () => {
  const location = useLocation();
  const { token, user } = readSession();

  if (!token || !user) {
    return <Navigate to="/signin/doctor" replace state={{ from: location }} />;
  }
  if (user.role === "patient") {
    // A signed-in patient belongs in their own hub, not on a sign-in page.
    return <Navigate to="/personal-wellness-hub" replace />;
  }
  if (user.role !== "doctor") {
    return <Navigate to="/signin/doctor" replace state={{ from: location }} />;
  }
  return <Outlet />;
};

export default RequireDoctor;

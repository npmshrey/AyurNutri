// src/route/RequirePatient.jsx
import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { readSession } from "./session";

const RequirePatient = () => {
  const location = useLocation();
  const { token, user } = readSession();

  if (!token || !user) {
    // Remember where they were going so sign-in can send them back.
    return <Navigate to="/signin" replace state={{ from: location }} />;
  }
  if (user.role === "doctor") {
    return <Navigate to="/professional-dashboard-portal" replace />;
  }
  if (user.role !== "patient") {
    return <Navigate to="/signin" replace state={{ from: location }} />;
  }
  return <Outlet />;
};

export default RequirePatient;

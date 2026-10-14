// src/route/session.js
// Reads the session that the sign-in pages store. Both patient and doctor
// sign-in write the same two keys: "authToken" and "currentUser".
export const readSession = () => {
  const token = localStorage.getItem("authToken");
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("currentUser") || "null");
  } catch {
    user = null;
  }
  return { token, user };
};

import React from "react";
import Routes from "./Routes";

// The theme is applied before first paint by a small script in index.html,
// and kept in sync by hooks/useTheme. The chatbot now lives inside the
// router (Routes.jsx) so it can hide itself on sign-in screens.
const App = () => <Routes />;

export default App;

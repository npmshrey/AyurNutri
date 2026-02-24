import React, { useEffect } from "react";
import Routes from "./Routes";
import Chatbot from "./components/ui/Chatbot";

const App = () => {
  // 🟢 1) GLOBAL THEME INIT – har page pe chalega
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("theme");
      const theme = savedTheme === "dark" ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", theme);
    } catch (e) {
      document.documentElement.setAttribute("data-theme", "light");
    }
  }, []);

  // 🟢 2) tumhara existing sidebar remove wala effect – bilkul same
  useEffect(() => {
    const labelsToRemove = [
      "Research Library",
      "Continuing Education",
      "Customization",
      "Dosha Explorer"
    ];

    const removeSidebarItems = () => {
      const containers = document.querySelectorAll(
        "aside, .sidebar, .left-nav, .nav-sidebar"
      );

      containers.forEach((container) => {
        container
          .querySelectorAll("a, button, [role='link'], li")
          .forEach((el) => {
            const text = (el.textContent || "").trim();
            if (!text) return;

            if (
              labelsToRemove.some(
                (label) => text === label || text.startsWith(label)
              )
            ) {
              const li = el.closest("li");
              if (li) li.remove();
              else el.remove();
            }
          });
      });
    };

    const t = setTimeout(removeSidebarItems, 200);
    const onPop = () => setTimeout(removeSidebarItems, 100);
    window.addEventListener("popstate", onPop);

    return () => {
      clearTimeout(t);
      window.removeEventListener("popstate", onPop);
    };
  }, []);

  return (
    <>
      <Routes />
      <Chatbot /> {/* 👈 chatbot added globally */}
    </>
  );
};

export default App;

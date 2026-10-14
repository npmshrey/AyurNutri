// src/components/ui/Chatbot.jsx
//
// Changes from the previous version:
//  - The microphone is only requested when someone taps the mic. It used to
//    call getUserMedia on every page load, so every visitor got a mic
//    permission prompt (or a console warning) for a feature they hadn't used.
//  - Spoken replies are off by default instead of reading every answer aloud.
//  - The list scrolls to the newest message.
//  - Hidden on sign-in/sign-up screens, where the bubble covered the submit
//    button on phones.
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { MessageCircle, X, Mic, MicOff, Volume2, VolumeX, Send } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import { gsap } from "../../lib/motion";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:9000";
const HIDDEN_ON = ["/signin", "/signup", "/reset", "/auth-selection"];

export default function Chatbot() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi! Ask me about foods, doshas or how to use AyurNutri." },
  ]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);

  const recognitionRef = useRef(null);
  const panelRef = useRef(null);
  const listRef = useRef(null);
  const inputRef = useRef(null);
  const { user } = useAuth();

  const hidden = HIDDEN_ON.some((p) => pathname.startsWith(p));

  useEffect(() => {
    if (hidden) setOpen(false);
  }, [hidden]);

  // Keep the newest message in view.
  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  // Panel open animation, growing out of the bubble's corner.
  useLayoutEffect(() => {
    if (!open || !panelRef.current) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduce) {
      gsap.fromTo(
        panelRef.current,
        { scale: 0.9, autoAlpha: 0, transformOrigin: "bottom right" },
        { scale: 1, autoAlpha: 1, duration: 0.35, ease: "back.out(1.4)" }
      );
    }
    inputRef.current?.focus();
  }, [open]);

  const close = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !panelRef.current) return setOpen(false);
    gsap.to(panelRef.current, {
      scale: 0.92,
      autoAlpha: 0,
      duration: 0.2,
      ease: "power2.in",
      onComplete: () => setOpen(false),
    });
  };

  // Close on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Set up speech recognition lazily, the first time the mic is used.
  const getRecognition = () => {
    if (recognitionRef.current) return recognitionRef.current;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return null;
    const r = new SR();
    r.lang = "en-IN"; // copes well with English, Hinglish and Indian accents
    r.continuous = false;
    r.interimResults = true;
    r.onstart = () => setIsListening(true);
    r.onend = () => setIsListening(false);
    r.onerror = () => setIsListening(false);
    r.onresult = (event) => {
      let finalText = "";
      let interimText = "";
      for (let i = 0; i < event.results.length; i++) {
        const t = event.results[i][0].transcript;
        if (event.results[i].isFinal) finalText += t;
        else interimText += t;
      }
      setInput(finalText || interimText);
    };
    recognitionRef.current = r;
    return r;
  };

  const toggleListening = () => {
    const r = getRecognition();
    if (!r) {
      setMessages((m) => [...m, { from: "bot", text: "Voice input isn't supported in this browser. Typing works everywhere." }]);
      return;
    }
    if (isListening) r.stop();
    else {
      try {
        r.start(); // the browser asks for mic permission here, not on page load
      } catch {
        /* already started */
      }
    }
  };

  const speak = (text) => {
    if (!voiceEnabled || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-IN";
    window.speechSynthesis.speak(u);
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isSending) return;
    setMessages((m) => [...m, { from: "user", text }]);
    setInput("");
    setIsSending(true);
    try {
      const res = await fetch(`${API_BASE}/api/chatbot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          user: { name: user?.fullName || user?.name, dosha: user?.dosha || user?.doshaType, age: user?.age },
        }),
      });
      const data = await res.json();
      const reply = data?.reply || "Sorry, I couldn't answer that just now.";
      setMessages((m) => [...m, { from: "bot", text: reply }]);
      speak(reply);
    } catch {
      setMessages((m) => [...m, { from: "bot", text: "I can't reach the server right now. Please try again in a moment." }]);
    } finally {
      setIsSending(false);
    }
  };

  if (hidden) return null;

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed bottom-5 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[var(--shadow-elevated)] transition-transform duration-200 hover:scale-105 active:scale-95 sm:h-14 sm:w-14"
          aria-label="Open the AyurNutri assistant"
        >
          <MessageCircle size={24} />
        </button>
      )}

      {open && (
        <div
          ref={panelRef}
          role="dialog"
          aria-label="AyurNutri assistant"
          className="fixed inset-x-3 bottom-3 z-50 flex h-[min(480px,calc(100vh-6rem))] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-elevated)] sm:inset-x-auto sm:bottom-6 sm:right-6 sm:w-96"
        >
          <div className="flex items-start justify-between gap-3 border-b border-border bg-muted/70 px-4 py-3">
            <div>
              <h3 className="font-display text-base font-semibold text-primary">AyurNutri assistant</h3>
              <p className="text-xs text-text-secondary">Type or speak in English, Hindi or another Indian language.</p>
            </div>
            <button
              type="button"
              onClick={close}
              className="rounded-md p-1 text-text-secondary transition-colors hover:bg-card hover:text-text-primary"
              aria-label="Close assistant"
            >
              <X size={18} />
            </button>
          </div>

          <div ref={listRef} className="flex-1 space-y-2.5 overflow-y-auto px-4 py-3" aria-live="polite">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
                  msg.from === "user"
                    ? "ml-auto rounded-br-md bg-primary text-primary-foreground"
                    : "mr-auto rounded-bl-md bg-muted text-text-primary"
                }`}
              >
                {msg.text}
              </div>
            ))}
            {isSending && (
              <div className="mr-auto flex gap-1 rounded-2xl rounded-bl-md bg-muted px-3.5 py-3" aria-label="Assistant is typing">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="h-1.5 w-1.5 animate-bounce rounded-full bg-text-secondary/60"
                    style={{ animationDelay: `${i * 120}ms` }}
                  />
                ))}
              </div>
            )}
          </div>

          <form
            className="flex items-center gap-2 border-t border-border p-3"
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
          >
            <button
              type="button"
              onClick={() => setVoiceEnabled((v) => !v)}
              className={`rounded-lg border border-border p-2 transition-colors hover:bg-muted ${voiceEnabled ? "text-primary" : "text-text-secondary"}`}
              aria-label={voiceEnabled ? "Turn off spoken replies" : "Read replies aloud"}
              aria-pressed={voiceEnabled}
            >
              {voiceEnabled ? <Volume2 size={17} /> : <VolumeX size={17} />}
            </button>
            <div className="flex flex-1 items-center rounded-lg border border-border bg-input pl-3 focus-within:border-primary">
              <input
                ref={inputRef}
                className="w-full bg-transparent py-2 text-sm text-text-primary outline-none placeholder:text-text-secondary/60"
                placeholder={isListening ? "Listening…" : "Ask something…"}
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button
                type="button"
                onClick={toggleListening}
                className={`mr-1 rounded-md p-1.5 transition-colors hover:bg-muted ${isListening ? "text-destructive" : "text-text-secondary"}`}
                aria-label={isListening ? "Stop listening" : "Speak your question"}
              >
                {isListening ? <MicOff size={17} /> : <Mic size={17} />}
              </button>
            </div>
            <button
              type="submit"
              disabled={isSending || !input.trim()}
              className="rounded-lg bg-primary p-2.5 text-primary-foreground transition-opacity disabled:opacity-40"
              aria-label="Send"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}

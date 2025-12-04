import React, { useEffect, useState, useRef } from "react";
import useAuth from "../../../hooks/useAuth";
import { io } from "socket.io-client";

const API_BASE = "http://localhost:9000";   // ✅ Backend origin for file URLs
const socket = io(API_BASE);

const Messages = () => {
  const { user } = useAuth(); // patient

  const [doctors, setDoctors] = useState([]);
  const [activeDoctorId, setActiveDoctorId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [error, setError] = useState("");

  const chatBoxRef = useRef(null);
  const fileInputRef = useRef(null);

  const [isDoctorTyping, setIsDoctorTyping] = useState(false);

  /* ---------------------------------------------------------
     SOCKET INITIALIZATION
  --------------------------------------------------------- */
  useEffect(() => {
    socket.emit("user-online", { userId: user.id, role: "patient" });

    socket.on("receive-message", (msg) => {
      if (msg.patientId === user.id && msg.doctorId === activeDoctorId) {
        setMessages((prev) => [...prev, msg]);
        scrollToBottom();
      }
    });

    socket.on("typing", () => {
      setIsDoctorTyping(true);
      setTimeout(() => setIsDoctorTyping(false), 1500);
    });

    return () => {
      socket.off("receive-message");
      socket.off("typing");
    };
  }, [activeDoctorId]);

  /* ---------------------------------------------------------
     AUTO SCROLL
  --------------------------------------------------------- */
  const scrollToBottom = () => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  };

  /* ---------------------------------------------------------
     1) Load Doctors
  --------------------------------------------------------- */
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoadingDoctors(true);

        const res = await fetch(`${API_BASE}/api/doctors`);
        const data = await res.json();

        setDoctors(data);
        if (data.length > 0) {
          setActiveDoctorId(data[0]._id);
        }
      } catch (err) {
        console.error(err);
        setError("Unable to load doctors.");
      } finally {
        setLoadingDoctors(false);
      }
    };

    fetchDoctors();
  }, []);

  /* ---------------------------------------------------------
     2) Load Messages
  --------------------------------------------------------- */
  useEffect(() => {
    if (!activeDoctorId) return;

    const fetchChat = async () => {
      try {
        setLoadingMessages(true);
        const token = localStorage.getItem("authToken");

        const res = await fetch(
          `${API_BASE}/api/chat/thread?patientId=${user.id}&doctorId=${activeDoctorId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const data = await res.json();
        setMessages(data);

        setTimeout(scrollToBottom, 100);
      } catch (err) {
        console.error(err);
        setError("Failed to load messages");
      } finally {
        setLoadingMessages(false);
      }
    };

    fetchChat();
  }, [activeDoctorId]);

  /* ---------------------------------------------------------
     3) Send Text Message
  --------------------------------------------------------- */
  const handleSend = async () => {
    if (!text.trim()) return;

    const optimisticMsg = {
      id: "tmp-" + Date.now(),
      patientId: user.id,
      doctorId: activeDoctorId,
      senderRole: "patient",
      text,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, optimisticMsg]);
    scrollToBottom();
    setText("");

    socket.emit("send-message", {
      ...optimisticMsg,
      receiverId: activeDoctorId,
    });

    try {
      const token = localStorage.getItem("authToken");

      const res = await fetch(`${API_BASE}/api/chat/send`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          patientId: user.id,
          doctorId: activeDoctorId,
          text,
        }),
      });

      const saved = await res.json();

      setMessages((prev) =>
        prev.map((m) => (m.id === optimisticMsg.id ? saved : m))
      );
    } catch (err) {
      console.error(err);
    }
  };

  /* ---------------------------------------------------------
     4) Send File (Image, PDF, etc.)
  --------------------------------------------------------- */
  const handleFileSend = async (file) => {
    if (!file) return;

    const tempUrl = URL.createObjectURL(file);

    const optimisticMsg = {
      id: "tmp-file-" + Date.now(),
      senderRole: "patient",
      patientId: user.id,
      doctorId: activeDoctorId,
      fileUrl: tempUrl,
      fileType: file.type,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, optimisticMsg]);
    scrollToBottom();

    const formData = new FormData();
    formData.append("file", file);
    formData.append("patientId", user.id);
    formData.append("doctorId", activeDoctorId);

    try {
      const token = localStorage.getItem("authToken");

      const res = await fetch(`${API_BASE}/api/chat/send-file`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const saved = await res.json();

      setMessages((prev) =>
        prev.map((m) => (m.id === optimisticMsg.id ? saved : m))
      );

      socket.emit("send-message", {
        ...saved,
        receiverId: activeDoctorId,
      });
    } catch (err) {
      console.error("File upload failed", err);
    }
  };

  const handleTyping = () => {
    socket.emit("typing", { receiverId: activeDoctorId });
  };

  const activeDoctor = doctors.find((d) => d._id === activeDoctorId);

  /* ---------------------------------------------------------
     FILE BUBBLE (PDF, Image, Others)
  --------------------------------------------------------- */
  const renderFileBubble = (msg) => {
    const isImage = msg.fileType?.startsWith("image/");
    const isPdf = msg.fileType === "application/pdf";

    const fileUrl = msg.fileUrl.startsWith("blob:")
      ? msg.fileUrl
      : `${API_BASE}${msg.fileUrl}`; // ✅ FIX URL PREFIX

    const bubbleColor =
      msg.senderRole === "patient"
        ? "bg-emerald-700 text-white"
        : "bg-gray-200 text-black";

    return (
      <div className={`inline-block p-2 rounded-lg max-w-xs ${bubbleColor}`}>
        {isImage && (
          <img
            src={fileUrl}
            alt="uploaded"
            className="rounded-lg max-h-64 cursor-pointer"
          />
        )}

        {isPdf && (
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 p-2 bg-white text-black rounded"
          >
            <span className="text-red-600 text-xl">📄</span>
            <span>PDF Document</span>
          </a>
        )}

        {!isImage && !isPdf && (
          <a href={fileUrl} target="_blank" rel="noopener noreferrer">
            📎 File
          </a>
        )}
      </div>
    );
  };

  /* ---------------------------------------------------------
     UI
  --------------------------------------------------------- */
  return (
    <section className="max-w-7xl mx-auto px-6 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT DOCTOR LIST */}
        <aside className="lg:col-span-1">
          <div className="bg-beige p-4 rounded-lg mb-4">
            <h4 className="font-semibold">Your Doctors</h4>
            <p className="text-xs text-text-secondary">Message your providers</p>
          </div>

          {doctors.map((d) => (
            <div
              key={d._id}
              onClick={() => setActiveDoctorId(d._id)}
              className={`p-4 border rounded-lg cursor-pointer mb-3 ${
                activeDoctorId === d._id
                  ? "bg-emerald-50 border-emerald-600"
                  : "bg-white"
              }`}
            >
              <div className="font-semibold">{d.fullName}</div>
              <div className="text-xs text-text-secondary">
                {d.specialization}
              </div>
            </div>
          ))}
        </aside>

        {/* RIGHT CHAT WINDOW */}
        <div className="lg:col-span-2 bg-beige p-6 rounded-lg">
          {!activeDoctor ? (
            <p>Select a doctor to start chatting.</p>
          ) : (
            <>
              <div className="mb-3">
                <h3 className="font-semibold text-lg">{activeDoctor.fullName}</h3>
                {isDoctorTyping && (
                  <p className="text-xs text-emerald-600">Typing...</p>
                )}
              </div>

              {/* CHAT BOX */}
              <div
                ref={chatBoxRef}
                className="h-96 bg-white border rounded p-4 overflow-auto mb-4"
              >
                {messages.map((m) => (
                  <div
                    key={m._id || m.id}
                    className={`mb-4 ${
                      m.senderRole === "patient" ? "text-right" : ""
                    }`}
                  >
                    {m.fileUrl ? (
                      renderFileBubble(m)
                    ) : (
                      <div
                        className={`inline-block p-3 rounded ${
                          m.senderRole === "patient"
                            ? "bg-emerald-700 text-white"
                            : "bg-gray-200 text-black"
                        }`}
                      >
                        {m.text}
                      </div>
                    )}

                    <div className="text-xs text-text-secondary mt-1">
                      {new Date(m.createdAt).toLocaleTimeString()}
                    </div>
                  </div>
                ))}
              </div>

              {/* INPUT BAR */}
              <div className="flex gap-3 items-center">
                <button
                  onClick={() => fileInputRef.current.click()}
                  className="px-3 py-2 bg-gray-200 rounded text-xl"
                >
                  📎
                </button>

                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={(e) => handleFileSend(e.target.files[0])}
                />

                <input
                  className="flex-1 border rounded px-3 py-2"
                  placeholder="Type a message..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={handleTyping}
                />

                <button
                  onClick={handleSend}
                  className="px-4 py-2 bg-emerald-700 text-white rounded"
                >
                  Send
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default Messages;

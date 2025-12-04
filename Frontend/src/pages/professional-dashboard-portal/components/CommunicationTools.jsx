import React, { useEffect, useState, useRef } from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import useAuth from "../../../hooks/useAuth";
import { io } from "socket.io-client";

const API_BASE = "http://localhost:9000";
const socket = io(API_BASE);

const CommunicationTools = () => {
  const { user } = useAuth(); // doctor

  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loadingConvos, setLoadingConvos] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [error, setError] = useState("");
  const [isPatientTyping, setIsPatientTyping] = useState(false);

  const chatBoxRef = useRef(null);
  const fileInputRef = useRef(null);

  /* -------------------------------------------------------
     SOCKET INITIALIZATION
  ------------------------------------------------------- */
  useEffect(() => {
    socket.emit("user-online", { userId: user.id, role: "doctor" });

    socket.on("receive-message", (msg) => {
      if (
        selectedConversation &&
        msg.patientId === selectedConversation.patientId &&
        msg.doctorId === user.id
      ) {
        setMessages((prev) => [...prev, msg]);
        scrollToBottom();
      }
    });

    socket.on("typing", () => {
      setIsPatientTyping(true);
      setTimeout(() => setIsPatientTyping(false), 1500);
    });

    return () => {
      socket.off("receive-message");
      socket.off("typing");
    };
  }, [selectedConversation]);

  /* -------------------------------------------------------
     AUTO SCROLL
  ------------------------------------------------------- */
  const scrollToBottom = () => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  };

  /* -------------------------------------------------------
     1) FETCH DOCTOR’S PATIENTS + CONVERSATIONS (MERGED)
  ------------------------------------------------------- */
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoadingConvos(true);
        const token = localStorage.getItem("authToken");

        const patientsRes = await fetch(
          `${API_BASE}/api/chat/doctor/all-patients`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const allPatients = await patientsRes.json();

        const convosRes = await fetch(
          `${API_BASE}/api/chat/doctor/me/conversations`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const doctorConvos = await convosRes.json();

        const merged = allPatients.map((p) => {
          const existingConvo = doctorConvos.find((c) => c.patientId === p.id);

          return existingConvo
            ? existingConvo
            : {
                id: `new-${p.id}`,
                patientId: p.id,
                patient: p,
                lastMessage: "",
                timestamp: null,
                unread: 0,
              };
        });

        setConversations(merged);
      } catch (err) {
        console.error(err);
        setError("Unable to load patient list.");
      } finally {
        setLoadingConvos(false);
      }
    };

    fetchConversations();
  }, []);

  /* -------------------------------------------------------
     2) LOAD CHAT MESSAGES WHEN A PATIENT IS SELECTED
  ------------------------------------------------------- */
  useEffect(() => {
    if (!selectedConversation) return;

    const fetchMessages = async () => {
      try {
        setLoadingMessages(true);
        const token = localStorage.getItem("authToken");

        const res = await fetch(
          `${API_BASE}/api/chat/thread?patientId=${selectedConversation.patientId}&doctorId=${user.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!res.ok) throw new Error("Failed to load messages");

        const data = await res.json();
        setMessages(data);
        setTimeout(scrollToBottom, 100);
      } catch (err) {
        console.error(err);
        setError("Unable to load messages.");
      } finally {
        setLoadingMessages(false);
      }
    };

    fetchMessages();
  }, [selectedConversation]);

  /* -------------------------------------------------------
     3) SELECT CONVERSATION
  ------------------------------------------------------- */
  const handleSelectConversation = (conv) => {
    setSelectedConversation(conv);
  };

  /* -------------------------------------------------------
     4) SEND TEXT MESSAGE (Doctor → Patient)
  ------------------------------------------------------- */
  const handleSend = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const patientId = selectedConversation.patientId;

    const optimisticMessage = {
      id: "tmp-" + Date.now(),
      doctorId: user.id,
      patientId,
      senderRole: "doctor",
      text: newMessage,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, optimisticMessage]);
    scrollToBottom();
    setNewMessage("");

    socket.emit("send-message", {
      ...optimisticMessage,
      receiverId: patientId,
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
          patientId,
          doctorId: user.id,
          text: optimisticMessage.text,
        }),
      });

      if (!res.ok) throw new Error("Failed to send message");

      const saved = await res.json();

      setMessages((prev) =>
        prev.map((m) => (m.id === optimisticMessage.id ? saved : m))
      );
      scrollToBottom();
    } catch (err) {
      console.error(err);
      setError("Message failed");
      setMessages((prev) =>
        prev.filter((m) => m.id !== optimisticMessage.id)
      );
    }
  };

  /* -------------------------------------------------------
     5) SEND FILE (Doctor → Patient)
  ------------------------------------------------------- */
  const handleFileSend = async (file) => {
    if (!file || !selectedConversation) return;

    const patientId = selectedConversation.patientId;
    const tempUrl = URL.createObjectURL(file);

    const optimisticMessage = {
      id: "tmp-file-" + Date.now(),
      doctorId: user.id,
      patientId,
      senderRole: "doctor",
      fileUrl: tempUrl,
      fileType: file.type,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, optimisticMessage]);
    scrollToBottom();

    const formData = new FormData();
    formData.append("file", file);
    formData.append("patientId", patientId);
    formData.append("doctorId", user.id);

    try {
      const token = localStorage.getItem("authToken");

      const res = await fetch(`${API_BASE}/api/chat/send-file`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to upload file");

      const saved = await res.json();

      setMessages((prev) =>
        prev.map((m) => (m.id === optimisticMessage.id ? saved : m))
      );
      scrollToBottom();

      socket.emit("send-message", {
        ...saved,
        receiverId: patientId,
      });
    } catch (err) {
      console.error("File send failed", err);
      setMessages((prev) =>
        prev.filter((m) => m.id !== optimisticMessage.id)
      );
    }
  };

  /* -------------------------------------------------------
     6) TYPING INDICATOR (Doctor typing → notify patient)
  ------------------------------------------------------- */
  const handleTyping = () => {
    if (selectedConversation)
      socket.emit("typing", {
        receiverId: selectedConversation.patientId,
      });
  };

  /* -------------------------------------------------------
     7) RENDER FILE BUBBLE (Professional UI)
  ------------------------------------------------------- */
  /* -------------------------------------------------------
   7) RENDER FILE BUBBLE (Professional UI)
------------------------------------------------------- */
const renderFileBubble = (msg) => {
  const isImage = msg.fileType?.startsWith("image/");
  const isPdf = msg.fileType === "application/pdf";

  // FIX: Ensure file URL starts with backend origin
  const fileUrl = msg.fileUrl.startsWith("blob:")
    ? msg.fileUrl
    : `${API_BASE}${msg.fileUrl}`;

  const isDoctor = msg.senderRole === "doctor";

  const wrapperAlign = isDoctor ? "justify-end" : "justify-start";
  const bubbleColor = isDoctor
    ? "bg-emerald-600 text-white"
    : "bg-slate-100 text-slate-900";

  const fileName =
    msg.fileUrl?.split("/").pop()?.replace(/^\d+-/, "") || "Attachment";

  return (
    <div className={`flex ${wrapperAlign}`}>
      <div
        className={`px-3 py-2 rounded-2xl shadow-sm max-w-xs ${bubbleColor}`}
      >
        {isImage && (
          <img
            src={fileUrl}
            alt="attachment"
            className="rounded-xl max-h-48 mb-1 object-cover"
          />
        )}

        {isPdf && (
          <a
            href={fileUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 p-2 rounded-xl bg-white text-slate-900"
          >
            <span className="text-red-600 text-xl">📄</span>
            <div className="flex flex-col">
              <span className="text-sm font-semibold truncate max-w-[140px]">
                {fileName}
              </span>
              <span className="text-[10px] text-slate-500">
                Tap to view / download
              </span>
            </div>
          </a>
        )}

        {!isImage && !isPdf && (
          <a
            href={fileUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2"
          >
            <span className="text-lg">📎</span>
            <span className="text-sm underline truncate max-w-[160px]">
              {fileName}
            </span>
          </a>
        )}

        <div className="text-[10px] opacity-70 mt-1 text-right">
          {new Date(msg.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </div>
  );
};


  /* -------------------------------------------------------
     8) HELPERS / FILTERS
  ------------------------------------------------------- */
  const filteredConversations = conversations.filter((c) =>
    c.patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTimestamp = (t) =>
    t
      ? new Date(t).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "";

  /* -------------------------------------------------------
     UI
  ------------------------------------------------------- */
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-semibold text-primary">
            Communication Tools
          </h2>
          <p className="text-text-secondary">
            Secure messaging with your patients
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT PANEL */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-lg border border-border organic-shadow">
            <div className="p-4 border-b border-border">
              <h3 className="text-lg font-semibold">Patients</h3>
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="max-h-96 overflow-y-auto divide-y divide-border">
              {filteredConversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => handleSelectConversation(conv)}
                  className={`p-4 cursor-pointer ${
                    selectedConversation?.id === conv.id ? "bg-muted/40" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={conv.patient.avatar}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <p className="font-medium">{conv.patient.name}</p>
                      </div>
                      <p className="text-xs text-text-secondary truncate">
                        {conv.lastMessage || "No messages yet"}
                      </p>
                      <p className="text-[10px] text-text-secondary">
                        {formatTimestamp(conv.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {filteredConversations.length === 0 && (
                <p className="p-3 text-sm text-text-secondary">
                  No patients found.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="lg:col-span-2 bg-card rounded-lg border border-border organic-shadow h-96 flex flex-col">
          {!selectedConversation ? (
            <div className="flex-1 flex justify-center items-center">
              <p>Select a patient to start chatting</p>
            </div>
          ) : (
            <>
              {/* HEADER */}
              <div className="p-4 border-b flex items-center gap-3">
                <img
                  src={selectedConversation.patient.avatar}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold">
                    {selectedConversation.patient.name}
                  </p>
                  {isPatientTyping && (
                    <p className="text-xs text-emerald-600">Typing...</p>
                  )}
                </div>
              </div>

              {/* MESSAGES */}
              <div
                ref={chatBoxRef}
                className="flex-1 p-4 overflow-y-auto space-y-3"
              >
                {messages.map((msg) => {
                  const isDoctor = msg.senderRole === "doctor";
                  const align = isDoctor ? "justify-end" : "justify-start";

                  // If it's a file message
                  if (msg.fileUrl) {
                    return (
                      <div key={msg._id || msg.id} className={align}>
                        {renderFileBubble(msg)}
                      </div>
                    );
                  }

                  // Text message bubble
                  return (
                    <div
                      key={msg._id || msg.id}
                      className={`flex ${align}`}
                    >
                      <div
                        className={`px-4 py-2 rounded-2xl max-w-md shadow-sm ${
                          isDoctor
                            ? "bg-emerald-600 text-white"
                            : "bg-slate-100 text-slate-900"
                        }`}
                      >
                        <p className="text-sm">{msg.text}</p>
                        <p className="text-[10px] opacity-70 mt-1 text-right">
                          {formatTimestamp(msg.createdAt)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* INPUT BAR */}
              <div className="p-4 border-t flex items-center gap-2">
                {/* Attachment button */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 rounded-full border border-border hover:bg-muted transition"
                  title="Attach file"
                >
                  <span className="text-lg">📎</span>
                </button>

                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={(e) => handleFileSend(e.target.files[0])}
                />

                <Input
                  className="flex-1"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleTyping}
                />
                <Button onClick={handleSend} iconName="Send">
                  Send
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommunicationTools;

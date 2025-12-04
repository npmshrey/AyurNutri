import React, { useEffect, useState, useRef } from "react";
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
  const [isPatientTyping, setIsPatientTyping] = useState(false);

  const chatBoxRef = useRef(null);
  const fileInputRef = useRef(null);

  // ⭐ context menu
  const [contextMenu, setContextMenu] = useState(null);

  // SOCKET INIT
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

  // AUTO SCROLL
  const scrollToBottom = () => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  };

  // FETCH PATIENTS + CONVERSATIONS
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
      } finally {
        setLoadingConvos(false);
      }
    };

    fetchConversations();
  }, []);

  // LOAD THREAD
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

        const data = await res.json();
        setMessages(data);
        setTimeout(scrollToBottom, 100);
      } finally {
        setLoadingMessages(false);
      }
    };

    fetchMessages();
  }, [selectedConversation]);

  // SELECT CONVERSATION
  const handleSelectConversation = (conv) => {
    setSelectedConversation(conv);
  };

  // SEND TEXT
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

      const saved = await res.json();

      setMessages((prev) =>
        prev.map((m) => (m.id === optimisticMessage.id ? saved : m))
      );
    } catch {}
  };

  // SEND FILE
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
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const saved = await res.json();

      setMessages((prev) =>
        prev.map((m) => (m.id === optimisticMessage.id ? saved : m))
      );

      socket.emit("send-message", {
        ...saved,
        receiverId: patientId,
      });
    } catch {}
  };

  // DELETE FOR ME
  const deleteForMe = async (msgId) => {
    try {
      const token = localStorage.getItem("authToken");

      await fetch(`${API_BASE}/api/chat/delete-for-me/${msgId}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessages((prev) =>
        prev.filter((m) => (m._id || m.id) !== msgId)
      );
    } catch (err) {}
  };

  // DELETE FOR EVERYONE
  const deleteForEveryone = async (msgId) => {
    try {
      const token = localStorage.getItem("authToken");

      await fetch(`${API_BASE}/api/chat/delete-for-everyone/${msgId}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessages((prev) =>
        prev.map((m) =>
          (m._id || m.id) === msgId
            ? { ...m, text: "🚫 Message deleted", fileUrl: null, fileType: null }
            : m
        )
      );
    } catch (err) {}
  };

  // FILE BUBBLE
  const renderFileBubble = (msg) => {
    const isImage = msg.fileType?.startsWith("image/");
    const isPdf = msg.fileType === "application/pdf";
    const fileUrl = msg.fileUrl.startsWith("blob:")
      ? msg.fileUrl
      : `${API_BASE}${msg.fileUrl}`;

    return (
      <div className="px-3 py-2 rounded-2xl shadow-sm bg-emerald-600 text-white max-w-xs">
        {isImage && (
          <img src={fileUrl} className="rounded-xl max-h-48 mb-1" />
        )}

        {isPdf && (
          <a href={fileUrl} target="_blank">
            📄 PDF Document
          </a>
        )}

        <div className="text-[10px] opacity-70 mt-1 text-right">
          {new Date(msg.createdAt).toLocaleTimeString()}
        </div>
      </div>
    );
  };

  // FILTER CONVERSATIONS
  const filteredConversations = conversations.filter((c) =>
    c.patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTimestamp = (t) =>
    t
      ? new Date(t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      : "";

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT PANEL */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-lg border h-96 overflow-y-auto">
            <div className="p-4 border-b">
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {filteredConversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => handleSelectConversation(conv)}
                className={`p-4 cursor-pointer ${
                  selectedConversation?.id === conv.id ? "bg-gray-100" : ""
                }`}
              >
                <p className="font-medium">{conv.patient.name}</p>
                <p className="text-xs">{conv.lastMessage}</p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="lg:col-span-2 bg-card rounded-lg border h-96 flex flex-col">
          {!selectedConversation ? (
            <div className="flex-1 flex justify-center items-center">
              Select a patient to chat
            </div>
          ) : (
            <>
              {/* HEADER */}
              <div className="p-4 border-b flex items-center gap-3">
                <p className="font-semibold">
                  {selectedConversation.patient.name}
                </p>
                {isPatientTyping && (
                  <p className="text-xs text-emerald-600">Typing...</p>
                )}
              </div>

              {/* CHAT MESSAGES */}
              <div
                ref={chatBoxRef}
                className="flex-1 p-4 overflow-y-auto space-y-3"
              >
                {messages.map((msg) => {
                  const isDoctor = msg.senderRole === "doctor";
                  const align = isDoctor ? "justify-end" : "justify-start";
                  const msgId = msg._id || msg.id;

                  return (
                    <div
                      key={msgId}
                      className={`flex ${align}`}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        setContextMenu({
                          x: e.clientX,
                          y: e.clientY,
                          msg,
                        });
                      }}
                    >
                      {msg.fileUrl
                        ? renderFileBubble(msg)
                        : (
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
                        )}
                    </div>
                  );
                })}
              </div>

              {/* INPUT BAR */}
              <div className="p-4 border-t flex gap-2">
                <button
                  onClick={() => fileInputRef.current.click()}
                  className="p-2 border rounded-lg"
                >
                  📎
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={(e) => handleFileSend(e.target.files[0])}
                />

                <Input
                  className="flex-1"
                  placeholder="Type message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={() =>
                    socket.emit("typing", {
                      receiverId: selectedConversation.patientId,
                    })
                  }
                />

                <Button onClick={handleSend}>Send</Button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ⭐ CONTEXT MENU */}
      {contextMenu && (
        <div
          className="fixed bg-white border rounded-lg shadow-lg z-50"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <button
            className="px-4 py-2 w-full text-left hover:bg-gray-100"
            onClick={() => {
              deleteForMe(contextMenu.msg._id || contextMenu.msg.id);
              setContextMenu(null);
            }}
          >
            🗑 Delete for Me
          </button>

          {contextMenu.msg.senderRole === "doctor" && (
            <button
              className="px-4 py-2 w-full text-left text-red-600 hover:bg-gray-100"
              onClick={() => {
                deleteForEveryone(contextMenu.msg._id || contextMenu.msg.id);
                setContextMenu(null);
              }}
            >
              ❌ Delete for Everyone
            </button>
          )}
        </div>
      )}

      {/* click outside to close */}
      {contextMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setContextMenu(null)}
        ></div>
      )}
    </div>
  );
};

export default CommunicationTools;

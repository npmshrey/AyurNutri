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

  /* -------------------------------------------------------
     SOCKET INITIALIZATION
  ------------------------------------------------------- */
  useEffect(() => {
    socket.emit("user-online", { userId: user.id, role: "doctor" });

    // Receive real-time message
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

    // Typing indicator
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
     4) SEND MESSAGE (Doctor → Patient)
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

    // SEND REAL-TIME MESSAGE
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
     5) TYPING INDICATOR (Doctor typing → notify patient)
  ------------------------------------------------------- */
  const handleTyping = () => {
    if (selectedConversation)
      socket.emit("typing", {
        receiverId: selectedConversation.patientId,
      });
  };


  /* -------------------------------------------------------
     6) UI
  ------------------------------------------------------- */
  const filteredConversations = conversations.filter((c) =>
    c.patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTimestamp = (t) =>
    t ? new Date(t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-semibold text-primary">
            Communication Tools
          </h2>
          <p className="text-text-secondary">Secure messaging & coordination</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT PANEL */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-lg border border-border organic-shadow">
            <div className="p-4 border-b border-border">
              <h3 className="text-lg font-semibold">Messages</h3>
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
                  <div className="flex items-start space-x-3">
                    <img
                      src={conv.patient.avatar}
                      className="w-10 h-10 rounded-full"
                    />

                    <div className="flex-1">
                      <p className="font-medium">{conv.patient.name}</p>
                      <p className="text-sm text-text-secondary truncate">
                        {conv.lastMessage}
                      </p>
                      <p className="text-xs text-text-secondary">
                        {formatTimestamp(conv.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
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
              <div className="p-4 border-b flex gap-3">
                <img
                  src={selectedConversation.patient.avatar}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="font-semibold">{selectedConversation.patient.name}</p>
                  {isPatientTyping && (
                    <p className="text-xs text-emerald-600">Typing...</p>
                  )}
                </div>
              </div>

              {/* MESSAGES */}
              <div ref={chatBoxRef} className="flex-1 p-4 overflow-y-auto space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg._id || msg.id}
                    className={`flex ${
                      msg.senderRole === "doctor" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`px-4 py-2 rounded-lg max-w-md ${
                        msg.senderRole === "doctor" ? "bg-primary text-white" : "bg-muted"
                      }`}
                    >
                      <p>{msg.text}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {formatTimestamp(msg.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* INPUT */}
              <div className="p-4 border-t flex gap-2">
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

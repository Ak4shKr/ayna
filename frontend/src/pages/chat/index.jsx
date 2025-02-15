import { useState, useEffect, useRef } from "react";
import { Send, Bot, LogOut, Trash2 } from "lucide-react";
import io from "socket.io-client";
import { Loader, Text, Tooltip } from "@mantine/core";
import { modals } from "@mantine/modals";
import { logoutUser, deleteChatHistory, fetchMessages } from "./hook";

// Socket setup
const socket = io("https://ayna.onrender.com/");

const Chat = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user?.id || null;
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    fetchMessages(setMessages, setLoading);
    socket.on("message", (msg) => {
      setMessages((prevMessages) => {
        const newMessages = prevMessages.filter((m) => !m.isPending);
        return [...newMessages, msg];
      });
    });

    return () => {
      socket.off("message");
    };
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();

    if (message.trim()) {
      const msg = {
        text: message,
        senderId: userId,
        sender: "user",
        isPending: true,
      };

      setMessages((prevMessages) => [...prevMessages, msg]);
      socket.emit("message", msg);
      setMessage("");
    }
  };

  const handleLogout = () => {
    openModal({
      title: "Logout",
      message:
        "Are you sure you want to logout? You will be redirected to the login.",
      action: logoutUser,
    });
  };
  const handleDelete = () => {
    openModal({
      title: "Delete Chat",
      message:
        "Are you sure you want to delete your chat History? This action is irreversible.",
      action: () => deleteChatHistory(setMessages),
    });
  };

  const openModal = ({ title, message, action }) => {
    modals.openConfirmModal({
      title: title,
      centered: true,
      children: <Text size="sm">{message}</Text>,
      labels: { confirm: title, cancel: "No don't leave it" },
      confirmProps: { color: "#F0185C" },
      onCancel: () => console.log("Cancel"),
      onConfirm: () => {
        action();
      },
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <Loader color="blue" type="bars" size="xs" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100">
      <div className="flex-1 flex flex-col h-full">
        <div className="px-4 py-2 border-b border-gray-700 bg-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                <Bot className="h-6 w-6" />
              </div>
              <div>
                <h2 className="font-semibold">Ur Assistant</h2>
                <p className="text-sm text-gray-400">Online</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Tooltip
                label="Delete Chat"
                position="top-start"
                color="dark"
                withArrow
              >
                <button
                  onClick={handleDelete}
                  className="p-2 hover:bg-gray-700 rounded-lg flex items-center gap-2 text-gray-400 hover:text-white"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </Tooltip>
              <Tooltip
                label="Logout"
                position="top-start"
                color="dark"
                withArrow
              >
                <button
                  onClick={handleLogout}
                  className="p-2 hover:bg-gray-700 rounded-lg flex items-center gap-2 text-gray-400 hover:text-white"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </Tooltip>
            </div>
          </div>
        </div>
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg._id}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[70%] rounded-lg px-3 py-2 break-words ${
                  msg.sender === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 text-gray-100"
                } ${msg.isPending ? "opacity-50" : ""}`}
              >
                <p>{msg.text}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form
          onSubmit={sendMessage}
          className="px-4 py-2 border-t border-gray-700 bg-gray-800"
        >
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 bg-gray-700 rounded-lg py-2 px-4 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={!message.trim()}
              className="bg-blue-600 hover:bg-blue-700 rounded-lg px-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chat;

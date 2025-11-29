"use client";

import { useEffect, useState, useRef } from "react";
import Pusher from "pusher-js";
import { useUser } from "@clerk/nextjs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Loader2, MoreVertical } from "lucide-react";
import { Chats } from "@/components/types/chats";
import axios from "axios";
import Link from "next/link";


export default function Discussion() {
  const { user, isLoaded } = useUser();
  const [messages, setMessages] = useState<Chats[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  
  // Scroll refs - FIXED: Using proper scroll container
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const userId = user?.id;
  const username = user?.fullName || user?.username || user?.primaryEmailAddress?.emailAddress || "User";

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name.split(" ").map((n) => n).join("").toUpperCase().slice(0, 2);
  };

  // Format time
  const formatTime = (timestamp?: string) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  };

  // FIXED: Better scroll to bottom function
  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      // Use scrollTop for immediate and reliable scrolling
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  };

  // Fetch messages
  useEffect(() => {
  const fetchMessages = async () => {
    try {
      const res = await axios.get("/api/chat/get");

      // Axios auto-parses JSON → no res.json()
      const data = res.data;

      setMessages(data.messages || []);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  };

  fetchMessages();
}, []);


  // FIXED: Scroll on messages change - runs AFTER DOM updates
  useEffect(() => {
    // Small timeout ensures DOM is fully rendered
    const timer = setTimeout(() => {
      scrollToBottom();
    }, 100);
    return () => clearTimeout(timer);
  }, [messages]);

  // Setup Pusher
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_PUSHER_KEY || !process.env.NEXT_PUBLIC_PUSHER_CLUSTER) {
      console.error("Missing Pusher env vars");
      return;
    }

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
    });

    const channel = pusher.subscribe("community");

    channel.bind("new-message", (data: Chats) => {
      setMessages((prev) => {
        if (prev.some((m) => m.messageId === data.messageId)) return prev;
        return [...prev, data];
      });
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      pusher.disconnect();
    };
  }, []);

  // Send message
  const sendMessage = async () => {
  if (!newMessage.trim() || !user || isSending) return;

  setIsSending(true);
  const messageText = newMessage;
  setNewMessage("");

  try {
    await axios.post("/api/chat", {
      userId,
      username,
      message: messageText,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Failed to send:", error);
    setNewMessage(messageText); // put message back in input
  } finally {
    setIsSending(false);
  }
};


  if (!isLoaded) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-emerald-600" />
          <p className="text-gray-600 font-medium">Loading chat...</p>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-4">
        <Card className="p-8 max-w-md w-full text-center shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <div className="text-7xl mb-6">💬</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Join the Community</h2>
          <p className="text-gray-600 mb-6">Sign in to start chatting with farmers and buyers</p>
          <Link href={'/sign-in'} className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-3 px-6 rounded-full ">
            Sign In to Continue
          </Link>
        </Card>
      </main>
    );
  }

  return (
    <main className="h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl h-[90vh] flex flex-col">
        {/* REDESIGNED CHAT CONTAINER */}
        <Card className="flex-1 flex flex-col shadow-2xl border-0 bg-white/95 backdrop-blur-md overflow-hidden">
          
          {/* MODERN HEADER */}
          <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 px-6 py-4 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl">
                  🌾
                </div>
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-white"></span>
              </div>
              <div>
                <h1 className="text-white font-bold text-xl">Community Chat</h1>
                <p className="text-emerald-100 text-sm">Connect with farmers & buyers</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>

          {/* FIXED MESSAGES AREA WITH PROPER SCROLL */}
          <div
            ref={scrollContainerRef}
            className="flex-1 overflow-y-auto bg-[#f0f2f5] px-6 py-4 space-y-3"
            style={{
              scrollBehavior: "smooth",
              overflowAnchor: "none"
            }}
          >
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center mb-4">
                  <span className="text-5xl">💭</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No messages yet</h3>
                <p className="text-gray-500">Be the first to start the conversation!</p>
              </div>
            ) : (
              <>
                {messages.map((msg, index) => {
                  const isOwn = msg.userId === userId;
                  const showAvatar = index === 0 || messages[index - 1].userId !== msg.userId;
                  const showName = !isOwn && showAvatar;

                  return (
                    <div
                      key={msg.messageId}
                      className={`flex items-end gap-2 ${isOwn ? "flex-row-reverse" : "flex-row"} ${
                        showAvatar ? "mt-4" : "mt-1"
                      }`}
                    >
                      {/* Avatar */}
                      {showAvatar && !isOwn ? (
                        <Avatar className="h-9 w-9 ring-2 ring-white shadow-md">
                          <AvatarImage  />
                          <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-500 text-white text-xs font-semibold">
                            {getInitials(msg.username)}
                          </AvatarFallback>
                        </Avatar>
                      ) : !isOwn ? (
                        <div className="h-9 w-9" />
                      ) : null}

                      {/* Message */}
                      <div className={`flex flex-col max-w-[70%] ${isOwn ? "items-end" : "items-start"}`}>
                        {showName && (
                          <span className="text-xs font-semibold text-gray-600 mb-1 px-3">
                            {msg.username}
                          </span>
                        )}
                        <div
                          className={`px-4 py-2.5 rounded-2xl shadow-md transition-all hover:shadow-lg ${
                            isOwn
                              ? "bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-br-sm"
                              : "bg-white text-gray-800 rounded-bl-sm"
                          }`}
                        >
                          <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">
                            {msg.message}
                          </p>
                        </div>
                        <span className="text-[10px] text-gray-500 mt-1 px-3">
                          {formatTime(msg.timestamp)}
                        </span>
                      </div>
                    </div>
                  );
                })}
                {/* Scroll anchor */}
                <div ref={bottomRef} />
              </>
            )}
          </div>

          {/* MODERN INPUT AREA */}
          <div className="bg-white border-t border-gray-200 px-4 py-3">
            <div className="flex items-center gap-3">
              {/* Input */}
              <div className="flex-1 relative">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  placeholder="Type a message..."
                  disabled={isSending}
                  className="w-full bg-gray-100 border-0 focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-full px-6 py-3 h-12 text-sm placeholder:text-gray-500"
                />
              </div>

              {/* Send Button */}
              <Button
                onClick={sendMessage}
                disabled={!newMessage.trim() || isSending}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-full h-12 w-12 p-0 shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
              >
                {isSending ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
}

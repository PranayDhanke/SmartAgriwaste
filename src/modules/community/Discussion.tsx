"use client";

import React, { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useUser } from "@clerk/nextjs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Loader2, WifiOff, Wifi } from "lucide-react";
import { Chats } from "@/components/types/chats";
import Link from "next/link";
import { toast } from "sonner";

const SOCKET_URL = "https://smartagriwastesocketserver.onrender.com/"; // replace with your server URL

export default function Discussion() {
  const { user, isLoaded } = useUser();
  const [messages, setMessages] = useState<Chats[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [loading, setLoading] = useState(true); // initial loading for history
  const [isConnected, setIsConnected] = useState(false);
  const [reconnects, setReconnects] = useState(0);

  const socketRef = useRef<Socket | null>(null);
  const scrollAnchorRef = useRef<HTMLDivElement | null>(null);
  const mountedRef = useRef(true);

  const userId = user?.id ?? "";
  const username =
    user?.fullName ||
    user?.username ||
    user?.primaryEmailAddress?.emailAddress ||
    "User";

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Connect socket once Clerk user loader is ready. We guard so we only attempt once.
  useEffect(() => {
    // wait until Clerk has loaded (not necessarily authenticated)
    if (!isLoaded) return;

    setLoading(true);

    const socket = io(SOCKET_URL, {
      transports: ["websocket"],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;

    const onConnect = () => {
      setIsConnected(true);
      setReconnects(0);
      // ask server for the room history
      socket.emit("join-room");
    };
    const onDisconnect = () => {
      setIsConnected(false);
      // show a small toast only if mounted so we don't spam on unmount
      if (mountedRef.current) toast.error("Disconnected from chat.");
    };

    const onReconnectAttempt = (attempt: number) => {
      setReconnects(attempt);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("reconnect_attempt", onReconnectAttempt);

    socket.on("history", (history: Chats[]) => {
      if (!mountedRef.current) return;
      if (Array.isArray(history)) {
        setMessages(history.map(normalizeServerMessage));
        // scroll after DOM update
        setTimeout(() => scrollToBottom(true), 60);
      }
      setLoading(false);
    });

    socket.on("receive-message", (msg: Chats) => {
      if (!mountedRef.current) return;
      setMessages((prev) => [...prev, normalizeServerMessage(msg)]);
      setTimeout(() => scrollToBottom(), 40);
    });

    socket.on("history-error", () => {
      console.error("History load failed");
      if (mountedRef.current) {
        setLoading(false);
        toast.error("Failed to load chat history.");
      }
    });

    socket.on("send-error", () => {
      console.error("Send failed");
      if (mountedRef.current) toast.error("Message failed to send.");
    });

    socket.on("connect_error", () => {
      console.error("connect_error");
      if (mountedRef.current) toast.error("Unable to connect to chat server.");
    });

    return () => {
      try {
        socket.off();
        socket.disconnect();
      } catch {
        // ignore
      }
      socketRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]);

  // helper to normalize message shape from server -> Chats
  function normalizeServerMessage(msg: Chats): Chats {
    return {
      _id: msg._id ?? String(Math.random()),
      message: msg.message ?? "",
      username: msg.username ?? "User",
      userId: msg.userId ?? null,
      createdAt: msg.createdAt ?? new Date().toISOString(),
    } as Chats;
  }

  function scrollToBottom(immediate = false) {
    if (scrollAnchorRef.current) {
      scrollAnchorRef.current.scrollIntoView({
        behavior: immediate ? "auto" : "smooth",
        block: "end",
      });
    }
  }

  // Send message
  const sendMessage = async () => {
    if (!newMessage.trim() || isSending) return;

    if (!isConnected) {
      toast.error("You're offline. Message won't send.");
      return;
    }

    setIsSending(true);
    const messageText = newMessage.trim();
    setNewMessage("");

    const payload = {
      message: messageText,
      username: username,
      userid: userId,
    };

    try {
      // optimistic UI: push a temporary message to show immediate feedback
      const tempMessage: Chats = {
        _id: `temp-${Date.now()}`,
        message: messageText,
        username: username,
        userId: userId,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, tempMessage]);
      scrollToBottom();

      socketRef.current?.emit(
        "send-message",
        payload,
        (ack: { saved: Chats }) => {
          // optional ack handling (server may send back saved message)
          if (ack && ack.saved) {
            // replace temp message with official one when server contains _id
            setMessages((prev) => {
              const withoutTemp = prev.filter(
                (m) => !m._id?.toString().startsWith("temp-")
              );
              return [...withoutTemp, normalizeServerMessage(ack.saved)];
            });
          }
        }
      );
    } catch (err) {
      console.error("emit error", err);
      toast.error("Failed to send message.");
    } finally {
      setTimeout(() => setIsSending(false), 150);
    }
  };

  // small helper to format time
  const formatTime = () => {
    try {
      return new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "--:--";
    }
  };

  return (
    <main className="h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl h-[90vh] flex flex-col">
        <Card className="flex-1 flex flex-col shadow-2xl border-0 bg-white/95 backdrop-blur-md overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 px-6 py-3 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl">
                  🌾
                </div>
                <span
                  className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${
                    isConnected ? "bg-green-400" : "bg-yellow-400"
                  }`}
                ></span>
              </div>
              <div>
                <h1 className="text-white font-bold text-xl">Community Chat</h1>
                <p className="text-emerald-100 text-sm flex items-center gap-2">
                  {isConnected ? (
                    <span className="inline-flex items-center gap-2">
                      <Wifi className="h-4 w-4" /> Connected
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2">
                      <WifiOff className="h-4 w-4" /> Offline{" "}
                      {reconnects ? ` (trying ${reconnects})` : ""}
                    </span>
                  )}
                </p>
              </div>
            </div>
            <div className="">
              <div className="text-white text-sm mr-2">
                {user ? `Signed in as ${username}` : "Guest"}
              </div>
            </div>
          </div>

          <div
            className="flex-1 overflow-y-auto bg-[#f7faf9] px-6 py-4"
            style={{ scrollBehavior: "smooth", overflowAnchor: "none" }}
          >
            {loading ? (
              <div className="space-y-4">
                {/* simple skeleton */}
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="flex items-start gap-3 animate-pulse">
                    <div className="w-10 h-10 rounded-full bg-gray-200" />
                    <div className="flex-1">
                      <div className="h-3 w-32 bg-gray-200 rounded mb-2" />
                      <div className="h-8 bg-gray-200 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center mb-4">
                  <span className="text-5xl">💭</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No messages yet
                </h3>
                <p className="text-gray-500">
                  Be the first to start the conversation!
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {messages.map((msg, index) => {
                  const isOwn = msg.userId === userId;
                  const showAvatar =
                    index === 0 || messages[index - 1].userId !== msg.userId;
                  const showName = !isOwn && showAvatar;

                  return (
                    <div
                      key={msg._id}
                      className={`flex items-end gap-2 ${
                        isOwn ? "flex-row-reverse" : "flex-row"
                      } ${showAvatar ? "mt-4" : "mt-1"}`}
                    >
                      {showAvatar && !isOwn ? (
                        <Avatar className="h-9 w-9 ring-2 ring-white shadow-md">
                          <AvatarImage />
                          <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-500 text-white text-xs font-semibold">
                            {msg.username?.charAt(0)?.toUpperCase() ?? "U"}
                          </AvatarFallback>
                        </Avatar>
                      ) : !isOwn ? (
                        <div className="h-9 w-9" />
                      ) : null}

                      <div
                        className={`flex flex-col max-w-[70%] ${
                          isOwn ? "items-end" : "items-start"
                        }`}
                      >
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
                          {formatTime()}
                        </span>
                      </div>
                    </div>
                  );
                })}
                <div ref={scrollAnchorRef} />
              </div>
            )}
          </div>

          <div className="bg-white border-t border-gray-200 px-4 py-3">
            <div className="flex items-center gap-3">
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
                  placeholder={
                    isConnected
                      ? "Type a message..."
                      : "Can't send while offline"
                  }
                  disabled={isSending || !isConnected}
                  className="w-full bg-gray-100 border-0 focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-full px-6 py-3 h-12 text-sm placeholder:text-gray-500"
                />
              </div>

              {!user ? (
                <Link href="/sign-in">
                  <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-full h-12 px-6 shadow-lg hover:shadow-xl transition-all">
                    Sign In to Chat
                  </Button>
                </Link>
              ) : (
                <Button
                  onClick={sendMessage}
                  disabled={!newMessage.trim() || isSending || !isConnected}
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-full h-12 w-12 p-0 shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                  aria-label="send message"
                >
                  {isSending ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
}

"use client";

import { useEffect, useState } from "react";
import Pusher from "pusher-js";
import { useUser } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Chat {
  messageId: string;
  userId: string;
  username: string;
  message: string;
}

export default function Discussion() {
  const { user, isLoaded } = useUser();

  const [messages, setMessages] = useState<Chat[]>([]);
  const [newMessage, setNewMessage] = useState("");

  const userId = user?.id ;
  const username =
    user?.fullName ||
    user?.username ||
    user?.primaryEmailAddress?.emailAddress 

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch("/api/chat/get", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        setMessages(data.messages);
      } catch {
        console.log("error");
      }
    };
    fetchMessages();
  }, []);

  useEffect(() => {
    if (
      !process.env.NEXT_PUBLIC_PUSHER_KEY ||
      !process.env.NEXT_PUBLIC_PUSHER_CLUSTER
    ) {
      console.error("Missing Pusher env vars");
      return;
    }

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
    });

    const channel = pusher.subscribe("community");

    channel.bind("new-message", (data: Chat) => {
      setMessages((prev) => {
        if (prev.some((m) => m.messageId === data.messageId)) return prev; // prevent duplicates
        return [...prev, data];
      });
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      pusher.disconnect();
    };
  }, []);

  const sendMessage = async () => {
    if (!newMessage.trim() || !user) return;

    try {
      await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, username, message: newMessage }),
      });
      setNewMessage("");
    } catch (error) {
      console.error("Failed to send:", error);
    }
  };

  if (!isLoaded) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p>Loading chat...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Please sign in to join the chat 💬</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 px-6 py-12">
      <div className="mx-auto max-w-3xl space-y-6">
        <Card className="shadow-md border-green-200">
          <CardHeader className="flex items-center gap-2 rounded-t-lg p-4 border-b">
            <CardTitle className="text-lg font-semibold text-green-700">
              🌾 Community Chat
            </CardTitle>
          </CardHeader>

          <CardContent className="bg-white max-h-[450px] overflow-y-auto p-4 space-y-4">
            {messages.length === 0
              ? "No messages yet. Start the conversation!"
              : messages.map((msg) => (
                  <div
                    key={msg.messageId}
                    className={`flex items-end gap-2 ${
                      msg.userId === userId ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`rounded-2xl px-4 py-2 max-w-[70%] text-sm shadow-sm ${
                        msg.userId === userId
                          ? "bg-green-600 text-white rounded-br-none"
                          : "bg-gray-100 text-gray-800 rounded-bl-none"
                      }`}
                    >
                      {msg.userId !== userId && (
                        <p className="text-xs font-semibold text-green-700 mb-1">
                          {msg.username}
                        </p>
                      )}
                      <p>{msg.message}</p>
                    </div>
                  </div>
                ))}
          </CardContent>

          <div className="flex items-center gap-2 p-4 border-t">
            <Input
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              className="resize-none border-green-300 focus-visible:ring-green-500 h-12"
            />
            <Button
              onClick={sendMessage}
              className="bg-green-600 hover:bg-green-700 text-white h-12 px-6"
            >
              Send
            </Button>
          </div>
        </Card>
      </div>
    </main>
  );
}

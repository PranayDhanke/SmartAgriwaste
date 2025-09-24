"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import io, { Socket } from "socket.io-client";
import { useUser } from "@clerk/nextjs";

type Chat = {
  messageId: string;
  userId: string;
  username: string;
  message: string;
};

export default function Discussion() {
  const [comments, setComments] = useState<Chat[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const socketRef = useRef<Socket | null>(null);

  // Clerk user
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded) return;

    // boot up serverless socket handler
    fetch("/api/socket");

    // connect socket
    const socket = io({ path: "/api/socket/io" });
    socketRef.current = socket;

    // get existing chat history
    socket.on("load-messages", (msgs: Chat[]) => {
      setComments(msgs);
    });

    // listen for new messages
    socket.on("receive-msg", (data: Chat) => {
      setComments((prev) => [...prev, data]);
    });

    return () => {
      socket.disconnect();
    };
  }, [isLoaded]);

  const sendMessage = () => {
    if (!newMessage.trim() || !user) return;

    const messageObj: Chat = {
      messageId: Date.now().toString(),
      userId: user.id,
      username: user.fullName || user.username || "Anonymous",
      message: newMessage.trim(),
    };

    // send to server
    socketRef.current?.emit("send-msg", messageObj);

    // optimistic UI
    setComments((prev) => [...prev, messageObj]);

    setNewMessage("");
  };

  // auto scroll to bottom
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [comments]);

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

          <CardContent
            ref={chatContainerRef}
            className="bg-white max-h-[450px] overflow-y-auto p-4 space-y-4"
          >
            {comments.length === 0 ? (
              "No messages yet. Start the conversation!"
            ) : (
              comments.map((comment) => (
                <div
                  key={comment.messageId}
                  className={`flex items-end gap-2 ${
                    comment.userId === user.id ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`rounded-2xl px-4 py-2 max-w-[70%] text-sm shadow-sm ${
                      comment.userId === user.id
                        ? "bg-green-600 text-white rounded-br-none"
                        : "bg-gray-100 text-gray-800 rounded-bl-none"
                    }`}
                  >
                    {comment.userId !== user.id && (
                      <p className="text-xs font-semibold text-green-700 mb-1">
                        {comment.username}
                      </p>
                    )}
                    <p>{comment.message}</p>
                  </div>
                </div>
              ))
            )}
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

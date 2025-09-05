"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

type Chat = {
  messageId: string;
  username: string;
  avtar?: string;
  message: string;
  self?: boolean; // true if the current user
};

export default function Discussion() {
  const initialChats: Chat[] = [
    {
      messageId: "001",
      username: "Pranay",
      avtar: "",
      message: "Hello 👋",
      self: false,
    },
    {
      messageId: "002",
      username: "You",
      avtar: "",
      message: "Hi! How do you manage crop waste?",
      self: true,
    },
    {
      messageId: "003",
      username: "Pranay",
      avtar: "",
      message: "We make compost instead of burning 🌱",
      self: false,
    },
  ];

  const [comments, setComments] = useState<Chat[]>(initialChats);
  const [newMessage, setNewMessage] = useState("");
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [comments]);

  const handleAddComment = () => {
    if (!newMessage.trim()) return;

    const newChat: Chat = {
      messageId: Date.now().toString(),
      username: "You",
      avtar: "",
      message: newMessage.trim(),
      self: true,
    };

    setComments((prev) => [...prev, newChat]);
    setNewMessage("");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 px-6 py-12">
      <div className="mx-auto max-w-3xl space-y-6">
        {/* Chat Room Header */}
        <Card className="shadow-md border-green-200">
          <CardHeader className="flex items-center gap-2 rounded-t-lg p-4">
            <CardTitle className="text-lg ">
               Farmers' Chat Room
            </CardTitle>
          </CardHeader>



          {/* Messages */}
          <CardContent className="bg-white max-h-[450px] overflow-y-auto p-4 space-y-4">
            {comments.map((comment) => (
              <div
                key={comment.messageId}
                className={`flex items-start gap-2 ${
                  comment.self ? "justify-end" : "justify-start"
                }`}
              >
                {!comment.self && (
                  <div className="flex-shrink-0">
                    {comment.avtar ? (
                      <img
                        src={comment.avtar}
                        alt={comment.username}
                        className="h-8 w-8 rounded-full"
                      />
                    ) : (
                      <User className="h-8 w-8 text-green-600" />
                    )}
                  </div>
                )}

                <div
                  className={`rounded-2xl px-4 py-2 max-w-[70%] text-sm shadow-sm ${
                    comment.self
                      ? "bg-green-600 text-white rounded-br-none"
                      : "bg-gray-100 text-gray-800 rounded-bl-none"
                  }`}
                >
                  {!comment.self && (
                    <p className="text-xs font-semibold text-green-700 mb-1">
                      {comment.username}
                    </p>
                  )}
                  <p>{comment.message}</p>
                </div>

                {comment.self && (
                  <div className="flex-shrink-0">
                    <User className="h-8 w-8 text-green-600" />
                  </div>
                )}
              </div>
            ))}
            <div ref={chatEndRef} />
          </CardContent>

          {/* Input Box */}
            <div className="flex items-center gap-2 px-5">
            <Input
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="resize-none border-green-300 focus-visible:ring-green-500 h-12"
            />
            <Button
              onClick={handleAddComment}
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

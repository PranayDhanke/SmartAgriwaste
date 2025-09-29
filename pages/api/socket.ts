import { Server as NetServer } from "http";
import { Server as IOServer } from "socket.io";
import type { NextApiRequest } from "next";
import { NextApiResponseServerIo } from "../../types/next";

type Chat = {
  messageId: string;
  userId: string;
  username: string;
  message: string;
};

const messages: Chat[] = []; // in-memory message store

export default function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  const COMMUNITY_ROOM = process.env.ROOM_ID || "community";

  // Only create the server once
  if (!res.socket.server.io) {
    const httpServer: NetServer = res.socket.server;

    const io = new IOServer(httpServer, {
      path: "/api/socket/io", // ✅ must match client
    });

    res.socket.server.io = io;

    io.on("connection", (socket) => {
      console.log("✅ User connected:", socket.id);

      // Always join the community room
      socket.join(COMMUNITY_ROOM);
      console.log(`📌 ${socket.id} joined ${COMMUNITY_ROOM}`);

      // Load previous messages to the new user only
      socket.emit("load-messages", messages);

      // When user sends a message
      socket.on("send-msg", (data: Chat) => {
        console.log("📩 Received:", data);

        // Save message in-memory
        messages.push(data);

        // Broadcast message to everyone in the room
        io.to(COMMUNITY_ROOM).emit("receive-msg", data);
      });

      socket.on("disconnect", () => {
        console.log("❌ User disconnected:", socket.id);
      });
    });
  }

  res.end();
}

import { NextRequest, NextResponse } from "next/server";
import { pusherServer } from "@/lib/pusher";
import Messages from "@/models/message";
import dbConnect from "@/lib/mongoDB";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();

    const { userId, username, message } = body;

    // Trigger event on community channel
    await pusherServer.trigger("community", "new-message", {
      userId,
      username,
      message,
      messageId: Date.now(),
    });

    await Messages.create({ userId, username, message, messageId: Date.now() });

    return NextResponse.json({ status: "ok" });
  } catch {
    return NextResponse.json({ error: "Failed to send message" });
  }
}

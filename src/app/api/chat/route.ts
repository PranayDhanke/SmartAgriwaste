import { NextRequest, NextResponse } from "next/server";
import { pusherServer } from "@/lib/pusher";
import Messages from "@/models/message";
import dbConnect from "@/lib/mongoDB";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();
    const { userId, username, message } = body;

    if (!userId || !username || !message) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    // Generate one messageId
    const messageId = Date.now();

    // Trigger Pusher update
    await pusherServer.trigger("community", "new-message", {
      userId,
      username,
      message,
      messageId,
    });

    // Save message to DB
    await Messages.create({
      userId,
      username,
      message,
      messageId,
    });

    return NextResponse.json({ status: "ok" }, { status: 200 });
  } catch (err) {
    console.error("Send message error:", err);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}

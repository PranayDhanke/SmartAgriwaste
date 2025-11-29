import dbConnect from "@/lib/mongoDB";
import Messages from "@/models/message";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();

    const messages = await Messages.find()
      .sort({ messageId: 1 })  // oldest → newest
      .limit(100)
      .lean();

    return NextResponse.json({ messages }, { status: 200 });
  } catch (err) {
    console.error("Failed to fetch messages:", err);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

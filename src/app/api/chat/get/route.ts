import dbConnect from "@/lib/mongoDB";
import Messages from "@/models/message";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();
    const messages = await Messages.find().limit(100).lean();
    return NextResponse.json({ messages }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Failed to fetch messages" });
  }
}

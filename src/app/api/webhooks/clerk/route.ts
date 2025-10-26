import { Webhook } from "svix";
import { headers } from "next/headers";
import dbConnect from "@/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";
import buyeraccount from "@/models/buyeraccount";
import farmeraccount from "@/models/farmeraccount";

type ClerkWebhookEvent = {
  data: {
    id: string;
    first_name?: string;
    last_name?: string;
    username?: string;
    email_addresses?: { email_address: string }[];
    unsafe_metadata?: { role?: string };
  };
  type: string;
};

export async function POST(req: NextRequest) {
  await dbConnect();

  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET!;
  const payload = await req.text();
  const headerList = headers();

  const svix_id = (await headerList).get("svix-id");
  const svix_timestamp = (await headerList).get("svix-timestamp");
  const svix_signature = (await headerList).get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json("Missing Svix headers", { status: 400 });
  }

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: ClerkWebhookEvent;

  try {
    evt = wh.verify(payload, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as ClerkWebhookEvent; // 👈 type assertion here
  } catch {
    return NextResponse.json("Invalid signature", { status: 400 });
  }

  const { data, type } = evt;
  const role = data.unsafe_metadata?.role;
  const id = data.id.replace("user_", role === "buyer" ? "buy_" : "fam_");

  const account = role === "buyer" ? buyeraccount : farmeraccount;
  if (type === "user.updated") {
    await account.findOneAndUpdate(
      { id },
      {
        firstName: data.first_name,
        lastName: data.last_name,
        username: data.username,
        email: data.email_addresses?.[0]?.email_address,
      },
      { new: true }
    );
  }

  if (type === "user.deleted") {
    await account.findOneAndDelete({ id });
  }

  return NextResponse.json("Webhook received", { status: 200 });
}

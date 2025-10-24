import { Webhook } from "svix";
import { headers } from "next/headers";
import Account from "@/models/account";
import dbConnect from "@/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";

type ClerkWebhookEvent = {
  data: {
    id: string;
    first_name?: string;
    last_name?: string;
    username?: string;
    email_addresses?: { email_address: string }[];
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
  const farmerId = data.id.replace("user_", "fam_");

  if (type === "user.updated") {
    await Account.findOneAndUpdate(
      { farmerId },
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
    await Account.findOneAndDelete({ farmerId });
  }

  return NextResponse.json("Webhook received", { status: 200 });
}

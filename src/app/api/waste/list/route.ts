import dbConnect from "@/lib/mongoDB";
import Waste from "@/models/waste";
import { NextRequest, NextResponse } from "next/server";

type WasteType = "crop" | "fruit" | "vegetable";

interface WasteFormData {
  farmerId: string;
  title: string;
  wasteType: WasteType | "";
  wasteProduct: string;
  quantity: string;
  moisture: string;
  price: string;
  location: string;
  description: string;
  imageUrl: string ; 
  seller: {
    name: string;
    phone: string;
    email: string;
  };
}

export async function POST(req: NextRequest) {
  try {
    const data: WasteFormData = await req.json();

    await dbConnect();

    // Save document
    await Waste.create({
      ...data,
      createdAt: new Date(), // timestamp
    });

    return NextResponse.json(
      { status: "Waste listed successfully ✅" },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to list waste ❌" }, { status: 500 });
  }
}

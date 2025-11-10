import dbConnect from "@/lib/mongoDB";
import farmeraccount from "@/models/farmeraccount";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const {
      phone,
      aadharnumber,
      state,
      district,
      taluka,
      village,
      houseBuildingName,
      roadarealandmarkName,
      farmNumber,
      farmArea,
      farmUnit,
      aadharUrl,
      farmDocUrl,
    } = await req.json();
    const param = await params;
    const id = param.id;

    // Update farmer profile logic here

    await dbConnect();

    farmeraccount.findOneAndUpdate(
      { farmerId: id },
      {
        phone,
        aadharnumber,
        state,
        district,
        taluka,
        village,
        houseBuildingName,
        roadarealandmarkName,
        farmNumber,
        farmArea,
        farmUnit,
        aadharUrl,
        farmDocUrl,
      },
      {
        new: true,
      }
    );

    return NextResponse.json("Updated Farmer Profile", { status: 200 });
  } catch {
    return NextResponse.json("error", { status: 500 });
  }
}

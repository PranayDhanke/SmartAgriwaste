import mongoose, { Schema } from "mongoose";

type FarmUnit = "hectare" | "acre";

interface IAccount {
  farmerId: string; // Clerk user ID
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  aadhar: string;

  // Address
  state: string;
  district: string;
  taluka: string;
  village: string;
  houseBuildingName: string;
  roadarealandmarkName: string;

  // Files (store only URLs in MongoDB)
  aadharUrl?: string; // Aadhaar photo
  farmDocUrl?: string; // 7/12 or 8A document

  // Farm details
  farmNumber: string; // 7/12 or 8A number
  farmArea: string;
  farmUnit: FarmUnit;
}

const AccountSchema = new Schema<IAccount>(
  {
    farmerId: { type: String, required: true, unique: true },
    firstName: { type: String },
    lastName: { type: String },
    username: { type: String },
    email: { type: String },
    phone: { type: String },
    aadhar: { type: String },

    // Address
    state: { type: String },
    district: { type: String },
    taluka: { type: String },
    village: { type: String },
    houseBuildingName: { type: String },
    roadarealandmarkName: { type: String },

    // File URLs
    aadharUrl: { type: String },
    farmDocUrl: { type: String },

    // Farm
    farmNumber: { type: String },
    farmArea: { type: String },
    farmUnit: { type: String, enum: ["hectare", "acre"] },
  },
  { timestamps: true }
);

export default mongoose.models.Account ||
  mongoose.model("Account", AccountSchema);

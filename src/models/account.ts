import mongoose, { Schema } from "mongoose";

type FarmUnit = "hectare" | "acre";

interface IAccount {
  farmerId: string; 
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  aadharnumber: string;

  // Address
  state: string;
  district: string;
  taluka: string;
  village: string;
  houseBuildingName: string;
  roadarealandmarkName: string;

  // Files (store only URLs in MongoDB)
  aadharUrl: string; // Aadhaar photo
  farmDocUrl: string; // 7/12 or 8A document

  // Farm details
  farmNumber: string; // 7/12 or 8A number
  farmArea: string;
  farmUnit: FarmUnit;
}

const AccountSchema = new Schema<IAccount>(
  {
    farmerId: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    aadharnumber: { type: String, required: true },

    // Address
    state: { type: String, required: true },
    district: { type: String, required: true },
    taluka: { type: String },
    village: { type: String, required: true },
    houseBuildingName: { type: String, required: true },
    roadarealandmarkName: { type: String, required: true },

    // File URLs
    aadharUrl: { type: String, required: true },
    farmDocUrl: { type: String, required: true },

    // Farm
    farmNumber: { type: String, required: true },
    farmArea: { type: String, required: true },
    farmUnit: { type: String, enum: ["hectare", "acre"], required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Account ||
  mongoose.model("Account", AccountSchema);

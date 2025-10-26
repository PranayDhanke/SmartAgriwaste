import mongoose, { Schema } from "mongoose";

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
}

const BuyerAccountSchema = new Schema<IAccount>(
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
  },
  { timestamps: true }
);

export default mongoose.models.BuyerAccount ||
  mongoose.model("BuyerAccount", BuyerAccountSchema);

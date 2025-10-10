import mongoose, { Schema } from "mongoose";

type WasteType = "crop" | "fruit" | "vegetable";

interface wasteFormData {
  title: string;
  wasteType: WasteType | "";
  wasteProduct: string;
  quantity: string;
  moisture: string;
  price: string;
  location: string;
  description: string;
  image: File | null;
}

const wasteSchema = new mongoose.Schema<wasteFormData>({
  title: { type: String, required: true },
  wasteType: { type: String, required: true },
  description: { type: String },
  wasteProduct: { type: String, required: true },
  quantity: { type: String, required: true },
  moisture: { type: String, required: true },
  price: { type: String, required: true },
  location: { type: String, required: true },
  image: { type: String },
});

const Waste = mongoose.models.Waste || mongoose.model("Waste", wasteSchema);

export default Waste;
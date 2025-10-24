import mongoose from "mongoose";

type WasteType = "crop" | "fruit" | "vegetable";

interface wasteFormData {
  farmerId: string;
  title: string;
  wasteType: WasteType | "";
  wasteProduct: string;
  quantity: string;
  moisture: string;
  price: string;
  location: string;
  description: string;
  imageUrl: string;
}

const wasteSchema = new mongoose.Schema<wasteFormData>({
  farmerId: { type: String, required: true },
  title: { type: String, required: true },
  wasteType: { type: String, required: true },
  description: { type: String, required: true },
  wasteProduct: { type: String, required: true },
  quantity: { type: String, required: true },
  moisture: { type: String, required: true },
  price: { type: String, required: true },
  location: { type: String, required: true },
  imageUrl: { type: String, required: true },
});

const Waste = mongoose.models.Waste || mongoose.model("Waste", wasteSchema);

export default Waste;

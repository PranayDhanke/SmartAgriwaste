export type WasteType = "crop" | "fruit" | "vegetable";

export type Seller = {
  name: string;
  phone: string;
  email: string;
};

export type Address = {
  houseBuildingName: string;
  roadarealandmarkName: string;
  state: string;
  district: string;
  taluka: string;
  village: string;
};

export interface WasteFormData {
  title: string;
  wasteType: WasteType | "";
  wasteProduct: string;
  quantity: string;
  moisture: string;
  price: string;
  description: string;
  address: Address;
  image: File | null;
  seller: Seller;
}

export interface WasteFormDataSchema {
  farmerId: string;
  title: string;
  wasteType: WasteType | "";
  wasteProduct: string;
  quantity: string;
  moisture: string;
  price: string;
  description: string;
  address: Address;
  imageUrl: File | null;
  seller: Seller;
}

export interface FarmerWasteFormData {
  _id: string;
  title: string;
  wasteType: WasteType | "";
  wasteProduct: string;
  quantity: string;
  moisture: string;
  price: string;
  description: string;
  imageUrl: string;
}


export interface WasteForm {
  wasteType: WasteType | "";
  wasteProduct: string;
  quantity: string;
  moisture: string;
  currentMethod: string;
  intendedUse: string;
  contamination: string;
  notes: string;
}
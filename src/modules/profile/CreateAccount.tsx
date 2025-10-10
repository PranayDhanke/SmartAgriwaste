"use client";

import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Leaf, FileText, Check } from "lucide-react";
import addressJson from "@/../public/Address.json";

interface AddressType {
  states: string[];
  districts: { [key: string]: string[] };
  talukas: { [key: string]: string[] };
  villages: { [key: string]: string[] };
}


export default function CreateAccount() {
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  const Address: AddressType = addressJson;

  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    phone: "",
    aadhar: "",
    houseBuildingName: "",
    roadarealandmarkName: "",
    state: "",
    district: "",
    taluka: "",
    village: "",
    role: "farmer",
    photo: null as File | null,
    farmNumber: "",
    farmDoc: null as File | null,
    farmArea: "",
    farmUnit: "hectare",
  });

  if (!isLoaded) return <p>Loading...</p>;
  if (!isSignedIn) return <p>You must be signed in</p>;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files)
      setForm({ ...form, [e.target.name]: e.target.files[0] });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    data.append("clerkId", user.id);
    data.append("firstName", user.firstName || "");
    data.append("lastName", user.lastName || "");
    data.append("username", user.username || "");
    data.append("email", user.primaryEmailAddress?.emailAddress || "");
    data.append("phone", form.phone);
    data.append("aadhar", form.aadhar);
    data.append("state", form.state);
    data.append("district", form.district);
    data.append("taluka", form.taluka);
    data.append("village", form.village);
    data.append("houseBuildingName", form.houseBuildingName);
    data.append("roadarealandmarkName", form.roadarealandmarkName);
    if (form.photo) data.append("photo", form.photo);
    data.append("farmNumber", form.farmNumber);
    if (form.farmDoc) data.append("farmDoc", form.farmDoc);
    data.append("farmArea", form.farmArea);
    data.append("farmUnit", form.farmUnit);

    const res = await fetch("/api/profile", {
      method: "POST",
      body: data,
    });

    if (res.ok) router.push("/");
    else alert("Error creating profile");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-4 flex items-center justify-center">
      <Card className="w-full max-w-3xl shadow-xl border-green-200">
        <CardHeader className="space-y-4 mt-[-24px] pt-5 pb-8 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
          <div className="flex items-center justify-center gap-2">
            <Leaf className="w-8 h-8" />
            <CardTitle className="text-3xl font-bold text-center">
              Farmer Waste Management
            </CardTitle>
          </div>
          <p className="text-center text-green-50 text-sm">
            Complete your profile to start managing agricultural waste
            efficiently
          </p>
        </CardHeader>

        <CardContent className="pt-8">
          <form onSubmit={handleSubmit}>
            {/* Slider Wrapper */}
            <div className="overflow-hidden relative w-full">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${(step - 1) * 100}%)` }}
              >
                {/* Step 1: Personal */}
                <div className="w-full flex-shrink-0 space-y-5 px-2">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1 h-6 bg-green-600 rounded-full" />
                    <h2 className="font-bold text-xl text-gray-800">
                      Personal & Identity
                    </h2>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="phone"
                      className="text-gray-700 font-medium"
                    >
                      Phone Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                      className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="aadhar"
                      className="text-gray-700 font-medium"
                    >
                      Aadhaar Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="aadhar"
                      name="aadhar"
                      value={form.aadhar}
                      onChange={handleChange}
                      placeholder="Enter 12-digit Aadhaar Number"
                      maxLength={12}
                      className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="photo"
                      className="text-gray-700 font-medium"
                    >
                      Aadhaar Photo <span className="text-red-500">*</span>
                    </Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-green-500 transition-colors">
                      <Input
                        type="file"
                        id="photo"
                        name="photo"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="pt-4">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-1 h-6 bg-green-600 rounded-full" />
                      <h3 className="font-semibold text-lg text-gray-800">
                        Address Details
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* State */}
                      <div className="space-y-2">
                        <Label className="text-gray-700 font-medium">
                          State <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          onValueChange={(value) =>
                            setForm({
                              ...form,
                              state: value,
                              district: "",
                              taluka: "",
                              village: "",
                            })
                          }
                        >
                          <SelectTrigger className="border-gray-300 focus:border-green-500 focus:ring-green-500">
                            <SelectValue placeholder="Select State" />
                          </SelectTrigger>
                          <SelectContent>
                            {Address.states.map((s) => (
                              <SelectItem key={s} value={s}>
                                {s}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* District */}
                      <div className="space-y-2">
                        <Label className="text-gray-700 font-medium">
                          District <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          onValueChange={(value) =>
                            setForm({
                              ...form,
                              district: value,
                              taluka: "",
                              village: "",
                            })
                          }
                          disabled={!form.state}
                        >
                          <SelectTrigger className="border-gray-300 focus:border-green-500 focus:ring-green-500">
                            <SelectValue placeholder="Select District" />
                          </SelectTrigger>
                          <SelectContent>
                            {(form.state
                              ? (Address.districts[form.state] as string[]) ||
                                []
                              : []
                            ).map((d) => (
                              <SelectItem key={d} value={d}>
                                {d}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Taluka */}
                      <div className="space-y-2">
                        <Label className="text-gray-700 font-medium">
                          Taluka <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          onValueChange={(value) =>
                            setForm({ ...form, taluka: value, village: "" })
                          }
                          disabled={!form.district}
                        >
                          <SelectTrigger className="border-gray-300 focus:border-green-500 focus:ring-green-500">
                            <SelectValue placeholder="Select Taluka" />
                          </SelectTrigger>
                          <SelectContent>
                            {(form.district
                              ? Address.talukas[form.district] || []
                              : []
                            ).map((t) => (
                              <SelectItem key={t} value={t}>
                                {t}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Village */}
                      <div className="space-y-2">
                        <Label className="text-gray-700 font-medium">
                          Village/City <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          onValueChange={(value) =>
                            setForm({ ...form, village: value })
                          }
                          disabled={!form.taluka}
                        >
                          <SelectTrigger className="border-gray-300 focus:border-green-500 focus:ring-green-500">
                            <SelectValue placeholder="Select Village/City" />
                          </SelectTrigger>
                          <SelectContent>
                            {(form.taluka
                              ? Address.villages[form.taluka] || []
                              : []
                            ).map((v) => (
                              <SelectItem key={v} value={v}>
                                {v}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="phone"
                          className="text-gray-700 font-medium"
                        >
                          House Number / Building Name
                        </Label>
                        <Input
                          id=" houseBuildingName"
                          name="houseBuildingName"
                          value={form.houseBuildingName}
                          onChange={handleChange}
                          placeholder="Enter your House Number or Building Name"
                          className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="phone"
                          className="text-gray-700 font-medium"
                        >
                          Road Name , Area , Landmark{" "}
                          <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="roadarealandmarkName"
                          name="roadarealandmarkName"
                          value={form.roadarealandmarkName}
                          onChange={handleChange}
                          placeholder="Enter your Road Name , Area , Landmark"
                          className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <Button
                    type="button"
                    className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white font-semibold py-6 text-lg shadow-lg"
                    onClick={() => setStep(2)}
                  >
                    Continue to Farm Details →
                  </Button>
                </div>

                {/* Step 2: Farm Details */}
                <div className="w-full flex-shrink-0 space-y-5 px-2">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1 h-6 bg-green-600 rounded-full" />
                    <h2 className="font-bold text-xl text-gray-800">
                      Farm Details
                    </h2>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="farmNumber"
                      className="text-gray-700 font-medium"
                    >
                      7/12 or 8A Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="farmNumber"
                      name="farmNumber"
                      value={form.farmNumber}
                      onChange={handleChange}
                      placeholder="Enter 7/12 or 8A Number"
                      className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="farmDoc"
                      className="text-gray-700 font-medium"
                    >
                      7/12 or 8A Document{" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-green-500 transition-colors">
                      <Input
                        type="file"
                        id="farmDoc"
                        name="farmDoc"
                        accept="image/*,application/pdf"
                        onChange={handleFileChange}
                        className="cursor-pointer"
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        Upload PDF or image format
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="farmArea"
                        className="text-gray-700 font-medium"
                      >
                        Farm Area <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="farmArea"
                        name="farmArea"
                        type="number"
                        step="0.01"
                        value={form.farmArea}
                        onChange={handleChange}
                        placeholder="Enter Farm Area"
                        className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-700 font-medium">
                        Unit <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        onValueChange={(value) =>
                          setForm({ ...form, farmUnit: value })
                        }
                        defaultValue={form.farmUnit}
                      >
                        <SelectTrigger className="border-gray-300 focus:border-green-500 focus:ring-green-500">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hectare">Hectare</SelectItem>
                          <SelectItem value="acre">Acre</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-6">
                    <div className="flex items-start gap-3">
                      <FileText className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          Why we need this information?
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          Farm documentation helps us verify your land ownership
                          and provide you with accurate waste management
                          solutions tailored to your farm size.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 mt-8">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-1/2 border-2 border-green-600 text-green-600 hover:bg-green-50 font-semibold py-6 text-lg"
                      onClick={() => setStep(1)}
                    >
                      ← Back
                    </Button>
                    <Button
                      type="submit"
                      className="w-1/2 bg-green-600 hover:bg-green-700 text-white font-semibold py-6 text-lg shadow-lg"
                    >
                      Complete Profile ✓
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

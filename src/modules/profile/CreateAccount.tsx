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
import { Leaf, CheckCircle2 } from "lucide-react";
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
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    phone: "",
    aadharnumber: "",
    houseBuildingName: "",
    roadarealandmarkName: "",
    state: "",
    district: "",
    taluka: "",
    village: "",
    role: "farmer",
    aadhar: null as File | null,
    farmdoc: null as File | null,
    farmNumber: "",
    farmArea: "",
    farmUnit: "hectare",
  });

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-green-600 text-lg font-medium">Loading...</div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center">
        <Card className="p-8 shadow-xl">
          <p className="text-gray-700 text-center">You must be signed in to access this page</p>
        </Card>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files)
      setForm({ ...form, [e.target.name]: e.target.files[0] });
  };

  const uploadToImageKit = async (file: File, folder: string) => {
    const data = new FormData();
    data.append("file", file);
    data.append("farmerid", user.id.replace(/^user_/, "fam_"));
    data.append("folder", folder);

    const res = await fetch(`/api/upload`, {
      method: "POST",
      body: data,
    });

    if (!res.ok) throw new Error(`Failed to upload ${folder}`);
    const result = await res.json();
    return result.url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let aadharUrl = "";
      let farmDocUrl = "";

      if (form.aadhar) {
        alert("uploading aadhar");
        aadharUrl = await uploadToImageKit(form.aadhar, "aadhar");
      }

      if (form.farmdoc) {
        alert("uploading formdoc");
        farmDocUrl = await uploadToImageKit(form.farmdoc, "farmdoc");
      }

      const formdata = new FormData();
      formdata.append("farmerId", user.id.replace(/^user_/, "fam_"));
      formdata.append("firstName", user.firstName || "");
      formdata.append("lastName", user.lastName || "");
      formdata.append("username", user.username || "");
      formdata.append("email", user.primaryEmailAddress?.emailAddress || "");
      formdata.append("phone", form.phone);
      formdata.append("aadharnumber", form.aadharnumber);
      formdata.append("state", form.state);
      formdata.append("district", form.district);
      formdata.append("taluka", form.taluka);
      formdata.append("village", form.village);
      formdata.append("houseBuildingName", form.houseBuildingName);
      formdata.append("roadarealandmarkName", form.roadarealandmarkName);
      formdata.append("farmNumber", form.farmNumber);
      formdata.append("farmArea", form.farmArea);
      formdata.append("farmUnit", form.farmUnit);
      formdata.append("aadharUrl", aadharUrl);
      formdata.append("farmDocUrl", farmDocUrl);

      const res = await fetch("/api/profile", {
        method: "POST",
        body: formdata,
      });

      if (res.ok) {
        alert("✅ Profile created successfully!");
        router.push("/");
      } else {
        alert("❌ Failed to save profile.");
      }
    } catch (err) {
      console.error(err);
      alert("⚠️ Something went wrong during upload.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-8 px-4 flex items-center justify-center">
      <Card className="w-full max-w-2xl shadow-2xl border-0 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white pb-8 pt-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
              <Leaf className="w-8 h-8" />
            </div>
            <CardTitle className="text-3xl font-bold">
              Farmer Registration
            </CardTitle>
          </div>
          <p className="text-center text-green-50 text-sm max-w-md mx-auto leading-relaxed">
            Complete your profile to start managing agricultural waste efficiently
          </p>
          
          {/* Progress Indicator */}
          <div className="flex items-center justify-center gap-2 mt-6">
            <div className={`flex items-center gap-2 transition-colors ${step >= 1 ? 'text-white' : 'text-green-300'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold transition-all ${step >= 1 ? 'bg-white text-green-600' : 'bg-green-500'}`}>
                {step > 1 ? <CheckCircle2 className="w-5 h-5" /> : '1'}
              </div>
              <span className="text-sm font-medium hidden sm:inline">Personal</span>
            </div>
            <div className={`w-12 h-0.5 transition-colors ${step >= 2 ? 'bg-white' : 'bg-green-400'}`}></div>
            <div className={`flex items-center gap-2 transition-colors ${step >= 2 ? 'text-white' : 'text-green-300'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold transition-all ${step >= 2 ? 'bg-white text-green-600' : 'bg-green-500'}`}>
                2
              </div>
              <span className="text-sm font-medium hidden sm:inline">Farm Details</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-8">
          <form onSubmit={handleSubmit}>
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${(step - 1) * 100}%)` }}
              >
                {/* STEP 1 - PERSONAL DETAILS */}
                <div className="w-full flex-shrink-0 space-y-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700">
                      Aadhaar Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      name="aadharnumber"
                      value={form.aadharnumber}
                      onChange={handleChange}
                      placeholder="XXXX XXXX XXXX"
                      className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700">
                      Aadhaar Photo <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        type="file"
                        name="aadhar"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="border-gray-300 focus:border-green-500"
                        required
                      />
                      {form.aadhar && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600 text-sm font-medium">
                          ✓ Selected
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700">
                      Phone Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+91 XXXXX XXXXX"
                      className="border-gray-300 focus:border-green-500"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">
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
                        value={form.state}
                      >
                        <SelectTrigger className="border-gray-300">
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

                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">
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
                        value={form.district}
                      >
                        <SelectTrigger className="border-gray-300">
                          <SelectValue placeholder="Select District" />
                        </SelectTrigger>
                        <SelectContent>
                          {(Address.districts[form.state] || []).map((d) => (
                            <SelectItem key={d} value={d}>
                              {d}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">
                        Taluka <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        onValueChange={(value) =>
                          setForm({ ...form, taluka: value, village: "" })
                        }
                        disabled={!form.district}
                        value={form.taluka}
                      >
                        <SelectTrigger className="border-gray-300">
                          <SelectValue placeholder="Select Taluka" />
                        </SelectTrigger>
                        <SelectContent>
                          {(Address.talukas[form.district] || []).map((t) => (
                            <SelectItem key={t} value={t}>
                              {t}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">
                        Village / City <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        onValueChange={(value) => setForm({ ...form, village: value })}
                        disabled={!form.taluka}
                        value={form.village}
                      >
                        <SelectTrigger className="border-gray-300">
                          <SelectValue placeholder="Select Village/City" />
                        </SelectTrigger>
                        <SelectContent>
                          {(Address.villages[form.taluka] || []).map((v) => (
                            <SelectItem key={v} value={v}>
                              {v}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700">
                      House Number / Building Name
                    </Label>
                    <Input
                      name="houseBuildingName"
                      value={form.houseBuildingName}
                      onChange={handleChange}
                      placeholder="e.g., House No. 123, Building ABC"
                      className="border-gray-300 focus:border-green-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700">
                      Road, Area, Landmark
                    </Label>
                    <Input
                      name="roadarealandmarkName"
                      value={form.roadarealandmarkName}
                      onChange={handleChange}
                      placeholder="e.g., Near Town Hall, Main Road"
                      className="border-gray-300 focus:border-green-500"
                    />
                  </div>

                  <Button
                    type="button"
                    onClick={() => setStep(2)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-base font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    Continue to Farm Details →
                  </Button>
                </div>

                {/* STEP 2 - FARM DETAILS */}
                <div className="w-full flex-shrink-0 space-y-6 pl-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700">
                      7/12 or 8A Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      name="farmNumber"
                      value={form.farmNumber}
                      onChange={handleChange}
                      placeholder="Enter document number"
                      className="border-gray-300 focus:border-green-500"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700">
                      Upload Farm Document <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        type="file"
                        name="farmdoc"
                        accept="image/*,application/pdf"
                        onChange={handleFileChange}
                        className="border-gray-300 focus:border-green-500"
                        required
                      />
                      {form.farmdoc && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600 text-sm font-medium">
                          ✓ Selected
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">Accepted: Images or PDF files</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">
                        Farm Area <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        type="number"
                        step="0.01"
                        name="farmArea"
                        value={form.farmArea}
                        onChange={handleChange}
                        placeholder="Enter area"
                        className="border-gray-300 focus:border-green-500"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">
                        Unit <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        onValueChange={(value) => setForm({ ...form, farmUnit: value })}
                        defaultValue={form.farmUnit}
                      >
                        <SelectTrigger className="border-gray-300">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hectare">Hectare</SelectItem>
                          <SelectItem value="acre">Acre</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(1)}
                      className="w-full sm:w-1/2 border-2 border-green-600 text-green-600 hover:bg-green-50 py-6 text-base font-semibold"
                    >
                      ← Back
                    </Button>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full sm:w-1/2 bg-green-600 hover:bg-green-700 text-white py-6 text-base font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="animate-spin">⏳</span> Uploading...
                        </span>
                      ) : (
                        "Complete Profile ✓"
                      )}
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
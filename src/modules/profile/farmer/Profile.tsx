"use client";

import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const formSchema = z.object({
  phone: z.string().optional(),
  aadharnumber: z.string().optional(),
  state: z.string().optional(),
  district: z.string().optional(),
  taluka: z.string().optional(),
  village: z.string().optional(),
  houseBuildingName: z.string().optional(),
  roadarealandmarkName: z.string().optional(),
  farmNumber: z.string().optional(),
  farmArea: z.string().optional(),
  farmUnit: z.string().optional(),
  aadharUrl: z.string().optional(),
  farmDocUrl: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function Profile() {
  const { user } = useUser();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  const [aadharPreview, setAadharPreview] = useState<string | null>(null);
  const [farmDocPreview, setFarmDocPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const farmerId = user ? user.id.replace("user_", "fam_") : "";

  // Fetch data from API when component mounts
  useEffect(() => {
    if (!farmerId) return;

    async function fetchFarmerData() {
      try {
        const response = await fetch(`/api/profile/get/${farmerId}`);
        if (!response.ok) throw new Error("Failed to fetch profile data");
        const resdata = await response.json();
        const data = await resdata.accountdata;

        form.reset({
          phone: data.phone || "",
          aadharnumber: data.aadharnumber || "",
          state: data.state || "",
          district: data.district || "",
          taluka: data.taluka || "",
          village: data.village || "",
          houseBuildingName: data.houseBuildingName || "",
          roadarealandmarkName: data.roadarealandmarkName || "",
          farmNumber: data.farmNumber || "",
          farmArea: data.farmArea || "",
          farmUnit: data.farmUnit || "",
          aadharUrl: data.aadharUrl || "",
          farmDocUrl: data.farmDocUrl || "",
        });

        if (data.aadharUrl) setAadharPreview(data.aadharUrl);
        if (data.farmDocUrl) setFarmDocPreview(data.farmDocUrl);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchFarmerData();
  }, [farmerId, form]);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setPreview: React.Dispatch<React.SetStateAction<string | null>>,
    field: { onChange: (value: string | ArrayBuffer | null) => void }
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
      field.onChange(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (values: FormValues) => {
    console.log("Updated farmer profile:", values);
    await fetch(`/api/profile/update/${farmerId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
  };

  if (!user) return <p className="text-center py-10">Loading user...</p>;
  if (isLoading)
    return <p className="text-center py-10">Loading farmer data...</p>;

  return (
    <div className="container py-10">
      <Card className="max-w-4xl mx-auto border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-green-700">
            Farmer Profile
          </CardTitle>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="bg-gray-50 p-4 rounded-md border text-sm text-gray-600">
                <p>
                  <span className="font-medium text-green-700">Farmer ID:</span>{" "}
                  {farmerId}
                </p>
              </div>

              {/* Clerk Info */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <FormLabel>First Name</FormLabel>
                  <Input value={user?.firstName || ""} disabled />
                </div>
                <div>
                  <FormLabel>Last Name</FormLabel>
                  <Input value={user?.lastName || ""} disabled />
                </div>
                <div>
                  <FormLabel>Username</FormLabel>
                  <Input value={user?.username || ""} disabled />
                </div>
                <div>
                  <FormLabel>Email</FormLabel>
                  <Input
                    value={user?.primaryEmailAddress?.emailAddress || ""}
                    disabled
                  />
                </div>
              </div>

              <hr className="my-6" />

              {/* Editable Fields */}
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  "phone",
                  "aadharnumber",
                  "state",
                  "district",
                  "taluka",
                  "village",
                  "houseBuildingName",
                  "roadarealandmarkName",
                  "farmNumber",
                  "farmArea",
                  "farmUnit",
                ].map((key) => (
                  <FormField
                    key={key}
                    control={form.control}
                    name={key as keyof FormValues}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="capitalize">{key}</FormLabel>
                        <FormControl>
                          <Input placeholder={`Enter ${key}`} {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                ))}
              </div>

              {/* Aadhar and Farm Document */}
              <div className="grid md:grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="aadharUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Aadhaar Document</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            handleFileChange(e, setAadharPreview, field)
                          }
                        />
                      </FormControl>
                      {aadharPreview && (
                        <div className="mt-2">
                          <Image
                            src={aadharPreview}
                            alt="Aadhar preview"
                            className="rounded-md border"
                            width={200}
                            height={120}
                          />
                        </div>
                      )}
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="farmDocUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Farm Document</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            handleFileChange(e, setFarmDocPreview, field)
                          }
                        />
                      </FormControl>
                      {farmDocPreview && (
                        <div className="mt-2">
                          <Image
                            src={farmDocPreview}
                            alt="Farm doc preview"
                            className="rounded-md border"
                            width={200}
                            height={120}
                          />
                        </div>
                      )}
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

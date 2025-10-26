"use client";
import { SignUp } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";

export default function Page() {
  const searchParams = useSearchParams();
  const role = searchParams.get("role");

  return (
    <div className="flex my-5 justify-center items-center">
      <SignUp
        unsafeMetadata={{ role }}
        path="/sign-up"
        routing="path"
        afterSignUpUrl={`/create-account/${role}`}
        signInUrl="/sign-in"
      />
    </div>
  );
}

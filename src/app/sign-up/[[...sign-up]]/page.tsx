import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex my-5 justify-center items-center">
      <SignUp path="/sign-up" routing="path" afterSignUpUrl={'/create-account'} signInUrl="/sign-in" />
    </div>
  );
}

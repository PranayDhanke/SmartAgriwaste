"use client"
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const CreateAccountRedirect = () => {
  const router = useRouter();
  useEffect(() => {
    const role = localStorage.getItem("roleItem");
    router.push(`/create-account/${role}`);
  });
  return <div className="h-screen animate-collapsible-up">loading...</div>;
};

export default CreateAccountRedirect;

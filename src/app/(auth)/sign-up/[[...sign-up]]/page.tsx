"use client";

import { SignUp } from "@clerk/nextjs";

export default function SignupPage() {
  return (
    <div className="flex flex-col items-center justify-center gap-8 py-8 w-full">
      <SignUp path="/sign-up" />
    </div>
  );
}

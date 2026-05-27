"use client";

import { SignIn } from "@clerk/nextjs";

export default function SigninPage() {
  return (
    <div className="flex flex-col items-center justify-center gap-8 py-8 w-full">
      <SignIn path="/sign-in" />
    </div>
  );
}


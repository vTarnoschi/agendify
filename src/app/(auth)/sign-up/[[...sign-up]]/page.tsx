"use client";

import { SignUp } from "@clerk/nextjs";

export default function SignupPage() {
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <SignUp
        fallbackRedirectUrl="/onboarding"
        appearance={{
          elements: {
            rootBox: "w-full",
            card: "bg-[#071428]/90 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl w-full max-w-[440px]",
            headerTitle: "text-white font-bold text-2xl",
            headerSubtitle: "text-slate-400",
            socialButtonsBlockButton:
              "bg-white/5 border-white/10 hover:bg-white/10 text-white transition-all",
            socialButtonsBlockButtonText: "font-medium",
            dividerLine: "bg-white/10",
            dividerText: "text-slate-500",
            formFieldLabel: "text-slate-300 font-medium",
            formFieldInput:
              "bg-white/5 border-white/10 text-white focus:border-[#ff6b35] focus:ring-[#ff6b35]/20 rounded-lg transition-all",
            formButtonPrimary:
              "bg-[#ff6b35] hover:bg-[#e05825] text-white shadow-lg shadow-[#ff6b35]/25 rounded-lg transition-all",
            footerActionText: "text-slate-400",
            footerActionLink:
              "text-[#ff6b35] hover:text-[#ff6b35]/80 font-medium transition-colors",
            identityPreviewText: "text-white",
            identityPreviewEditButtonIcon: "text-[#ff6b35]",
            formFieldSuccessText: "text-green-400",
            formFieldErrorText: "text-red-400",
          },
        }}
      />
    </div>
  );
}

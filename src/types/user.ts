export type User = {
  id: string;
  name: string;
  email: string;
  role: "client" | "provider";
  slug?: string | null;
  businessName?: string | null;
  category?: string | null;
  brandColor?: string | null;
  brandLogo?: string | null;
  workingDays?: string[] | null;
  workStart?: string | null;
  workEnd?: string | null;
  createdAt: Date;
};

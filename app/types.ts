export type CreatorStatus =
  | "not_applied"
  | "pending"
  | "approved"
  | "rejected"
  | "suspended";

export type Token = {
  id: string;
  name: string;
  symbol: string;
  image?: string;
  price: number;
  marketCap: number;
  change24h: number;
  sparkline: number[];
  lastUpdated?: string;
};

export type CreatorApplicationData = {
  displayName: string;
  creatorType: string;
  email: string;
  country: string;
  bio: string;
  website: string;
  primaryCategory: string;
  experience: string;
  status: CreatorStatus;
  reviewNote: string;
  submittedAt: string;
};

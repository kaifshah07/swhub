export type EnquiryStatus = "NEW" | "CONTACTED" | "IN_PROGRESS" | "CONVERTED" | "REJECTED";

export interface VendorEnquiry {
  id: number;
  name: string;
  mobile: string;
  email: string;
  city: string;
  state: string;
  currentBusiness?: string | null;
  investmentCapacity?: string | null;
  preferredLocation?: string | null;
  message?: string | null;
  status: EnquiryStatus;
  createdAt: string;
  updatedAt: string;
}

export interface FranchiseEnquiry {
  id: number;
  fullName: string;
  mobile: string;
  email: string;
  city: string;
  state: string;
  ownsBusiness: boolean;
  currentBusinessName?: string | null;
  currentBusinessType?: string | null;
  businessExperience?: string | null;
  preferredLocation?: string | null;
  preferredCity?: string | null;
  preferredArea?: string | null;
  investmentCapacity?: string | null;
  storeType?: string | null;
  startTimeline?: string | null;
  message?: string | null;
  status: EnquiryStatus;
  createdAt: string;
  updatedAt: string;
}

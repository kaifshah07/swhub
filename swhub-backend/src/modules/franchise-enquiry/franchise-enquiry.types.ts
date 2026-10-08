export interface CreateFranchiseEnquiryDTO {
  fullName: string;
  mobile: string;
  email: string;

  city: string;
  state: string;

  ownsBusiness: boolean;

  currentBusinessName?: string;
  currentBusinessType?: string;
  businessExperience?: string;

  preferredLocation: string;
  preferredCity: string;
  preferredArea?: string;

  investmentCapacity: string;
  storeType: string;
  startTimeline: string;

  message?: string;
}
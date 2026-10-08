import { prisma } from "../../config/database";
import { sendFranchiseEnquiryEmail } from "../../config/brevo";
import { CreateFranchiseEnquiryDTO } from "./franchise-enquiry.types";

export class FranchiseEnquiryService {
  static async create(data: CreateFranchiseEnquiryDTO) {
    const enquiry = await prisma.franchiseEnquiry.create({
      data: {
        fullName: data.fullName,
        mobile: data.mobile,
        email: data.email,

        city: data.city,
        state: data.state,

        ownsBusiness: data.ownsBusiness,

        currentBusinessName:
          data.currentBusinessName || null,

        currentBusinessType:
          data.currentBusinessType || null,

        businessExperience:
          data.businessExperience || null,

        preferredLocation:
          data.preferredLocation,

        preferredCity:
          data.preferredCity,

        preferredArea:
          data.preferredArea || null,

        investmentCapacity:
          data.investmentCapacity,

        storeType:
          data.storeType,

        startTimeline:
          data.startTimeline,

        message:
          data.message || null,
      },
    });

    try {
      await sendFranchiseEnquiryEmail(enquiry);
    } catch (error) {
      console.error(
        "Franchise enquiry email failed:",
        error
      );
    }

    return enquiry;
  }

  static async getAll() {
    return prisma.franchiseEnquiry.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  static async getById(id: number) {
    return prisma.franchiseEnquiry.findUnique({
      where: {
        id,
      },
    });
  }

  static async updateStatus(
    id: number,
    status:
      | "NEW"
      | "CONTACTED"
      | "IN_PROGRESS"
      | "CONVERTED"
      | "REJECTED"
  ) {
    return prisma.franchiseEnquiry.update({
      where: {
        id,
      },
      data: {
        status,
      },
    });
  }
}
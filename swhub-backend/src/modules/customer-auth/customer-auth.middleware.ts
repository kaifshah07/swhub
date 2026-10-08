import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../../config/database";

export const authenticateCustomer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  try {

    const authHeader =
      req.headers.authorization;

    if (!authHeader) {

      return res.status(401).json({
        success: false,
        message: "Authorization token required",
      });

    }

    const token =
      authHeader.startsWith("Bearer ")
        ? authHeader.substring(7)
        : authHeader;

   const decoded =
  jwt.verify(
    token,
    process.env.JWT_SECRET as string
  ) as any;

if (decoded.role !== "CUSTOMER") {
  return res.status(403).json({
    success: false,
    message: "Customer access required",
  });
}

const customer =
  await prisma.customer.findUnique({
    where: {
      id: decoded.id,
    },
  });

if (!customer) {
  return res.status(401).json({
    success: false,
    message: "Customer not found",
  });
}

if (customer.isBlocked) {
  return res.status(403).json({
    success: false,
    message: "Account blocked",
  });
}

(req as any).customer = {
  id: customer.id,
  email: customer.email,
  role: "CUSTOMER",
};

next();

  } catch (error) {

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });

  }
};
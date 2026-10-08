import { prisma } from "../../config/database";

export class CustomerService {

  static async getAll(page = 1, limit = 10, search = "") {

    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            {
              name: {
                contains: search,
              },
            },
            {
              email: {
                contains: search,
              },
            },
            {
              phone: {
                contains: search,
              },
            },
          ],
        }
      : {};

    const [customers, total] = await Promise.all([

      prisma.customer.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },

        include: {
          orders: {
            select: {
              id: true,
              totalAmount: true,
              orderStatus: true,
              paymentStatus: true,
              createdAt: true,
            },
          },
        },
      }),

      prisma.customer.count({
        where,
      }),

    ]);

    return {

      customers,

      pagination: {

        total,

        page,

        limit,

        totalPages: Math.ceil(total / limit),

      },

    };

  }

  static async getById(id: number) {

    return prisma.customer.findUnique({

      where: {
        id,
      },

      include: {

        orders: {

          include: {

            items: {

              include: {

                product: true,

              },

            },

          },

        },

      },

    });

  }

  static async update(id: number, data: any) {

    return prisma.customer.update({

      where: {
        id,
      },

      data,

    });

  }

  static async block(id: number) {

    return prisma.customer.update({

      where: {
        id,
      },

      data: {

        isBlocked: true,

      },

    });

  }

  static async unblock(id: number) {

    return prisma.customer.update({

      where: {
        id,
      },

      data: {

        isBlocked: false,

      },

    });

  }

  static async delete(id: number) {

    return prisma.customer.delete({

      where: {
        id,
      },

    });

  }

 static async create(data: {
  name: string;
  email: string;
  phone: string;
}) {
  const emailExists = await prisma.customer.findUnique({
    where: {
      email: data.email,
    },
  });

  if (emailExists) {
    throw new Error("Email already exists");
  }

  const phoneExists = await prisma.customer.findUnique({
    where: {
      phone: data.phone,
    },
  });

  if (phoneExists) {
    throw new Error("Phone already exists");
  }

  const customer = await prisma.customer.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,

      // Customer created from admin panel
      // gets a temporary password.
      password: "Temp@123",
    },
  });

  return {
    success: true,
    message: "Customer created successfully",
    customer,
  };
}
}

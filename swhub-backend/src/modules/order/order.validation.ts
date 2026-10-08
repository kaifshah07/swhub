import { z } from "zod";

export const createOrderSchema = z.object({

    customerName: z.string().min(2),

    customerEmail: z.string().email(),

    customerPhone: z.string().min(10),

    address: z.string(),

    paymentMethod: z.enum(["COD","ONLINE"]),

    items: z.array(

        z.object({

            productId: z.number(),

            quantity: z.number().min(1)

        })

    )

});

export const updateStatusSchema = z.object({

    orderStatus: z.enum([

        "PENDING",

        "CONFIRMED",

        "PACKED",

        "SHIPPED",

        "DELIVERED",

        "CANCELLED"

    ])

});
import { z } from "zod";

export const paymentStatusSchema = z.object({

  body: z.object({

    paymentStatus: z.enum([
      "PENDING",
      "PAID",
      "FAILED",
      "REFUNDED",
    ]),

  }),

});
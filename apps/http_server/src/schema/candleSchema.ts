import z from "zod";

export const candleSchema = z.object({
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
  asset: z.string(),
});

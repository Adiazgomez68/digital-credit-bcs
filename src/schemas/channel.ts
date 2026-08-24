import { z } from "zod";

export const channelSchema = z
  .object({
    channel: z.enum(["assisted", "unassisted"]),
    advisorId: z.string().trim().optional(),
  })
  .refine((data) => data.channel !== "assisted" || !!data.advisorId?.length, {
    message: "Ingresa el identificador del asesor.",
    path: ["advisorId"],
  });

export type ChannelValues = z.infer<typeof channelSchema>;

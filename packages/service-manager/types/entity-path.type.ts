import { string, z } from "zod";

export const EntityPathSchema = z.object({
  networkLabel: z.string(),
  entityType: z.string(),
  fieldName: z.string(),
  fieldValue: z.string(),
});

export type EntityPath = z.infer<typeof EntityPathSchema>;

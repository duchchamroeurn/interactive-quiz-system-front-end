import { z } from 'zod';

export const successResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) => {
  return z.object({
    success: z.boolean(),
    data: dataSchema,
    message: z.string().optional(),
    timestamp: z.string(),
  });
};
export type SuccessResponse<T> = z.infer<ReturnType<typeof successResponseSchema<z.ZodType<T>>>>

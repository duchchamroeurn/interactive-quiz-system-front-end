import { z } from 'zod';

export const successResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) => {
  return z.object({
    success: z.boolean(),
    data: dataSchema,
    message: z.string(),
    timestamp: z.string(),
  });
};
export type SuccessResponse<T> = z.infer<ReturnType<typeof successResponseSchema<z.ZodType<T>>>>;


export const successPageResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) => {
  return z.object({
    success: z.boolean(),
    data: z.array(dataSchema),
    page: z.number(),
    totalElements: z.number(),
    totalPages: z.number(),
    timestamp: z.string(),
  });
};

export type SuccessPageResponse<T> = z.infer<ReturnType<typeof successPageResponseSchema<z.ZodType<T>>>>;

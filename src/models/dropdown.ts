import { z } from 'zod';

export const dropdownSchema = z.object({
  value: z.string().uuid(),
  title: z.string(),
});

export type Dropdown = z.infer<typeof dropdownSchema>;

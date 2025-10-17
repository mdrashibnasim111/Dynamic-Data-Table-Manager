import { z } from "zod"

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  age: z.number(),
  role: z.string(),
  department: z.string().optional(),
  location: z.string().optional(),
  gender: z.string().optional(),
  city: z.string().optional(),
  income: z.number().optional(),
  occupation: z.string().optional(),
  yearsOfExperience: z.number().optional(),
})

export type User = z.infer<typeof userSchema>

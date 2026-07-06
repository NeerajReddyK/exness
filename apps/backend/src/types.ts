import z from "zod";

export const signInSchema = z.object({
  email: z.email(),
  password: z.string(),
  name: z.string(),
});

export const logInSchema = z.object({
  email: z.email(),
  password: z.string(),
});

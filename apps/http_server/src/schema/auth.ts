import z from "zod";

export const signUpSchema = z.object({
  email: z.email(),
  password: z.string(),
  name: z.string(),
});

export const singInSchema = z.object({
  email: z.email(),
  password: z.string(),
});

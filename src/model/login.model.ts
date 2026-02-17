import z from 'zod';

export const loginUserRequestSchema = z.object({
  username: z.string().max(50).min(3),
  password: z.string().max(50).min(3),
});

export type LoginUserRequest = z.infer<typeof loginUserRequestSchema>;

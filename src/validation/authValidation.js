import {z} from "zod";

export const createUserValidation = z.object({
    name: z.string().min(3).max(30),
    email: z.string().email(),
    password: z.string().min(8).max(30).regex(/[0-9]/).regex(/[A-Z]/),
})

export const getUserValidation = z.object({
    email: z.string().email(),
    password: z.string().min(8).max(30).regex(/[0-9]/).regex(/[A-Z]/)
})
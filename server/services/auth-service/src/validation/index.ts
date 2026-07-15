import {  z } from "zod"


export const SignUpSchema = z.object({
    name: z.string().min(3),
    email: z.email().min(3),
    password: z.string().min(6)
})
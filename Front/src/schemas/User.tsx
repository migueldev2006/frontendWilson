import { z } from 'zod'

export const UserUpdateSchema = z.object({
    id_usuario: z
        .number(),
    nombre: z
        .string()
        .min(1, { message: "Nombre es requerido" })
        .min(3, { message: "Longitud minima de 3" }),

    apellido: z
        .string()
        .min(1, { message: "Apellido es requerido" })
        .min(3, { message: "Longitud minima de 3" }),
    edad: z
        .number({ message: "Edad es requerida y debe ser un numero" }),

    telefono: z
        .string({ required_error: "Telefono es requerido" })
        .min(1, { message: "Longitud minima de 1" }),

    correo: z
        .string()
        .email({ message: "Correo es requerido" }),
    cargo: z
        .string({ required_error: "Cargo es requerido" }),
})

export type UserUpdate = z.infer<typeof UserUpdateSchema>

export const UserSchema = z.object({
    id_usuario: z
        .number()
        .optional(),
    documento: z
        .number({ message: "Documento es requerido y debe ser un numero" })
        .min(10, { message: "Longitud minima de 10" }),

    nombre: z
        .string()
        .min(1, { message: "Nombre es requerido" })
        .min(3, { message: "Longitud minima de 3" }),

    apellido: z
        .string({ required_error: "Apellido es requerido" })
        .min(3, { message: "Longitud minima de 3" }),
    edad: z
        .number({ message: "Edad es requerido" })
        .min(1, { message: "Longitud minima de 1" }),

    telefono: z
        .string({ required_error: "Telefono es requerido" })
        .min(10, { message: "Longitud minima de 10" }),

    correo: z
        .string()
        .email({ message: "Correo es requerido" }),

    estado: z
        .boolean({ required_error: "Estado es requerido" }),
    cargo: z
        .string({ required_error: "Cargo es requerido" }),
    password: z
        .string({ required_error: "Contraseña es requerido" }),
    fk_rol: z
        .number({ required_error: "Rol es requerido" })
})

export type User = z.infer<typeof UserSchema>


export const LoginSchema = z.object({
    documento: z
        .number({ message: "Documento es requerido y debe ser un numero" })
        .min(10, { message: "Longitud minima de 10" }),
    password: z
        .string({ required_error: "Contraseña es requerido" }),
})


export type Credenciales = z.infer<typeof LoginSchema>


export const tokenSchema = z.object({
    token: z
        .string({ message: "Token es requerido" })
        .optional(),
    documento: z
        .number({ message: "Documento es requerido y debe ser un numero" })
        .min(10, { message: "Longitud minima de 10" }),
    password: z
        .string({ required_error: "Contraseña es requerido" }),
})


export type LoginRes =z.infer<typeof tokenSchema>
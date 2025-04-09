import {z} from 'zod'

export const UserSchema = z.object({
    documento: z
        .number({required_error:"Documento es requerido"})
        .min(10,{message:"Longitud minima de 10"}),

    nombre: z
        .string({required_error:"Nombre es requerido"})
        .min(3,{message:"Longitud minima de 3"}),

    apellido: z
        .string({required_error:"Apellido es requerido"})
        .min(3,{message:"Longitud minima de 3"}),
    edad: z
        .number({required_error:"Edad es requerido"})
        .min(1,{message:"Longitud minima de 1"}),

    telefono: z
        .number({required_error:"Telefono es requerido"})
        .min(1,{message:"Longitud minima de 1"}),

    correo: z
        .string()
        .email({message:"Correo es requerido"}),
      
    estado: z
        .boolean({required_error:"Estado es requerido"}),
    cargo: z
        .string({required_error:"Cargo es requerido"}),
    fk_rol: z
        .number({required_error:"Rol es requerido"})
})

export type User = z.infer<typeof UserSchema>
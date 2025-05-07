import {z} from 'zod'

export const PermisoUpdateSchema = z.object({
    id_permiso:z.number().optional(),

    permiso:z.string().min(1, {message:"Nombre es  requerido"}).min(3,{message:"Debe contener como mimimo 3 caracteres"}),

    estado:z.boolean({required_error:"Estado es requerido"}),

    fk_modulo:z.number({required_error:"Modulo es requerido"})
})

export type PermisoUpdate = z.infer<typeof PermisoUpdateSchema> 

export const PermisoCreateSchema = z.object({

    permiso:z.string().min(1, {message:"Nombre es  requerido"}).min(3,{message:"Debe contener como mimimo 3 caracteres"}),

    estado:z.boolean({required_error:"Estado es requerido"}),

    fk_modulo:z.number({required_error:"Modulo es requerido"})
})
export type PermisoCreate = z.infer<typeof PermisoCreateSchema>
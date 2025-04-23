import { z } from "zod";

export const MunicipioSchema = z.object({
    id_municipio : z.number().optional(),
    nombre : z.string().min(1,{message : "Es necesario un nombre"}).min(3,"Mínimo 3 caracteres"),
    departamento : z.string() .min(1,{message:"Departamento es requerido"}).min(3,{message:"Longitud minima de 3"}),
    estado : z.boolean().default(true),
    created_at : z.string().default("") 
})

export type Municipio = z.infer<typeof MunicipioSchema>;

export const MunicipioUpdSchema = z.object({
    id_municipio : z.number().optional(),
    nombre : z.string().min(1,{message : "Es necesario un nombre"}).min(3,"Mínimo 3 caracteres"),
    departamento : z.string() .min(1,{message:"Departamento es requerido"}).min(3,{message:"Longitud minima de 3"}),
})
export type MunicipioUpdate = z.infer<typeof MunicipioUpdSchema>;

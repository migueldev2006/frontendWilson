export type Verificacion = {
    id_verificacion:number
    persona_encargada:string
    persona_asignada:string
    hora_ingreso:string
    hora_salida:string
    observaciones:string
    created_at:string;
    updated_at:string;
    fk_sitio:number
}
export type Sitios = {
    id_sitio?: number;
    nombre: string;
    persona_encargada: string;
    ubicacion: string;
    estado: boolean;
    created_at?:string;
    updated_at?:string;
    fk_tipo_sitio: number;
    fk_area: number;
}
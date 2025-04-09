export type Sitios = {
    id_sitio: number;
    nombre: string;
    persona_encargada: string;
    ubicacion: string;
    estado: boolean;
    fk_tipo_sitio: number;
    fk_area: number;
}
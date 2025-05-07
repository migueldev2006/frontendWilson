import { axiosAPI } from "../axiosAPI";

export interface ElementoPutData {
    id_elemento?: number;
    nombre: string;
    descripcion: string;
    valor: number;
    perecedero: boolean;
    no_perecedero: boolean;
    estado: boolean;
    imagen_elemento?: string | File | undefined;
    created_at?: string;
    updated_at?: string;
    fk_unidad_medida: number;
    fk_categoria: number;
}

export async function putElemento(id:number, data:ElementoPutData):Promise<any> {
    const formData = new FormData();
    formData.append('nombre', data.nombre);
    formData.append('descripcion', data.descripcion);
    formData.append('valor', data.valor.toString());
    formData.append('perecedero', data.perecedero.toString());
    formData.append('no_perecedero', data.no_perecedero.toString());
    formData.append('estado', data.estado.toString());
    formData.append('fk_unidad_medida', data.fk_unidad_medida.toString());
    formData.append('fk_categoria', data.fk_categoria.toString());
    if (data.imagen_elemento) {
        formData.append('imagen_elemento', data.imagen_elemento);
    }
    const res = await axiosAPI.post(`elemento/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return res.data;
}
import { axiosAPI } from "../axiosAPI";

export interface ElementoPostData {
  nombre: string;
  descripcion: string;
  valor: number;
  perecedero: boolean;
  no_perecedero: boolean;
  estado: boolean;
  fecha_vencimiento?: string;
  fecha_uso: string;
  imagen_elemento?: string | File;
  fk_unidad_medida: number;
  fk_categoria: number;
}

export async function postElemento(
  data: ElementoPostData
): Promise<{ id_elemento: number }> {
  const formData = new FormData();
  formData.append("nombre", data.nombre);
  formData.append("descripcion", data.descripcion);
  formData.append("valor", data.valor.toString());
  formData.append("perecedero", data.perecedero.toString());
  formData.append("no_perecedero", data.no_perecedero.toString());
  formData.append("estado", data.estado.toString());
  if (data.fecha_vencimiento) {
    formData.append("fecha_vencimiento", data.fecha_vencimiento.toString());
  }
  formData.append("fecha_uso", data.fecha_uso.toString());
  formData.append("fk_unidad_medida", data.fk_unidad_medida.toString());
  formData.append("fk_categoria", data.fk_categoria.toString());
  if (data.imagen_elemento) {
    formData.append("imagen_elemento", data.imagen_elemento);
  }

  const res = await axiosAPI.post("elemento", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  const id = res.data?.id_elemento;

  if (typeof id !== "number") {
    throw new Error("La respuesta del backend no contiene un id válido");
  }

  return { id_elemento: id };
}

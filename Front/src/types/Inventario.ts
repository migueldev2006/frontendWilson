export type Inventario = {
  id_inventario?: number;
  stock?: number;
  estado: boolean;
  created_at?:string;
  updated_at?:string;
  fk_sitio: number;
  fk_elemento: number;
  imagen_elemento?:string;
};


export type ReporteInventario = {
  id_elemento: number;
  nombre_elemento: string;
  nombre_categoria: string;
  cantidad: number;
  unidad_medida: string;
  nombre_sede: string;
  nombre_sitio: string;
};

export type ReporteAreaConMasElementos = {
  id_area: number;
  nombre_area: string;
  total_elementos: number;
};

export type ReporteCantidadElementosPorArea = {
  nombre_area: string;
  cantidad: number;
};

export type ReporteElementosPorAgotarse = {
  id_elemento: number;
  nombre_elemento: string;
  stock: number;
};
export type Elemento = {
  id_elemento: number;
  nombre: string;
  descripcion: string;
  valor: number;
  perecedero: boolean;
  no_perecedero: boolean;
  estado: boolean;
  imagen_elemento: string | File;
  created_at: string;
  updated_at: string;
  fk_unidad_medida: number;
  fk_categoria: number;
  fk_caracteristica: number;
  tipo_elemento: string;
};

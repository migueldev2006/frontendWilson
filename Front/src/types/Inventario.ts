export type Inventario = {
  id_inventario: number;
  stock: number;
  estado: boolean;
  created_at:string;
  updated_at:string;
  fk_sitio: number;
  fk_elemento: number;
  imagen_elemento:string;
};

export type InventarioItem = {
  sitio: string;
  elemento: string;
  stock: number;
};

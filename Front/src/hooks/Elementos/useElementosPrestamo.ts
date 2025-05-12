// hooks/Usuarios/useElementosPrestamo.ts
import { useQuery } from "@tanstack/react-query";
import axios from "axios";


export type ElementoPrestamo = {
  id_movimiento: number;
  nombre_usuario: string;
  documento: number;
  nombre_elemento: string;
  descripcion_elemento: string;
  cantidad: number;
  fecha_salida: string;
    created_at: string;
};

export default function useElementosPrestamo() {
  return useQuery<ElementoPrestamo[]>({
    queryKey: ["elementosPrestamo"],
    queryFn: async () => {
      const { data } = await axios.get("/elemento/EstadoPrestamo");
      return data;
    },
  });
}

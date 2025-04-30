import { useQuery } from "@tanstack/react-query";
import { axiosAPI } from "@/axios/axiosAPI";
import { MovimientoMes } from "@/types/Movimiento";


export const useMovimientosPorMes = () => {
  const url = "/movimiento/mensuales";

  const { data, isLoading, isError, error } = useQuery<MovimientoMes[]>({
    queryKey: ["movimientos-por-mes"],
    queryFn: async () => {
      const res = await axiosAPI.get(url);
      return res.data;
    },
  });

  return {
    movimientosMes: data ,
    isLoading,
    isError,
    error,
  };
};

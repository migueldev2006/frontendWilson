import { useQuery } from "@tanstack/react-query";
import { axiosAPI } from "@/axios/axiosAPI";
import { MovimientoMasUsados } from "@/types/Movimiento";


export const useMasUsados = () => {
    const url = "/movimiento/materiales";


    const { data, isLoading, isError, error } = useQuery<MovimientoMasUsados[]>({
        queryKey: ["movimientos-top-elementos"],
        queryFn: async () => {
            const res = await axiosAPI.get(url);
            return res.data;
        },
    });

    return {
        topElementos: data,
        isLoading,
        isError,
        error,
    };
}
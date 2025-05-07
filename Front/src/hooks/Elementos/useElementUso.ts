import { useQuery } from "@tanstack/react-query";
import { axiosAPI } from "@/axios/axiosAPI";
import { ElementUso } from "@/types/Elemento";

export const useElementUso = () => {
    const url = "/elemento/usos";


    const { data, isLoading, isError, error } = useQuery<ElementUso[]>({
        queryKey: ["elementuso"],
        queryFn: async () => {
            const res = await axiosAPI.get(url);
            return res.data;
        },
    });

    return {
        elementUso: data,
        isLoading,
        isError,
        error,
    };
}
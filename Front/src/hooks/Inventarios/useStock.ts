import { useQuery } from "@tanstack/react-query";
import { axiosAPI } from "@/axios/axiosAPI";
import { InventarioItem } from "@/types/Inventario";



export const useInventariosStock = () => {


  const url = "inventario/stock";

  const { data, isLoading, isError, error } = useQuery<InventarioItem[]>({
    queryKey: ["inventarios"],
    queryFn: async () => {
      const res = await axiosAPI.get(url);
      return res.data;
    },
  });

  return {
    stock: data,
    isLoading,
    isError,
    error
  }

}



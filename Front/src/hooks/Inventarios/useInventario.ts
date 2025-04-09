import { axiosAPI } from "@/axios/axiosAPI";
import { Inventario } from "@/types/Inventario";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useInventario() {
  const queryClient = useQueryClient();

  const url = "inventario";

  const { data, isLoading, isError, error } = useQuery<Inventario[]>({
    queryKey: ["inventarios"],
    queryFn: async () => {
      const res = await axiosAPI.get(url);
      return res.data;
    },
  });

  const addInventarioMutation = useMutation({
    mutationFn: async (newInventario: Inventario) => {
      await axiosAPI.post<Inventario>(url, newInventario);
      return newInventario;
    },
    onSuccess: (inventario) => {
      console.log(inventario);
      queryClient.setQueryData<Inventario[]>(["inventarios"], (oldData) =>
        oldData ? [...oldData, inventario] : [inventario]
      );
    },
    onError: (error) => {
      console.log("Error al cargar el inventario", error);
    },
  });

  const getInventarioById = (
    id: number,
    inventarios: Inventario[] | undefined = data
  ): Inventario | null => {
    return inventarios?.find((inventario) => inventario.id_inventario === id) || null;
  };

  const updateInventarioMutation = useMutation({
    mutationFn: async ({
      id,
      update,
    }: {
      id: number;
      update: Partial<Inventario>;
    }) => {
      await axiosAPI.put<Inventario>(`${url}/${id}`, update);
      return { id, update };
    },
    onSuccess: ({ id, update }) => {
      console.log("dato 1: ", id, " dato 2: ", update);
      queryClient.setQueryData<Inventario[]>(["inventarios"], (oldData) =>
        oldData
          ? oldData.map((inventario) =>
              inventario.id_inventario === id
                ? { ...inventario, ...update }
                : inventario
            )
          : []
      );
    },

    onError: (error) => {
      console.error("Error al actualizar:", error);
    },
  });

  const changeStateMutation = useMutation({
    mutationFn: async (id_inventario: number) => {
      await axiosAPI.put<Inventario>(`inventario/CambiarEstado/${id_inventario}`);
      return id_inventario;
    },

    onSuccess: (id_inventario: number) => {
      queryClient.setQueryData<Inventario[]>(["inventarios"], (oldData) =>
        oldData
          ? oldData.map((inventario: Inventario) =>
              inventario.id_inventario == id_inventario
                ? { ...inventario, estado: !inventario.estado }
                : inventario
            )
          : []
      );
    },

    onError: (error) => {
      console.error("Error al actualizar estado:", error);
    },
  });

  const addInventario = async (inventario: Inventario) => {
    return addInventarioMutation.mutateAsync(inventario);
  };

  const updateInventario = async (id: number, update: Partial<Inventario>) => {
    return updateInventarioMutation.mutateAsync({ id, update });
  };

  const changeState = async (id_inventario: number) => {
    return changeStateMutation.mutateAsync(id_inventario);
  };

  return {
    inventarios: data,
    isLoading,
    isError,
    error,
    addInventario,
    changeState,
    getInventarioById,
    updateInventario,
  };
}

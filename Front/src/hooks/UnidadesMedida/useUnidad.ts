import { axiosAPI } from "@/axios/axiosAPI";
import { Unidad } from "@/types/Unidad";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useUnidad() {
  const queryClient = useQueryClient();

  const url = "unidad";

  const { data, isLoading, isError, error } = useQuery<Unidad[]>({
    queryKey: ["unidades"],
    queryFn: async () => {
      const res = await axiosAPI.get(url);
      return res.data;
    },
  });

  const addUnidadMutation = useMutation({
    mutationFn: async (newUnidad: Unidad) => {
      await axiosAPI.post<Unidad>(url, newUnidad);
      return newUnidad;
    },
    onSuccess: (unidad) => {
      console.log(unidad);
      queryClient.setQueryData<Unidad[]>(["unidades"], (oldData) =>
        oldData ? [...oldData, unidad] : [unidad]
      );
    },
    onError: (error) => {
      console.log("Error al cargar el unidad", error);
    },
  });

  const getUnidadById = (
    id: number,
    unidades: Unidad[] | undefined = data
  ): Unidad | null => {
    return unidades?.find((unidad) => unidad.id_unidad === id) || null;
  };

  const updateUnidadMutation = useMutation({
    mutationFn: async ({
      id,
      update,
    }: {
      id: number;
      update: Partial<Unidad>;
    }) => {
      await axiosAPI.put<Unidad>(`${url}/${id}`, update);
      return { id, update };
    },
    onSuccess: ({ id, update }) => {
      console.log("dato 1: ", id, " dato 2: ", update);
      queryClient.setQueryData<Unidad[]>(["unidades"], (oldData) =>
        oldData
          ? oldData.map((unidad) =>
              unidad.id_unidad === id
                ? { ...unidad, ...update }
                : unidad
            )
          : []
      );
    },

    onError: (error) => {
      console.error("Error al actualizar:", error);
    },
  });

  const changeStateMutation = useMutation({
    mutationFn: async (id_unidad: number) => {
      await axiosAPI.put<Unidad>(`unidad/cambiarEstado/${id_unidad}`);
      return id_unidad;
    },

    onSuccess: (id_unidad: number) => {
      queryClient.setQueryData<Unidad[]>(["unidades"], (oldData) =>
        oldData
          ? oldData.map((unidad: Unidad) =>
              unidad.id_unidad == id_unidad
                ? { ...unidad, estado: !unidad.estado }
                : unidad
            )
          : []
      );
    },

    onError: (error) => {
      console.error("Error al actualizar estado:", error);
    },
  });

  const addUnidad = async (unidad: Unidad) => {
    return addUnidadMutation.mutateAsync(unidad);
  };

  const updateUnidad = async (id: number, update: Partial<Unidad>) => {
    return updateUnidadMutation.mutateAsync({ id, update });
  };

  const changeState = async (id_unidad: number) => {
    return changeStateMutation.mutateAsync(id_unidad);
  };

  return {
    unidades: data,
    isLoading,
    isError,
    error,
    addUnidad,
    changeState,
    getUnidadById,
    updateUnidad,
  };
}

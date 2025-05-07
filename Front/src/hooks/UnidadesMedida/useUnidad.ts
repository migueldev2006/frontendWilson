import { deleteUnidad } from "@/axios/UnidadesMedida/deleteUnidad";
import { getUnidad } from "@/axios/UnidadesMedida/getUnidad";
import { postUnidad } from "@/axios/UnidadesMedida/postUnidad";
import { putUnidad } from "@/axios/UnidadesMedida/putUnidad";
import { Unidad } from "@/types/Unidad";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useUnidad() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery<Unidad[]>({
    queryKey: ["unidades"],
    queryFn: getUnidad,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });

  const addUnidadMutation = useMutation({
    mutationFn: postUnidad,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["unidades"],
      });
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
    mutationFn: ({ id, data }: { id: number; data: Unidad }) =>
      putUnidad(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["unidades"],
      });
    },

    onError: (error) => {
      console.error("Error al actualizar:", error);
    },
  });

  const changeStateMutation = useMutation({
    mutationFn: deleteUnidad,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["unidades"],
      });
    },

    onError: (error) => {
      console.error("Error al actualizar estado:", error);
    },
  });

  const addUnidad = async (unidad: Unidad) => {
    return addUnidadMutation.mutateAsync(unidad);
  };

  const updateUnidad = async (id: number, data: Unidad) => {
    return updateUnidadMutation.mutateAsync({ id, data });
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

import { deleteFicha } from "@/axios/Fichas/deleteFicha";
import { getFicha } from "@/axios/Fichas/getFicha";
import { postFicha } from "@/axios/Fichas/postFicha";
import { putFicha } from "@/axios/Fichas/putFicha";
import { Ficha } from "@/types/Ficha";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useFichas() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery<Ficha[]>({
    queryKey: ["ficha"],
    queryFn:getFicha,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });

  const addFichasMutation = useMutation({
    mutationFn: postFicha,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["ficha"],
      });
    },
    onError: (error) => {
      console.log("Error al cargar la Ficha", error);
    },
  });

  const getFichaById = (
    id: number,
    Ficha: Ficha[] | undefined = data
  ): Ficha | null => {
    return Ficha?.find((Ficha) => Ficha.id_ficha === id) || null;
  };

  const updateAreaMutation = useMutation({
    mutationFn: ({id, data}:{id:number, data:Ficha}) => putFicha(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["ficha"],
      });
    },

    onError: (error) => {
      console.error("Error al actualizar:", error);
    },
  });

  const changeStateMutation = useMutation({
    mutationFn: deleteFicha,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["ficha"],
      });
    },

    onError: (error) => {
      console.error("Error al actualizar estado:", error);
    },
  });

  const addFicha = async (ficha: Ficha) => {
    return addFichasMutation.mutateAsync(ficha);
  };

  const updateFicha = async (id: number, data: Ficha) => {
    return updateAreaMutation.mutateAsync({ id, data });
  };

  const changeState = async (id_ficha:number) => {
    return changeStateMutation.mutateAsync(id_ficha);
  };

  return {
    fichas: data,
    isLoading,
    isError,
    error,
    addFicha,
    changeState,
    getFichaById,
    updateFicha,
  };
}

import { deleteSede } from "@/axios/Sedes/deleteSede";
import { getSede } from "@/axios/Sedes/getSede";
import { postSede } from "@/axios/Sedes/postSede";
import { putSede } from "@/axios/Sedes/putSede";
import { Sede } from "@/types/sedes";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useSede() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery<Sede[]>({
    queryKey: ["sedes"],
    queryFn: getSede,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });

  const addSedeMutation = useMutation({
    mutationFn: postSede,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["sedes"],
      });
    },
    onError: (error) => {
      console.log("Error al cargar la sede", error);
    },
  });

  const getSedeById = (
    id: number,
    sedes: Sede[] | undefined = data
  ): Sede | null => {
    return sedes?.find((sede) => sede.id_sede === id) || null;
  };

  const updateSedesMutation = useMutation({
    mutationFn: ({id,data}:{id: number, data: Sede; }) =>putSede(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["sedes"],
      });
    },

    onError: (error) => {
      console.error("Error al actualizar:", error);
    },
  });

  const changeStateMutation = useMutation({
    mutationFn:deleteSede,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["sedes"],
      });
    },

    onError: (error) => {
      console.error("Error al actualizar estado:", error);
    },
  });

  const addSede = async (sede: Sede) => {
    return addSedeMutation.mutateAsync(sede);
  };

  const updateSede = async (id: number, data:Sede) => {
    return updateSedesMutation.mutateAsync({ id, data });
  };

  const changeState = async (id_sede: number) => {
    return changeStateMutation.mutateAsync(id_sede);
  };

  return {
    sede: data,
    isLoading,
    isError,
    error,
    addSede,
    changeState,
    getSedeById,
    updateSede,
  };
}

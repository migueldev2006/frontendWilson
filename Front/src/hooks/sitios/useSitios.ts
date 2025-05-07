import { deleteSitio } from "@/axios/Sitios/deleteSitio";
import { getSitio } from "@/axios/Sitios/getSitio";
import { postSitio } from "@/axios/Sitios/postSitio";
import { putSitio } from "@/axios/Sitios/putSitio";
import { Sitios } from "@/types/sitios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useSitios() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery<Sitios[]>({
    queryKey: ["sitios"],
    queryFn:getSitio,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });

  const addSitioMutation = useMutation({
    mutationFn: postSitio,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["sitios"],
      });
    },
    onError: (error) => {
      console.log("Error al cargar el sitio", error);
    },
  });

  const getSitioById = (
    id: number,
    sitios: Sitios[] | undefined = data
  ): Sitios | null => {
    return sitios?.find((sitio) => sitio.id_sitio === id) || null;
  };

  const updateSitioMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Sitios }) => putSitio(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["sitios"],
      });
    },

    onError: (error) => {
      console.error("Error al actualizar:", error);
    },
  });

  const changeStateMutation = useMutation({
    mutationFn: deleteSitio,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["sitios"],
      });
    },

    onError: (error) => {
      console.error("Error al actualizar estado:", error);
    },
  });

  const addSitio = async (sitio: Sitios) => {
    return addSitioMutation.mutateAsync(sitio);
  };

  const updateSitio = async (id: number, data: Sitios) => {
    return updateSitioMutation.mutateAsync({ id, data });
  };

  const changeState = async (id_sitio: number) => {
    return changeStateMutation.mutateAsync(id_sitio);
  };

  return {
    sitios: data,
    isLoading,
    isError,
    error,
    addSitio,
    changeState,
    getSitioById,
    updateSitio,
  };
}

import { deleteTipo } from "@/axios/TiposMovimiento/deleteTipo";
import { getTipo } from "@/axios/TiposMovimiento/getTipo";
import { postTipo } from "@/axios/TiposMovimiento/postTipo";
import { putTipo } from "@/axios/TiposMovimiento/putTipo";
import { TipoMovimiento } from "@/types/TipoMovimiento";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useTipoMovimiento() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery<TipoMovimiento[]>({
    queryKey: ["tipos"],
    queryFn: getTipo,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });

  const addTipoMutation = useMutation({
    mutationFn: postTipo,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tipos"],
      });
    },
    onError: (error) => {
      console.log("Error al cargar el tipo de movimiento", error);
    },
  });

  const getTipoMovimientoById = (
    id: number,
    tipos: TipoMovimiento[] | undefined = data
  ): TipoMovimiento | null => {
    return tipos?.find((tipo) => tipo.id_tipo === id) || null;
  };

  const updateTipoMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: TipoMovimiento }) => putTipo(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tipos"],
      });
    },

    onError: (error) => {
      console.error("Error al actualizar:", error);
    },
  });

  const changeStateMutation = useMutation({
    mutationFn: deleteTipo,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tipos"],
      });
    },

    onError: (error) => {
      console.error("Error al actualizar estado:", error);
    },
  });

  const addTipoMovimiento = async (tipoMovimiento: TipoMovimiento) => {
    return addTipoMutation.mutateAsync(tipoMovimiento);
  };

  const updateTipoMovimiento = async (id: number, data: TipoMovimiento) => {
    return updateTipoMutation.mutateAsync({ id, data });
  };

  const changeState = async (id_tipo: number) => {
    return changeStateMutation.mutateAsync(id_tipo);
  };

  return {
    tipos: data,
    isLoading,
    isError,
    error,
    addTipoMovimiento,
    changeState,
    getTipoMovimientoById,
    updateTipoMovimiento,
  };
}

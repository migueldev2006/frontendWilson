import { getMovimiento } from "@/axios/Movimentos/getMovimento";
import { postMovimiento } from "@/axios/Movimentos/postMovimiento";
import { putMovimiento } from "@/axios/Movimentos/putMovimiento";
import { Movimiento } from "@/types/Movimiento";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useMovimiento() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery<Movimiento[]>({
    queryKey: ["movimientos"],
    queryFn: getMovimiento,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });

  const addMovimientoMutation = useMutation({
    mutationFn: postMovimiento,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["movimientos"],
      });
    },
    onError: (error) => {
      console.log("Error al cargar el movimiento", error);
    },
  });

  const getMovimientoById = (
    id: number,
    movimientos: Movimiento[] | undefined = data
  ): Movimiento | null => {
    return (
      movimientos?.find((movimiento) => movimiento.id_movimiento === id) || null
    );
  };

  const updateMovimientoMutation = useMutation({
    mutationFn: ({id, data}:{id:number, data:Movimiento}) => putMovimiento(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["movimientos"],
      });
    },

    onError: (error) => {
      console.error("Error al actualizar:", error);
    },
  });

  //   const changeStateMutation = useMutation({
  //     mutationFn: async (id_movimiento: number) => {
  //       await axiosAPI.put<Movimiento>(`elemento/estado/${id_movimiento}`);
  //       return id_movimiento;
  //     },

  //     onSuccess: (id_movimiento: number) => {
  //       queryClient.setQueryData<Movimiento[]>(["elementos"], (oldData) =>
  //         oldData
  //           ? oldData.map((elemento: Movimiento) =>
  //               elemento.id_movimiento == id_movimiento
  //                 ? { ...elemento, estado: !elemento.estado }
  //                 : elemento
  //             )
  //           : []
  //       );
  //     },

  //     onError: (error) => {
  //       console.error("Error al actualizar estado:", error);
  //     },
  //   });

  const addMovimiento = async (movimiento: Movimiento) => {
    return addMovimientoMutation.mutateAsync(movimiento);
  };

  const updateMovimiento = async (id: number, data: Movimiento) => {
    return updateMovimientoMutation.mutateAsync({ id, data });
  };

  //   const changeState = async (id_movimiento: number) => {
  //     return changeStateMutation.mutateAsync(id_movimiento);
  //   };

  return {
    movimientos: data,
    isLoading,
    isError,
    error,
    addMovimiento,
    // changeState,
    getMovimientoById,
    updateMovimiento,
  };
}

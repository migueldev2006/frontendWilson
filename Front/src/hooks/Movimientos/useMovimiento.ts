import { axiosAPI } from "@/axios/axiosAPI";
import { Movimiento } from "@/types/Movimiento";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useMovimiento() {
  const queryClient = useQueryClient();

  const url = "movimiento";

  const { data, isLoading, isError, error } = useQuery<Movimiento[]>({
    queryKey: ["movimientos"],
    queryFn: async () => {
      const res = await axiosAPI.get(url);
      return res.data;
    },
  });

  const addMovimientoMutation = useMutation({
    mutationFn: async (newMovimiento: Movimiento) => {
      await axiosAPI.post<Movimiento>(url, newMovimiento);
      return newMovimiento;
    },
    onSuccess: (movimiento) => {
      console.log(movimiento);
      queryClient.setQueryData<Movimiento[]>(["movimientos"], (oldData) =>
        oldData ? [...oldData, movimiento] : [movimiento]
      );
    },
    onError: (error) => {
      console.log("Error al cargar el movimiento", error);
    },
  });

  const getMovimientoById = (
    id: number,
    movimientos: Movimiento[] | undefined = data
  ): Movimiento | null => {
    return movimientos?.find((movimiento) => movimiento.id_movimiento === id) || null;
  };

  const updateMovimientoMutation = useMutation({
    mutationFn: async ({
      id,
      update,
    }: {
      id: number;
      update: Partial<Movimiento>;
    }) => {
      await axiosAPI.put<Movimiento>(`${url}/${id}`, update);
      return { id, update };
    },
    onSuccess: ({ id, update }) => {
      console.log("dato 1: ", id, " dato 2: ", update);
      queryClient.setQueryData<Movimiento[]>(["movimientos"], (oldData) =>
        oldData
          ? oldData.map((movimiento) =>
              movimiento.id_movimiento === id
                ? { ...movimiento, ...update }
                : movimiento
            )
          : []
      );
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

  const updateMovimiento = async (id: number, update: Partial<Movimiento>) => {
    return updateMovimientoMutation.mutateAsync({ id, update });
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

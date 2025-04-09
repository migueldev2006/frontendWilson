import { axiosAPI } from "@/axios/axiosAPI";
import { Solicitud } from "@/types/Solicitud";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useSolicitud() {
  const queryClient = useQueryClient();

  const url = "solicitud";

  const { data, isLoading, isError, error } = useQuery<Solicitud[]>({
    queryKey: ["solicitudes"],
    queryFn: async () => {
      const res = await axiosAPI.get(url);
      return res.data;
    },
  });

  const addSolicitudMutation = useMutation({
    mutationFn: async (newSolicitud: Solicitud) => {
      await axiosAPI.post<Solicitud>(url, newSolicitud);
      return newSolicitud;
    },
    onSuccess: (solicitud) => {
      console.log(solicitud);
      queryClient.setQueryData<Solicitud[]>(["solicitudes"], (oldData) =>
        oldData ? [...oldData, solicitud] : [solicitud]
      );
    },
    onError: (error) => {
      console.log("Error al cargar la solicitud", error);
    },
  });

  const getSolicitudById = (
    id: number,
    solicitudes: Solicitud[] | undefined = data
  ): Solicitud | null => {
    return solicitudes?.find((solicitud) => solicitud.id_solicitud === id) || null;
  };

  const updateSolicitudMutation = useMutation({
    mutationFn: async ({
      id,
      update,
    }: {
      id: number;
      update: Partial<Solicitud>;
    }) => {
      await axiosAPI.put<Solicitud>(`${url}/${id}`, update);
      return { id, update };
    },
    onSuccess: ({ id, update }) => {
      console.log("dato 1: ", id, " dato 2: ", update);
      queryClient.setQueryData<Solicitud[]>(["solicitudes"], (oldData) =>
        oldData
          ? oldData.map((solicitud) =>
              solicitud.id_solicitud === id
                ? { ...solicitud, ...update }
                : solicitud
            )
          : []
      );
    },

    onError: (error) => {
      console.error("Error al actualizar:", error);
    },
  });

  // const changeStateMutation = useMutation({
  //   mutationFn: async (id_solicitud: number) => {
  //     await axiosAPI.put<Solicitud>(`elemento/estado/${id_solicitud}`);
  //     return id_solicitud;
  //   },

  //   onSuccess: (id_solicitud: number) => {
  //     queryClient.setQueryData<Solicitud[]>(["elementos"], (oldData) =>
  //       oldData
  //         ? oldData.map((elemento: Solicitud) =>
  //             elemento.id_solicitud == id_solicitud
  //               ? { ...elemento, estado: !elemento.estado }
  //               : elemento
  //           )
  //         : []
  //     );
  //   },

  //   onError: (error) => {
  //     console.error("Error al actualizar estado:", error);
  //   },
  // });

  const addSolicitud = async (solicitud: Solicitud) => {
    return addSolicitudMutation.mutateAsync(solicitud);
  };

  const updateSolicitud = async (id: number, update: Partial<Solicitud>) => {
    return updateSolicitudMutation.mutateAsync({ id, update });
  };

  // const changeState = async (id_solicitud: number) => {
  //   return changeStateMutation.mutateAsync(id_solicitud);
  // };

  return {
    solicitudes: data,
    isLoading,
    isError,
    error,
    addSolicitud,
    // changeState,
    getSolicitudById,
    updateSolicitud,
  };
}

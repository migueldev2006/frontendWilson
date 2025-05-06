import { getSolicitud } from "@/axios/Solicitudes/getSolicitud";
import { postSolicitud } from "@/axios/Solicitudes/postSolicitud";
import { putSolicitud } from "@/axios/Solicitudes/putSolicitud";
import { Solicitud } from "@/types/Solicitud";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useSolicitud() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery<Solicitud[]>({
    queryKey: ["solicitudes"],
    queryFn: getSolicitud,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });

  const addSolicitudMutation = useMutation({
    mutationFn: postSolicitud,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["solicitudes"],
      });
    },
    onError: (error) => {
      console.log("Error al cargar la solicitud", error);
    },
  });

  const getSolicitudById = (
    id: number,
    solicitudes: Solicitud[] | undefined = data
  ): Solicitud | null => {
    return (
      solicitudes?.find((solicitud) => solicitud.id_solicitud === id) || null
    );
  };

  const updateSolicitudMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Solicitud }) => putSolicitud(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["solicitudes"],
      });
    },
    onError: (error) => {
      console.error("Error al actualizar:", error);
    },
  });

  const addSolicitud = async (solicitud: Solicitud) => {
    return addSolicitudMutation.mutateAsync(solicitud);
  };

  const updateSolicitud = async (id: number, data: Solicitud) => {
    return updateSolicitudMutation.mutateAsync({ id, data });
  };

  return {
    solicitudes: data,
    isLoading,
    isError,
    error,
    addSolicitud,
    getSolicitudById,
    updateSolicitud,
  };
}

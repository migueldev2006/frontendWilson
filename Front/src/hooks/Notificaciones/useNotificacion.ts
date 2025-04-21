import { axiosAPI } from "@/axios/axiosAPI";
import { Notificacion } from "@/types/Notificacion";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useNotificaciones() {
  const queryClient = useQueryClient();

  const url = "notificaciones";

  // Obtener las notificaciones
  const { data, isLoading, isError, error } = useQuery<Notificacion[]>({
    queryKey: ["notificaciones"],
    queryFn: async () => {
      const res = await axiosAPI.get(url);
      return res.data;
    },
  });

  // Responder a una notificación (aceptar o rechazar)
  const responderNotificacionMutation = useMutation({
    mutationFn: async ({
      id,
      respuesta,
    }: {
      id: number;
      respuesta: "aceptar" | "cancelar";
    }) => {
      const { data } = await axiosAPI.post(`/notificaciones/${id}`, {
        respuesta,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notificaciones"] });
      queryClient.invalidateQueries({ queryKey: ["movimientos"] });
    },
    onError: (error) => {
      console.error("Error al responder la notificación:", error);
    },
  });
  const aceptarMovimiento = (id: number) => {
    responderNotificacionMutation.mutate({ id, respuesta: "aceptar" });
  };
  
  const cancelarMovimiento = (id: number) => {
    responderNotificacionMutation.mutate({ id, respuesta: "cancelar" });
  };
  
  const aceptarSolicitud = (id: number) => {
    responderNotificacionMutation.mutate({ id, respuesta: "aceptar" });
  };
  
  const cancelarSolicitud = (id: number) => {
    responderNotificacionMutation.mutate({ id, respuesta: "cancelar" });
  };

  // Función para obtener una notificación por su ID
  const getNotificacionById = (id: number, notificaciones: Notificacion[] | undefined = data): Notificacion | null => {
    return notificaciones?.find((notificacion) => notificacion.id_notificacion === id) || null;
  };

  // Función para cambiar el estado de una notificación (aceptada o rechazada)
  const changeNotificacionState = async (id: number, respuesta: "aceptar" | "cancelar") => {
    return responderNotificacionMutation.mutateAsync({ id, respuesta });
  };

  return {
    notificaciones: data,
    isLoading,
    isError,
    error,
    responderNotificacion: responderNotificacionMutation.mutateAsync,
    changeNotificacionState,
    getNotificacionById,
    aceptarMovimiento,
    cancelarMovimiento,
    aceptarSolicitud,
    cancelarSolicitud
  };
  
}

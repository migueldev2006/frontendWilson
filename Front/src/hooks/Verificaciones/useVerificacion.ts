import { axiosAPI } from "@/axios/axiosAPI";
import { Verificacion } from "@/types/Verificacion";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useVerificacion() {
  const queryClient = useQueryClient();

  const url = "verificacion";

  const { data, isLoading, isError, error } = useQuery<Verificacion[]>({
    queryKey: ["verificaciones"],
    queryFn: async () => {
      const res = await axiosAPI.get(url);
      return res.data;
    },
  });

  const getElementosPorSitio = async (id_sitio: number) => {
    const res = await axiosAPI.get(`${url}/${id_sitio}`);
    return res.data;
  };

  const addVerificacionMutation = useMutation({
    mutationFn: async (newVerificacion: Verificacion) => {
      await axiosAPI.post<Verificacion>(url, newVerificacion);
      return newVerificacion;
    },
    onSuccess: (verificacion) => {
      console.log(verificacion);
      queryClient.setQueryData<Verificacion[]>(["verificaciones"], (oldData) =>
        oldData ? [...oldData, verificacion] : [verificacion]
      );
    },
    onError: (error) => {
      console.log("Error al cargar la verifiacion", error);
    },
  });

  const getVerificacionById = (
    id: number,
    verificaciones: Verificacion[] | undefined = data
  ): Verificacion | null => {
    return (
      verificaciones?.find(
        (verificacion) => verificacion.id_verificacion === id
      ) || null
    );
  };

  const updateVerificacionMutation = useMutation({
    mutationFn: async ({
      id,
      update,
    }: {
      id: number;
      update: Partial<Verificacion>;
    }) => {
      await axiosAPI.put<Verificacion>(`${url}/${id}`, update);
      return { id, update };
    },
    onSuccess: ({ id, update }) => {
      console.log("dato 1: ", id, " dato 2: ", update);
      queryClient.setQueryData<Verificacion[]>(["verificaciones"], (oldData) =>
        oldData
          ? oldData.map((verificacion) =>
              verificacion.id_verificacion === id
                ? { ...verificacion, ...update }
                : verificacion
            )
          : []
      );
    },

    onError: (error) => {
      console.error("Error al actualizar:", error);
    },
  });


  const addVerificacion = async (usuario: Verificacion) => {
    return addVerificacionMutation.mutateAsync(usuario);
  };

  const updateVerificacion = async (
    id: number,
    update: Partial<Verificacion>
  ) => {
    return updateVerificacionMutation.mutateAsync({ id, update });
  };

  return {
    verificaciones: data,
    isLoading,
    isError,
    error,
    addVerificacion,
    getVerificacionById,
    updateVerificacion,
    getElementosPorSitio
  };
}

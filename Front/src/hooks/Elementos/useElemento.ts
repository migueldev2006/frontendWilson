import { axiosAPI } from "@/axios/axiosAPI";
import { Elemento } from "@/types/Elemento";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useElemento() {
  const queryClient = useQueryClient();

  const url = "elemento";

  const { data, isLoading, isError, error } = useQuery<Elemento[]>({
    queryKey: ["elementos"],
    queryFn: async () => {
      const res = await axiosAPI.get(url);
      return res.data;
    },
  });

  const addElementoMutation = useMutation({
    mutationFn: async (newElemento: Elemento) => {
      await axiosAPI.post<Elemento>(url, newElemento);
      return newElemento;
    },
    onSuccess: (elemento) => {
      console.log(elemento);
      queryClient.setQueryData<Elemento[]>(["elementos"], (oldData) =>
        oldData ? [...oldData, elemento] : [elemento]
      );
    },
    onError: (error) => {
      console.log("Error al cargar el elemento", error);
    },
  });

  const getElementoById = (
    id: number,
    elementos: Elemento[] | undefined = data
  ): Elemento | null => {
    return elementos?.find((elemento) => elemento.id_elemento === id) || null;
  };

  const updateElementoMutation = useMutation({
    mutationFn: async ({
      id,
      update,
    }: {
      id: number;
      update: Partial<Elemento>;
    }) => {
      await axiosAPI.put<Elemento>(`${url}/${id}`, update);
      return { id, update };
    },
    onSuccess: ({ id, update }) => {
      console.log("dato 1: ", id, " dato 2: ", update);
      queryClient.setQueryData<Elemento[]>(["elementos"], (oldData) =>
        oldData
          ? oldData.map((elemento) =>
              elemento.id_elemento === id
                ? { ...elemento, ...update }
                : elemento
            )
          : []
      );
    },

    onError: (error) => {
      console.error("Error al actualizar:", error);
    },
  });

  const changeStateMutation = useMutation({
    mutationFn: async (id_elemento: number) => {
      await axiosAPI.put<Elemento>(`elemento/cambiarEstado/${id_elemento}`);
      return id_elemento;
    },

    onSuccess: (id_elemento: number) => {
      queryClient.setQueryData<Elemento[]>(["elementos"], (oldData) =>
        oldData
          ? oldData.map((elemento: Elemento) =>
              elemento.id_elemento == id_elemento
                ? { ...elemento, estado: !elemento.estado }
                : elemento
            )
          : []
      );
    },

    onError: (error) => {
      console.error("Error al actualizar estado:", error);
    },
  });

  const addElemento = async (elemento: Elemento) => {
    return addElementoMutation.mutateAsync(elemento);
  };

  const updateElemento = async (id: number, update: Partial<Elemento>) => {
    return updateElementoMutation.mutateAsync({ id, update });
  };

  const changeState = async (id_elemento: number) => {
    return changeStateMutation.mutateAsync(id_elemento);
  };

  return {
    elementos: data,
    isLoading,
    isError,
    error,
    addElemento,
    changeState,
    getElementoById,
    updateElemento,
  };
}

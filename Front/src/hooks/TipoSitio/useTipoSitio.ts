import { axiosAPI } from '@/axios/axiosAPI';
import { TipoSitio } from '@/schemas/TipoSitio'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useTipoSitio() {

    const queryClient = useQueryClient();

    const url = 'tipoSitio';

    const { data, isLoading, isError, error } = useQuery<TipoSitio[]>({
        queryKey: ["tipoSitio"],
        queryFn: async () => {
            const res = await axiosAPI.get(url);
            return res.data;
        }
    });

    const addTipoMutation = useMutation({
        mutationFn: async(newTipo: TipoSitio) => {
            await axiosAPI.post<TipoSitio>(url, newTipo)
            return newTipo
        },
        onSuccess: (tipos) => {
            console.log(tipos);
            queryClient.setQueryData<TipoSitio[]>(["tipoSitio"], (oldData) =>
                oldData ? [...oldData,tipos] : [tipos]
            );
        },
        onError: (error) => {
            console.log("Error al cargar el tipo de sitio", error);
        }
    });

    const getTipoById = (id: number, tipo : TipoSitio[] | undefined = data ): TipoSitio | null => {
        return tipo?.find((tipos) => tipos.id_tipo === id) || null;
    }

    const updateTipoMutation = useMutation({
        mutationFn: async({ id, update } : { id: number; update: Partial<TipoSitio> }) => {
            await axiosAPI.put<TipoSitio>(`${url}/${id}`, update);
            return {id, update}
        },
        onSuccess: ({ id, update }) => {
            console.log("dato 1: ",id," dato 2: ",update);
            queryClient.setQueryData<TipoSitio[]>(["tipoSitio"], (oldData) =>
                oldData
                    ? oldData.map((tipos) =>
                        tipos.id_tipo === id ? { ...tipos, ...update } : tipos
                    )
                    : []
            );
        },

        onError: (error) => {
            console.error("Error al actualizar:", error);
        }
    });

    const changeStateMutation = useMutation({
        mutationFn: async (id_tipo: number) => {
            await axiosAPI.put<TipoSitio>(`tipoSitio/estado/${id_tipo}`);
            return id_tipo
        },

        onSuccess: (id_tipo: number) => {
            queryClient.setQueryData<TipoSitio[]>(["tipoSitio"], (oldData) =>
                oldData
                    ? oldData.map((tipos: TipoSitio) =>
                        tipos.id_tipo == id_tipo
                            ? { ...tipos, estado: !tipos.estado }
                            : tipos
                    )
                    : []
            );
        },

        onError: (error) => {
            console.error("Error al actualizar estado:", error);
        },
    });

    const addTipo = async (tipos: TipoSitio) => {
        return addTipoMutation.mutateAsync(tipos);
    };

    const updateTipo = async (id: number, update: Partial<TipoSitio>) => {
        return updateTipoMutation.mutateAsync({ id, update });
    };

    const changeState = async (id_tipo: number) => {
        return changeStateMutation.mutateAsync(id_tipo);
    };

    return {
        tipos: data,
        isLoading,
        isError,
        error,
        addTipo,
        changeState,
        getTipoById,
        updateTipo
    }
}
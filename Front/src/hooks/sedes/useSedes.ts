import { axiosAPI } from '@/axios/axiosAPI';
import { Sede } from '@/types/sedes'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useSede() {

    const queryClient = useQueryClient();

    const url = 'Sede';

    const { data, isLoading, isError, error } = useQuery<Sede[]>({
        queryKey: ["sedes"],
        queryFn: async () => {
            const res = await axiosAPI.get(url);
            return res.data;
        }
    });
    
    const addSedeMutation = useMutation({
        mutationFn: async(newSede: Sede) => {
            await axiosAPI.post<Sede>(url, newSede)
            return newSede
        },
        onSuccess: (sede) => {
            console.log(sede);
            queryClient.setQueryData<Sede[]>(["sedes"], (oldData) =>
                oldData ? [...oldData,sede] : [sede]
            );
        },
        onError: (error) => {
            console.log("Error al cargar la sede", error);
        }
    });

    const getSedeById = (id: number, sedes : Sede[] | undefined = data ): Sede | null => {
        return sedes?.find((sede) => sede.id_sede === id) || null;
    }

    const updateSedesMutation = useMutation({
        mutationFn: async({ id, update } : { id: number; update: Partial<Sede> }) => {
            await axiosAPI.put<Sede>(`${url}/${id}`, update);
            return {id, update}
        },
        onSuccess: ({ id, update }) => {
            console.log("dato 1: ",id," dato 2: ",update);
            queryClient.setQueryData<Sede[]>(["sedes"], (oldData) =>
                oldData
                    ? oldData.map((sede) =>
                        sede.id_sede === id ? { ...sede, ...update } : sede
                    )
                    : []
            );
        },

        onError: (error) => {
            console.error("Error al actualizar:", error);
        }
    });

    const changeStateMutation = useMutation({
        mutationFn: async (id_sede: number) => {
            await axiosAPI.put<Sede>(`sede/estado/${id_sede}`);
            return id_sede
        },

        onSuccess: (id_sede: number) => {
            queryClient.setQueryData<Sede[]>(["sedes"], (oldData) =>
                oldData
                    ? oldData.map((sede: Sede) =>
                        sede.id_sede == id_sede
                            ? { ...sede, estado: !sede.estado }
                            : sede
                    )
                    : []
            );
        },

        onError: (error) => {
            console.error("Error al actualizar estado:", error);
        },
    });

    const addSede = async (sede: Sede) => {
        return addSedeMutation.mutateAsync(sede);
    };

    const updateSede = async (id: number, update: Partial<Sede>) => {
        return updateSedesMutation.mutateAsync({ id, update });
    };

    const changeState = async (id_sede: number) => {
        return changeStateMutation.mutateAsync(id_sede);
    };

    return {
        sede: data,
        isLoading,
        isError,
        error,
        addSede,
        changeState,
        getSedeById,
        updateSede
    }
}
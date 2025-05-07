import { axiosAPI } from '@/axios/axiosAPI';
import { Modulo } from '@/schemas/Modulos'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useModulo() {

    const queryClient = useQueryClient();

    const url = 'modulos';

    const { data, isLoading, isError, error } = useQuery<Modulo[]>({
        queryKey: ["modulos"],
        queryFn: async () => {
            const res = await axiosAPI.get(url);
            return res.data;
        }
    });

    const addModuloMutation = useMutation({
        mutationFn: async(newModulo: Modulo) => {
            await axiosAPI.post<Modulo>(url, newModulo)
            return newModulo
        },
        onSuccess: (modulo) => {
            console.log(modulo);
            queryClient.setQueryData<Modulo[]>(["modulos"], (oldData) =>
                oldData ? [...oldData,modulo] : [modulo]
            );
        },
        onError: (error) => {
            console.log("Error al cargar el modulo", error);
        }
    });

    const getModuloById = (id: number, modulos : Modulo[] | undefined = data ): Modulo | null => {
        return modulos?.find((modulo) => modulo.id_modulo === id) || null;
    }

    const updateModuloMutation = useMutation({
        mutationFn: async({ id, update } : { id: number; update: Partial<Modulo> }) => {
            await axiosAPI.put<Modulo>(`${url}/${id}`, update);
            return {id, update}
        },
        onSuccess: ({ id, update }) => {
            console.log("dato 1: ",id," dato 2: ",update);
            queryClient.setQueryData<Modulo[]>(["modulos"], (oldData) =>
                oldData
                    ? oldData.map((modulo) =>
                        modulo.id_modulo === id ? { ...modulo, ...update } : modulo
                    )
                    : []
            );
        },

        onError: (error) => {
            console.error("Error al actualizar:", error);
        }
    });

    const changeStateMutation = useMutation({
        mutationFn: async (id_modulo: number) => {
            await axiosAPI.put<Modulo>(`modulos/estado/${id_modulo}`);
            return id_modulo
        },

        onSuccess: (id_modulo: number) => {
            queryClient.setQueryData<Modulo[]>(["modulos"], (oldData) =>
                oldData
                    ? oldData.map((modulo: Modulo) =>
                        modulo.id_modulo == id_modulo
                            ? { ...modulo, estado: !modulo.estado }
                            : modulo
                    )
                    : []
            );
        },

        onError: (error) => {
            console.error("Error al actualizar estado:", error);
        },
    });

    const addModulo = async (modulo: Modulo) => {
        return addModuloMutation.mutateAsync(modulo);
    };

    const updateModulo = async (id: number, update: Partial<Modulo>) => {
        return updateModuloMutation.mutateAsync({ id, update });
    };

    const changeState = async (id_modulo: number) => {
        return changeStateMutation.mutateAsync(id_modulo);
    };

    return {
        modulos: data,
        isLoading,
        isError,
        error,
        addModulo,
        changeState,
        getModuloById,
        updateModulo
    }
}
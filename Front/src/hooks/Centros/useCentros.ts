import { axiosAPI } from '@/axios/axiosAPI';
import { Centro } from '@/schemas/Centro'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useCentro() {

    const queryClient = useQueryClient();

    const url = 'centros';

    const { data, isLoading, isError, error } = useQuery<Centro[]>({
        queryKey: ["centros"],
        queryFn: async () => {
            const res = await axiosAPI.get(url);
            return res.data;
        }
    });

    const addCentroMutation = useMutation({
        mutationFn: async(newCentro: Centro) => {
            await axiosAPI.post<Centro>(url, newCentro)
            return newCentro
        },
        onSuccess: (centros) => {
            
            queryClient.setQueryData<Centro[]>(["centros"], (oldData) =>
                oldData ? [...oldData,centros] : [centros]
            );
            
        },
        onError: (error) => {
            console.log("Error al cargar el centro", error);
        }
    });

    const getCentroById = (id: number, centro : Centro[] | undefined = data ): Centro | null => {
        return centro?.find((centro) => centro.id_centro === id) || null;
    }

    const updateCentroMutation = useMutation({
        mutationFn: async({ id, update } : { id: number; update: Partial<Centro> }) => {
            await axiosAPI.put<Centro>(`${url}/${id}`, update);
            return {id, update}
        },
        onSuccess: ({ id, update }) => {
            queryClient.setQueryData<Centro[]>(["centros"], (oldData) =>
                oldData
                    ? oldData.map((centro) =>
                        centro.id_centro === id ? { ...centro, ...update } : centro
                    )
                    : []
            );
        },

        onError: (error) => {
            console.error("Error al actualizar:", error);
        }
    });

    const changeStateMutation = useMutation({
        mutationFn: async (id_centro: number) => {
            await axiosAPI.put<Centro>(`centros/estado/${id_centro}`);
            return id_centro
        },

        onSuccess: (id_centro: number) => {
            queryClient.setQueryData<Centro[]>(["centros"], (oldData) =>
                oldData
                    ? oldData.map((centro: Centro) =>
                        centro.id_centro == id_centro
                            ? { ...centro, estado: !centro.estado }
                            : centro
                    )
                    : []
            );
        },

        onError: (error) => {
            console.error("Error al actualizar estado:", error);
        },
    });

    const addCentro = async (centro: Centro) => {
        return addCentroMutation.mutateAsync(centro);
    };

    const updateCentro = async (id: number, update: Partial<Centro>) => {
        return updateCentroMutation.mutateAsync({ id, update });
    };

    const changeState = async (id_centro: number) => {
        return changeStateMutation.mutateAsync(id_centro);
    };

    return {
        centros: data,
        isLoading,
        isError,
        error,
        addCentro,
        changeState,
        getCentroById,
        updateCentro
    }
}
import { axiosAPI } from '@/axios/axiosAPI';
import { Ruta } from '@/schemas/Ruta'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useRuta() {

    const queryClient = useQueryClient();

    const url = 'rutas';

    const { data, isLoading, isError, error } = useQuery<Ruta[]>({
        queryKey: ["ruta"],
        queryFn: async () => {
            const res = await axiosAPI.get(url);
            return res.data;
        }
    });

    const addRutaMutation = useMutation({
        mutationFn: async(newRuta: Ruta) => {
            await axiosAPI.post<Ruta>(url, newRuta)
            return newRuta
        },
        onSuccess: (ruta) => {
            console.log(ruta);
            queryClient.setQueryData<Ruta[]>(["ruta"], (oldData) =>
                oldData ? [...oldData,ruta] : [ruta]
            );
        },
        onError: (error) => {
            console.log("Error al cargar la ruta", error);
        }
    });

    const getRutaById = (id: number, ruta : Ruta[] | undefined = data ): Ruta | null => {
        return ruta?.find((rutas) => rutas.id_ruta === id) || null;
    }

    const updateRutaMutation = useMutation({
        mutationFn: async({ id, update } : { id: number; update: Partial<Ruta> }) => {
            await axiosAPI.put<Ruta>(`${url}/${id}`, update);
            return {id, update}
        },
        onSuccess: ({ id, update }) => {
            console.log("dato 1: ",id," dato 2: ",update);
            queryClient.setQueryData<Ruta[]>(["ruta"], (oldData) =>
                oldData
                    ? oldData.map((rutas) =>
                        rutas.id_ruta === id ? { ...rutas, ...update } : rutas
                    )
                    : []
            );
        },

        onError: (error) => {
            console.error("Error al actualizar:", error);
        }
    });

    const changeStateMutation = useMutation({
        mutationFn: async (id_ruta: number) => {
            await axiosAPI.put<Ruta>(`rutas/estado/${id_ruta}`);
            return id_ruta
        },

        onSuccess: (id_ruta: number) => {
            queryClient.setQueryData<Ruta[]>(["ruta"], (oldData) =>
                oldData
                    ? oldData.map((rutas: Ruta) =>
                        rutas.id_ruta == id_ruta
                            ? { ...rutas, estado: !rutas.estado }
                            : rutas
                    )
                    : []
            );
        },

        onError: (error) => {
            console.error("Error al actualizar estado:", error);
        },
    });

    const addRuta = async (rutas: Ruta) => {
        return addRutaMutation.mutateAsync(rutas);
    };

    const updateRuta = async (id: number, update: Partial<Ruta>) => {
        return updateRutaMutation.mutateAsync({ id, update });
    };

    const changeState = async (id_ruta: number) => {
        return changeStateMutation.mutateAsync(id_ruta);
    };

    return {
        rutas: data,
        isLoading,
        isError,
        error,
        addRuta,
        changeState,
        getRutaById,
        updateRuta
    }
}
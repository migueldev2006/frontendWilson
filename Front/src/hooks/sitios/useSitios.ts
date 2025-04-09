import { axiosAPI } from '@/axios/axiosAPI';
import { Sitios } from '@/types/sitios'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useSitios() {

    const queryClient = useQueryClient();

    const url = 'Sitio';

    const { data, isLoading, isError, error } = useQuery<Sitios[]>({
        queryKey: ["sitios"],
        queryFn: async () => {
            const res = await axiosAPI.get(url);
            return res.data;
        }
    });

    const addSitioMutation = useMutation({
        mutationFn: async(newSitio: Sitios) => {
            await axiosAPI.post<Sitios>(url, newSitio)
            return newSitio
        },
        onSuccess: (sitio) => {
            console.log(sitio);
            queryClient.setQueryData<Sitios[]>(["sitios"], (oldData) =>
                oldData ? [...oldData,sitio] : [sitio]
            );
        },
        onError: (error) => {
            console.log("Error al cargar el sitio", error);
        }
    });

    const getSitioById = (id: number, sitios : Sitios[] | undefined = data ): Sitios | null => {
        return sitios?.find((sitio) => sitio.id_sitio === id) || null;
    }

    const updateSitioMutation = useMutation({
        mutationFn: async({ id, update } : { id: number; update: Partial<Sitios> }) => {
            await axiosAPI.put<Sitios>(`${url}/${id}`, update);
            return {id, update}
        },
        onSuccess: ({ id, update }) => {
            console.log("dato 1: ",id," dato 2: ",update);
            queryClient.setQueryData<Sitios[]>(["sitios"], (oldData) =>
                oldData
                    ? oldData.map((sitio) =>
                        sitio.id_sitio === id ? { ...sitio, ...update } : sitio
                    )
                    : []
            );
        },

        onError: (error) => {
            console.error("Error al actualizar:", error);
        }
    });

    const changeStateMutation = useMutation({
        mutationFn: async (id_sitio: number) => {
            await axiosAPI.put<Sitios>(`sitio/estado/${id_sitio}`);
            return id_sitio
        },

        onSuccess: (id_sitio: number) => {
            queryClient.setQueryData<Sitios[]>(["sitios"], (oldData) =>
                oldData
                    ? oldData.map((sitio: Sitios) =>
                        sitio.id_sitio == id_sitio
                            ? { ...sitio, estado: !sitio.estado }
                            : sitio
                    )
                    : []
            );
        },

        onError: (error) => {
            console.error("Error al actualizar estado:", error);
        },
    });

    const addSitio = async (sitio: Sitios) => {
        return addSitioMutation.mutateAsync(sitio);
    };

    const updateSitio = async (id: number, update: Partial<Sitios>) => {
        return updateSitioMutation.mutateAsync({ id, update });
    };

    const changeState = async (id_sitio: number) => {
        return changeStateMutation.mutateAsync(id_sitio);
    };

    return {
        sitios: data,
        isLoading,
        isError,
        error,
        addSitio,
        changeState,
        getSitioById,
        updateSitio
    }
}
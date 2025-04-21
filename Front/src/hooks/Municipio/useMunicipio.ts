import { axiosAPI } from '@/axios/axiosAPI';
import { Municipio } from '@/types/Municipio'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useMunicipio() {

    const queryClient = useQueryClient();

    const url = 'municipios';

    const { data, isLoading, isError, error } = useQuery<Municipio[]>({
        queryKey: ["municipio"],
        queryFn: async () => {
            const res = await axiosAPI.get(url);
            return res.data;
        }
    });

    const addMunicipioMutation = useMutation({
        mutationFn: async(newMunicipio: Municipio) => {
            await axiosAPI.post<Municipio>(url, newMunicipio)
            return newMunicipio
        },
        onSuccess: (municipio) => {
            console.log(municipio);
            queryClient.setQueryData<Municipio[]>(["municipio"], (oldData) =>
                oldData ? [...oldData,municipio] : [municipio]
            );
        },
        onError: (error) => {
            console.log("Error al cargar el municipio", error);
        }
    });

    const getMunicipioById = (id: number, municipios : Municipio[] | undefined = data ): Municipio | null => {
        return municipios?.find((municipio) => municipio.id_municipio === id) || null;
    }

    const updateMunicipioMutation = useMutation({
        mutationFn: async({ id, update } : { id: number; update: Partial<Municipio> }) => {
            await axiosAPI.put<Municipio>(`${url}/${id}`, update);
            return {id, update}
        },
        onSuccess: ({ id, update }) => {
            console.log("dato 1: ",id," dato 2: ",update);
            queryClient.setQueryData<Municipio[]>(["municipio"], (oldData) =>
                oldData
                    ? oldData.map((municipio) =>
                        municipio.id_municipio === id ? { ...municipio, ...update } : municipio
                    )
                    : []
            );
        },

        onError: (error) => {
            console.error("Error al actualizar:", error);
        }
    });

    const changeStateMutation = useMutation({
        mutationFn: async (id_municipio: number) => {
            await axiosAPI.put<Municipio>(`municipios/estado/${id_municipio}`);
            return id_municipio
        },

        onSuccess: (id_municipio: number) => {
            queryClient.setQueryData<Municipio[]>(["municipio"], (oldData) =>
                oldData
                    ? oldData.map((municipio: Municipio) =>
                        municipio.id_municipio == id_municipio
                            ? { ...municipio, estado: !municipio.estado }
                            : municipio
                    )
                    : []
            );
        },

        onError: (error) => {
            console.error("Error al actualizar estado:", error);
        },
    });

    const addMunicipio = async (municipio: Municipio) => {
        return addMunicipioMutation.mutateAsync(municipio);
    };

    const updateMunicipio = async (id: number, update: Partial<Municipio>) => {
        return updateMunicipioMutation.mutateAsync({ id, update });
    };

    const changeState = async (id_municipio: number) => {
        return changeStateMutation.mutateAsync(id_municipio);
    };

    return {
        municipios: data,
        isLoading,
        isError,
        error,
        addMunicipio,
        changeState,
        getMunicipioById,
        updateMunicipio
    }
}
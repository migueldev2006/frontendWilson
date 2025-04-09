import { axiosAPI } from '@/axios/axiosAPI';
import { Ficha } from '@/types/Ficha'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useFichas() {

    const queryClient = useQueryClient();

    const url = 'Fichas';

    const { data, isLoading, isError, error } = useQuery<Ficha[]>({
        queryKey: ["ficha"], 
        queryFn: async () => {
            const res = await axiosAPI.get(url);
            return res.data;
        }
    });

    const addFichasMutation = useMutation({
        mutationFn: async(newFicha: Ficha) => {
            await axiosAPI.post<Ficha>(url, newFicha)
            return newFicha
        },
        onSuccess: (Ficha) => {
            console.log(Ficha);
            queryClient.setQueryData<Ficha[]>(["ficha"], (oldData) => 
                oldData ? [...oldData,Ficha] : [Ficha]
            );
        },
        onError: (error) => {
            console.log("Error al cargar la Ficha", error);
        }
    });

    const getFichaById = (id: number, Ficha : Ficha[] | undefined = data ): Ficha | null => {
        return Ficha?.find((Ficha) => Ficha.id_ficha === id) || null;
    }

    const updateAreaMutation = useMutation({
        mutationFn: async({ id, update } : { id: number; update: Partial<Ficha> }) => {
            await axiosAPI.put<Ficha>(`${url}/${id}`, update);
            return {id, update}
        },
        onSuccess: ({ id, update }) => {
            console.log("dato 1: ",id," dato 2: ",update);
            queryClient.setQueryData<Ficha[]>(["ficha"], (oldData) => 
                oldData
                    ? oldData.map((Ficha) =>
                        Ficha.id_ficha === id ? { ...Ficha, ...update } : Ficha
                    )
                    : []
            );
        },

        onError: (error) => {
            console.error("Error al actualizar:", error);
        }
    });

    const changeStateMutation = useMutation({
        mutationFn: async (id_ficha: number) => {
            await axiosAPI.put<Ficha>(`Fichas/estado/${id_ficha}`);
            return id_ficha
        },

        onSuccess: (id_ficha: number) => {
            queryClient.setQueryData<Ficha[]>(["ficha"], (oldData) => 
                oldData
                    ? oldData.map((ficha: Ficha) =>
                        ficha.id_ficha == id_ficha
                            ? { ...ficha, estado: !ficha.estado }
                            : ficha
                    )
                    : []
            );
        },

        onError: (error) => {
            console.error("Error al actualizar estado:", error);
        },
    });

    const addFicha = async (ficha: Ficha) => {
        return addFichasMutation.mutateAsync(ficha);
    };

    const updateFicha = async (id: number, update: Partial<Ficha>) => {
        return updateAreaMutation.mutateAsync({ id, update });
    };

    const changeState = async (id_ficha: number) => {
        return changeStateMutation.mutateAsync(id_ficha);
    };

    return {
        fichas: data,
        isLoading,
        isError,
        error,
        addFicha,
        changeState,
        getFichaById,
        updateFicha
    }
}

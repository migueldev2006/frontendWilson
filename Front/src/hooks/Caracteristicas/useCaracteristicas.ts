import { axiosAPI } from '@/axios/axiosAPI';
import { Caracteristicas } from '@/schemas/Caracteristicas'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useCaracteristica() {

    const queryClient = useQueryClient();

    const url = 'caracteristicas';

    const { data, isLoading, isError, error } = useQuery<Caracteristicas[]>({
        queryKey: ["caracteristicas"],
        queryFn: async () => {
            const res = await axiosAPI.get(url);
            return res.data;
        }
    });

    const addCaracteristicaMutation = useMutation({
        mutationFn: async(newCaracteristica: Caracteristica) => {
            console.log("Nuevo objeto de caracteristica a enviar:", newCaracteristica); 
            await axiosAPI.post<Caracteristica>(url, newCaracteristica)
            return newCaracteristica
        },
        onSuccess: (caracteristica) => {
            console.log(caracteristica);
            queryClient.setQueryData<Caracteristicas[]>(["caracteristicas"], (oldData) =>
                oldData ? [...oldData,caracteristica] : [caracteristica]
            );
        },
        onError: (error) => {
            console.log("Error al cargar la caracteristica", error);
        }
    });

    const getCaracteristicaById = (id: number, caracteristicas : Caracteristicas[] | undefined = data ): Caracteristicas | null => {
        return caracteristicas?.find((caracteristica) => caracteristica.id_caracteristica === id) || null;
    }

    const updateCaracteristicaMutation = useMutation({
        mutationFn: async({ id, update } : { id: number; update: Partial<Caracteristicas> }) => {
            await axiosAPI.put<Caracteristicas>(`${url}/${id}`, update);
            return {id, update}
        },
        onSuccess: ({ id, update }) => {
            queryClient.setQueryData<Caracteristicas[]>(["caracteristicas"], (oldData) =>
                oldData
                    ? oldData.map((caracteristica) =>
                        caracteristica.id_caracteristica === id ? { ...caracteristica, ...update } : caracteristica
                    )
                    : []
            );
        },

        onError: (error) => {
            console.error("Error al actualizar:", error);
        }
    });

    

    const addCaracteristica = async (caracteristica: Caracteristicas) => {
        return addCaracteristicaMutation.mutateAsync(caracteristica);
    };

    const updateCaracteristica = async (id: number, update: Partial<Caracteristicas>) => {
        return updateCaracteristicaMutation.mutateAsync({ id, update });
    };

   
    return {
        caracteristicas: data,
        isLoading,
        isError,
        error,
        addCaracteristica,
        getCaracteristicaById,
        updateCaracteristica
    }
}
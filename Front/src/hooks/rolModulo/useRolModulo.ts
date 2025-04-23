import { axiosAPI } from '@/axios/axiosAPI';
import { RolModulo } from '@/types/rolModulo'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useRolModulo() {

    const queryClient = useQueryClient();

    const url = 'rol_modulo';

    const { data, isLoading, isError, error } = useQuery<RolModulo[]>({
        queryKey: ["rolModulo"], 
        queryFn: async () => {
            const res = await axiosAPI.get(url);
            return res.data;
        }
    });

    const addRolModuloMutation = useMutation({
        mutationFn: async(newRolModulo: RolModulo) => {
            await axiosAPI.post<RolModulo>(url, newRolModulo)
            return newRolModulo
        },
        onSuccess: (RolModulo) => {
            console.log(RolModulo);
            queryClient.setQueryData<RolModulo[]>(["rolModulo"], (oldData) => 
                oldData ? [...oldData,RolModulo] : [RolModulo]
            );
        },
        onError: (error) => {
            console.log("Error al cargar  RolModulo", error);
        }
    });

    const getRolModuloById = (id: number, RolModulo : RolModulo[] | undefined = data ): RolModulo | null => {
        return RolModulo?.find((RolModulo) => RolModulo.id_rol_modulo === id) || null;
    }

    const updateRolModuloMutation = useMutation({
        mutationFn: async({ id, update } : { id: number; update: Partial<RolModulo> }) => {
            await axiosAPI.put<RolModulo>(`${url}/${id}`, update);
            return {id, update}
        },
        onSuccess: ({ id, update }) => {
            console.log("dato 1: ",id," dato 2: ",update);
            queryClient.setQueryData<RolModulo[]>(["rolModulo"], (oldData) => 
                oldData
                    ? oldData.map((rolModulo) =>
                        rolModulo.id_rol_modulo === id ? { ...rolModulo, ...update } : rolModulo
                    )
                    : []
            );
        },

        onError: (error) => {
            console.error("Error al actualizar:", error);
        }
    });

    // const changeStateMutation = useMutation({
    //     mutationFn: async (id_programa: number) => {
    //         await axiosAPI.put<RolModulo>(`P.formacion/estado/${id_programa}`);
    //         return id_programa
    //     },

    //     onSuccess: (id_programa: number) => {
    //         queryClient.setQueryData<RolModulo[]>(["programa"], (oldData) => 
    //             oldData
    //                 ? oldData.map((programa: RolModulo) =>
    //                     programa.id_rol_modulo == id_programa
    //                         ? { ...programa, estado: !programa.estado }
    //                         : programa
    //                 )
    //                 : []
    //         );
    //     },

    //     onError: (error) => {
    //         console.error("Error al actualizar estado:", error);
    //     },
    // });

    const addRolModulo = async (ficha: RolModulo) => {
        return addRolModuloMutation.mutateAsync(ficha);
    };

    const updateRolModulo = async (id: number, update: Partial<RolModulo>) => {
        return updateRolModuloMutation.mutateAsync({ id, update });
    };

    // const changeState = async (id_ficha: number) => {
    //     return changeStateMutation.mutateAsync(id_ficha);
    // };

    return {
        rolModulos: data,
        isLoading,
        isError,
        error,
        addRolModulo,
        // changeState,
        getRolModuloById,
        updateRolModulo
    }
}

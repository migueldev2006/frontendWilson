import { axiosAPI } from '@/axios/axiosAPI';
import { Permisos  } from '@/types/permisos';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function usePermisos() {

    const queryClient = useQueryClient();

    const url = 'Permisos';

    const { data, isLoading, isError, error } = useQuery<Permisos []>({
        queryKey: ["permisos"],
        queryFn: async () => {
            const res = await axiosAPI.get(url);
            return res.data;
        }
    });

    const addPermisosMutation = useMutation({
        mutationFn: async(newPermiso: Permisos ) => {
            await axiosAPI.post<Permisos >(url, newPermiso)
            return newPermiso
        },
        onSuccess: (permiso) => {
            console.log(permiso);
            queryClient.setQueryData<Permisos []>(["permisos"], (oldData) =>
                oldData ? [...oldData,permiso] : [permiso]
            );
        },
        onError: (error) => {
            console.log("Error al cargar el permiso", error);
        }
    });

    const getPermisosById = (id: number, permisos : Permisos [] | undefined = data ): Permisos  | null => {
        return permisos?.find((permiso) => permiso.id_permiso === id) || null;
    }

    const updatePermisoMutation = useMutation({
        mutationFn: async({ id, update } : { id: number; update: Partial<Permisos > }) => {
            await axiosAPI.put<Permisos >(`${url}/${id}`, update);
            return {id, update}
        },
        onSuccess: ({ id, update }) => {
            console.log("dato 1: ",id," dato 2: ",update);
            queryClient.setQueryData<Permisos []>(["permisos"], (oldData) =>
                oldData
                    ? oldData.map((permiso) =>
                        permiso.id_permiso === id ? { ...permiso, ...update } : permiso
                    )
                    : []
            );
        },

        onError: (error) => {
            console.error("Error al actualizar:", error);
        }
    });

    // const changeStateMutation = useMutation({
    //     mutationFn: async (id_permiso: number) => {
    //         await axiosAPI.put<Permisos >(`usuarios/estado/${id_permiso}`);
    //         return id_permiso
    //     },

    //     onSuccess: (id_usuario: number) => {
    //         queryClient.setQueryData<Permisos []>(["permisos"], (oldData) =>
    //             oldData
    //                 ? oldData.map((user: Permisos ) =>
    //                     user.id_permiso == id_usuario
    //                         ? { ...user, estado: !user.estado }
    //                         : user
    //                 )
    //                 : []
    //         );
    //     },

    //     onError: (error) => {
    //         console.error("Error al actualizar estado:", error);
    //     },
    // });

    const addPermiso = async (permisos: Permisos ) => {
        return addPermisosMutation.mutateAsync(permisos);
    };

    const updatePermisos = async (id: number, update: Partial<Permisos >) => {
        return updatePermisoMutation.mutateAsync({ id, update });
    };

    // const changeState = async (id_usuario: number) => {
    //     return changeStateMutation.mutateAsync(id_usuario);
    // };

    return {
        permiso: data,
        isLoading,
        isError,
        error,
        addPermiso,
        // changeState,
        getPermisosById,
        updatePermisos
    }
}
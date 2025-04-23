import { axiosAPI } from '@/axios/axiosAPI';
import { UserFicha } from '@/types/userFicha'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useUsuarioFcihas() {

    const queryClient = useQueryClient();

    const url = 'UsersFichas';

    const { data, isLoading, isError, error } = useQuery<UserFicha[]>({
        queryKey: ["usersFichas"],
        queryFn: async () => {
            const res = await axiosAPI.get(url);
            return res.data;
        }
    });

    const addUserMutation = useMutation({
        mutationFn: async(newUser: UserFicha) => {
            await axiosAPI.post<UserFicha>(url, newUser)
            return newUser
        },
        onSuccess: (user) => {
            console.log(user);
            queryClient.setQueryData<UserFicha[]>(["users"], (oldData) =>
                oldData ? [...oldData,user] : [user]
            );
        },
        onError: (error) => {
            console.log("Error al cargar el usuario", error);
        }
    });

    const getUserById = (id: number, users : UserFicha[] | undefined = data ): UserFicha | null => {
        return users?.find((user) => user.id_usuario_ficha === id) || null;
    }

    const updateUserMutation = useMutation({
        mutationFn: async({ id, update } : { id: number; update: Partial<UserFicha> }) => {
            await axiosAPI.put<UserFicha>(`${url}/${id}`, update);
            return {id, update}
        },
        onSuccess: ({ id, update }) => {
            console.log("dato 1: ",id," dato 2: ",update);
            queryClient.setQueryData<UserFicha[]>(["users"], (oldData) =>
                oldData
                    ? oldData.map((user) =>
                        user.id_usuario_ficha === id ? { ...user, ...update } : user
                    )
                    : []
            );
        },

        onError: (error) => {
            console.error("Error al actualizar:", error);
        }
    });

    const changeStateMutation = useMutation({
        mutationFn: async (id_usuario_ficha: number) => {
            await axiosAPI.put<UserFicha>(`usuarios/estado/${id_usuario_ficha}`);
            return id_usuario_ficha
        },

        // onSuccess: (id_usuario_ficha: number) => {
        //     queryClient.setQueryData<UserFicha[]>(["users"], (oldData) =>
        //         oldData
        //             ? oldData.map((user: UserFicha) =>
        //                 user.id_usuario_ficha == id_usuario_ficha
        //                     ? { ...user, estado: !user.estado }
        //                     : user
        //             )
        //             : []
        //     );
        // },

        onError: (error) => {
            console.error("Error al actualizar estado:", error);
        },
    });

    const addUser = async (usuario: UserFicha) => {
        return addUserMutation.mutateAsync(usuario);
    };

    const updateUser = async (id: number, update: Partial<UserFicha>) => {
        return updateUserMutation.mutateAsync({ id, update });
    };

    const changeState = async (id_usuario_ficha: number) => {
        return changeStateMutation.mutateAsync(id_usuario_ficha);
    };

    return {
        usersFcihas: data,
        isLoading,
        isError,
        error,
        addUser,
        changeState,
        getUserById,
        updateUser
    }
}
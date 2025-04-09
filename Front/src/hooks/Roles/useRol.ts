import { axiosAPI } from "@/axios/axiosAPI";
import { Rol } from "@/types/Rol";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useRol() {
  const queryClient = useQueryClient();

  const url = "rol";

  const { data, isLoading, isError, error } = useQuery<Rol[]>({
    queryKey: ["roles"],
    queryFn: async () => {
      const res = await axiosAPI.get(url);
      return res.data;
    },
  });

  const addRolMutation = useMutation({
    mutationFn: async (newRol: Rol) => {
      await axiosAPI.post<Rol>(url, newRol);
      return newRol;
    },
    onSuccess: (rol) => {
      console.log(rol);
      queryClient.setQueryData<Rol[]>(["roles"], (oldData) =>
        oldData ? [...oldData, rol] : [rol]
      );
    },
    onError: (error) => {
      console.log("Error al cargar el rol", error);
    },
  });

  const getRolById = (
    id: number,
    roles: Rol[] | undefined = data
  ): Rol | null => {
    return roles?.find((rol) => rol.id_rol === id) || null;
  };

  const updateRolMutation = useMutation({
    mutationFn: async ({
      id,
      update,
    }: {
      id: number;
      update: Partial<Rol>;
    }) => {
      await axiosAPI.put<Rol>(`${url}/${id}`, update);
      return { id, update };
    },
    onSuccess: ({ id, update }) => {
      console.log("dato 1: ", id, " dato 2: ", update);
      queryClient.setQueryData<Rol[]>(["roles"], (oldData) =>
        oldData
          ? oldData.map((rol) =>
              rol.id_rol === id
                ? { ...rol, ...update }
                : rol
            )
          : []
      );
    },

    onError: (error) => {
      console.error("Error al actualizar:", error);
    },
  });

  const changeStateMutation = useMutation({
    mutationFn: async (id_rol: number) => {
      await axiosAPI.put<Rol>(`rol/cambiarEstado/${id_rol}`);
      return id_rol;
    },

    onSuccess: (id_rol: number) => {
      queryClient.setQueryData<Rol[]>(["roles"], (oldData) =>
        oldData
          ? oldData.map((rol: Rol) =>
              rol.id_rol == id_rol
                ? { ...rol, estado: !rol.estado }
                : rol
            )
          : []
      );
    },

    onError: (error) => {
      console.error("Error al actualizar estado:", error);
    },
  });

  const addRol = async (rol: Rol) => {
    return addRolMutation.mutateAsync(rol);
  };

  const updateRol = async (id: number, update: Partial<Rol>) => {
    return updateRolMutation.mutateAsync({ id, update });
  };

  const changeState = async (id_rol: number) => {
    return changeStateMutation.mutateAsync(id_rol);
  };

  return {
    roles: data,
    isLoading,
    isError,
    error,
    addRol,
    changeState,
    getRolById,
    updateRol,
  };
}

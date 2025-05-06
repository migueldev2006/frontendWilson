import { deleteRol } from "@/axios/Roles/deleteRol";
import { getRol } from "@/axios/Roles/getRol";
import { postRol } from "@/axios/Roles/postRol";
import { putRol } from "@/axios/Roles/putRol";
import { Rol } from "@/types/Rol";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useRol() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery<Rol[]>({
    queryKey: ["roles"],
    queryFn: getRol,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });

  const addRolMutation = useMutation({
    mutationFn: postRol,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["roles"],
      });
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
    mutationFn: ({ id, data }: { id: number; data: Rol }) => putRol(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["roles"],
      });
    },

    onError: (error) => {
      console.error("Error al actualizar:", error);
    },
  });

  const changeStateMutation = useMutation({
    mutationFn: deleteRol,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["roles"],
      });
    },

    onError: (error) => {
      console.error("Error al actualizar estado:", error);
    },
  });

  const addRol = async (rol: Rol) => {
    return addRolMutation.mutateAsync(rol);
  };

  const updateRol = async (id: number, data: Rol) => {
    return updateRolMutation.mutateAsync({ id, data });
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

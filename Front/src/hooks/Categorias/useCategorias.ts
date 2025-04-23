import { axiosAPI } from '@/axios/axiosAPI';
import { Categoria } from '@/schemas/Categorias'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useCategoria() {

    const queryClient = useQueryClient();

    const url = 'categorias';

    const { data, isLoading, isError, error } = useQuery<Categoria[]>({
        queryKey: ["categorias"],
        queryFn: async () => {
            const res = await axiosAPI.get(url);
            return res.data;
        }
    });

    const addCategoriaMutation = useMutation({
        mutationFn: async(newCategoria: Categoria) => {
            await axiosAPI.post<Categoria>(url, newCategoria)
            return newCategoria
        },
        onSuccess: (categoria) => {
            console.log(categoria);
            queryClient.setQueryData<Categoria[]>(["categorias"], (oldData) =>
                oldData ? [...oldData,categoria] : [categoria]
            );
        },
        onError: (error) => {
            console.log("Error al cargar la categoria", error);
        }
    });

    const getCategoriaById = (id: number, categorias : Categoria[] | undefined = data ): Categoria | null => {
        return categorias?.find((categoria) => categoria.id_categoria === id) || null;
    }

    const updateCategoriaMutation = useMutation({
        mutationFn: async({ id, update } : { id: number; update: Partial<Categoria> }) => {
            await axiosAPI.put<Categoria>(`${url}/${id}`, update);
            return {id, update}
        },
        onSuccess: ({ id, update }) => {
            console.log("dato 1: ",id," dato 2: ",update);
            queryClient.setQueryData<Categoria[]>(["categorias"], (oldData) =>
                oldData
                    ? oldData.map((categoria) =>
                        categoria.id_categoria === id ? { ...categoria, ...update } : categoria
                    )
                    : []
            );
        },

        onError: (error) => {
            console.error("Error al actualizar:", error);
        }
    });

    const changeStateMutation = useMutation({
        mutationFn: async (id_categoria: number) => {
            await axiosAPI.put<Categoria>(`categorias/estado/${id_categoria}`);
            return id_categoria
        },

        onSuccess: (id_categoria: number) => {
            queryClient.setQueryData<Categoria[]>(["categorias"], (oldData) =>
                oldData
                    ? oldData.map((categoria: Categoria) =>
                        categoria.id_categoria == id_categoria
                            ? { ...categoria, estado: !categoria.estado }
                            : categoria
                    )
                    : []
            );
        },

        onError: (error) => {
            console.error("Error al actualizar estado:", error);
        },
    });

    const addCategoria = async (categoria: Categoria) => {
        return addCategoriaMutation.mutateAsync(categoria);
    };

    const updateCategoria = async (id: number, update: Partial<Categoria>) => {
        return updateCategoriaMutation.mutateAsync({ id, update });
    };

    const changeState = async (id_categoria: number) => {
        return changeStateMutation.mutateAsync(id_categoria);
    };

    return {
        categorias: data,
        isLoading,
        isError,
        error,
        addCategoria,
        changeState,
        getCategoriaById,
        updateCategoria
    }
}
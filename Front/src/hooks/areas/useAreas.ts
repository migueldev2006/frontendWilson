import { axiosAPI } from '@/axios/axiosAPI';
import { Area } from '@/types/area'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useAreas() {

    const queryClient = useQueryClient();

    const url = 'areas';

    const { data, isLoading, isError, error } = useQuery<Area[]>({
        queryKey: ["areas"],
        queryFn: async () => {
            const res = await axiosAPI.get(url);
            return res.data;
        }
    });

    const addUserMutation = useMutation({
        mutationFn: async(newArea: Area) => {
            await axiosAPI.post<Area>(url, newArea)
            return newArea
        },
        onSuccess: (area) => {
            console.log(area);
            queryClient.setQueryData<Area[]>(["areas"], (oldData) =>
                oldData ? [...oldData,area] : [area]
            );
        },
        onError: (error) => {
            console.log("Error al cargar el area", error);
        }
    });

    const getAreaById = (id: number, areas : Area[] | undefined = data ): Area | null => {
        return areas?.find((area) => area.id_area === id) || null;
    }

    const updateAreaMutation = useMutation({
        mutationFn: async({ id, update } : { id: number; update: Partial<Area> }) => {
            await axiosAPI.put<Area>(`${url}/${id}`, update);
            return {id, update}
        },
        onSuccess: ({ id, update }) => {
            console.log("dato 1: ",id," dato 2: ",update);
            queryClient.setQueryData<Area[]>(["areas"], (oldData) =>
                oldData
                    ? oldData.map((area) =>
                        area.id_area === id ? { ...area, ...update } : area
                    )
                    : []
            );
        },

        onError: (error) => {
            console.error("Error al actualizar:", error);
        }
    });

    const changeStateMutation = useMutation({
        mutationFn: async (id_area: number) => {
            await axiosAPI.put<Area>(`areas/estado/${id_area}`);
            return id_area
        },

        onSuccess: (id_area: number) => {
            queryClient.setQueryData<Area[]>(["areas"], (oldData) =>
                oldData
                    ? oldData.map((area: Area) =>
                        area.id_area == id_area
                            ? { ...area, estado: !area.estado }
                            : area
                    )
                    : []
            );
        },

        onError: (error) => {
            console.error("Error al actualizar estado:", error);
        },
    });

    const addArea = async (area: Area) => {
        return addUserMutation.mutateAsync(area);
    };

    const updateArea = async (id: number, update: Partial<Area>) => {
        return updateAreaMutation.mutateAsync({ id, update });
    };

    const changeState = async (id_area: number) => {
        return changeStateMutation.mutateAsync(id_area);
    };

    return {
        areas: data,
        isLoading,
        isError,
        error,
        addArea,
        changeState,
        getAreaById,
        updateArea
    }
}
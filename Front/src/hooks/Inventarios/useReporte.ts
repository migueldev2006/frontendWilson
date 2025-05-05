// hooks/useReportesInventario.ts
import { useQuery } from "@tanstack/react-query";
import { axiosAPI } from "@/axios/axiosAPI";
import {
  ReporteInventario,
  ReporteAreaConMasElementos,
  ReporteElementosPorAgotarse,
  ReporteCantidadElementosPorArea,
} from "@/types/Inventario";

export default function useReporte() {
  const {
    data: reporteInventario,
    isLoading: isLoadingInventario,
    isError: isErrorInventario,
    error: errorInventario,
  } = useQuery<ReporteInventario[]>({
    queryKey: ["reporteInventario"],
    queryFn: async () => {
      const res = await axiosAPI.get("/reporte/inventario/");
      return res.data;
    },
  });

  const {
    data: areaConMasElementos,
    isLoading: isLoadingArea,
    isError: isErrorArea,
    error: errorArea,
  } = useQuery<ReporteAreaConMasElementos>({
    queryKey: ["areaConMasElementos"],
    queryFn: async () => {
      const res = await axiosAPI.get("/reporte/sitio/elemento");
      return res.data;
    },
  });

  const {
    data: elementosPorAgotarse,
    isLoading: isLoadingAgotados,
    isError: isErrorAgotados,
    error: errorAgotados,
  } = useQuery<ReporteElementosPorAgotarse[]>({
    queryKey: ["elementosPorAgotarse"],
    queryFn: async () => {
      const res = await axiosAPI.get("/reporte/sitio/agotado");
      return res.data;
    },
  });

  const {
    data: conteoInventarioElemento,
    isLoading: isLoadingConteo,
    isError: isErrorConteo,
    error: errorConteo,
  } = useQuery<ReporteCantidadElementosPorArea[]>({
    queryKey: ["conteoInventarioElemento"],
    queryFn: async () => {
      const res = await axiosAPI.get("/reporte/sitio");
      return res.data;
    },
  });

  return {
    reporteInventario,
    areaConMasElementos,
    elementosPorAgotarse,
    conteoInventarioElemento,

    // Estados combinados
    isLoading:
      isLoadingInventario ||
      isLoadingArea ||
      isLoadingAgotados ||
      isLoadingConteo,
    isError:
      isErrorInventario || isErrorArea || isErrorAgotados || isErrorConteo,
    errors: {
      inventario: errorInventario,
      area: errorArea,
      agotados: errorAgotados,
      conteo: errorConteo,
    },
  };
}

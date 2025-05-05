import { useQuery } from "@tanstack/react-query";
import { axiosAPI } from "@/axios/axiosAPI";
import {
  ReporteAsignacionElemento,
  ReporteUsuario,
  ReporteUsuariosPorFicha,
  ReporteMovimientosUsuarioElemento,
} from "@/types/Usuario";  // Ajusta la ruta si es necesario

export default function useReportes() {
  const {
    data: usuariosConElementos,
    isLoading: isLoadingUsuariosConElementos,
    isError: isErrorUsuariosConElementos,
    error: errorUsuariosConElementos,
  } = useQuery<ReporteAsignacionElemento[]>({
    queryKey: ["usuariosConElementos"],
    queryFn: async () => {
      const res = await axiosAPI.get("/reporte/usuario/asignacion");
      return res.data;
    },
  });

  const {
    data: usuariosConRolYElementos,
    isLoading: isLoadingUsuariosConRolYElementos,
    isError: isErrorUsuariosConRolYElementos,
    error: errorUsuariosConRolYElementos,
  } = useQuery<ReporteUsuario[]>({
    queryKey: ["usuariosConRolYElementos"],
    queryFn: async () => {
      const res = await axiosAPI.get("/reporte/usuario");
      return res.data;
    },
  });

  const {
    data: fichasConUsuarios,
    isLoading: isLoadingFichasConUsuarios,
    isError: isErrorFichasConUsuarios,
    error: errorFichasConUsuarios,
  } = useQuery<ReporteUsuariosPorFicha[]>({
    queryKey: ["fichasConUsuarios"],
    queryFn: async () => {
      const res = await axiosAPI.get("/reporte/usuarioFicha");
      return res.data;
    },
  });

  const {
    data: usuariosConMovimientos,
    isLoading: isLoadingUsuariosConMovimientos,
    isError: isErrorUsuariosConMovimientos,
    error: errorUsuariosConMovimientos,
  } = useQuery<ReporteMovimientosUsuarioElemento[]>({
    queryKey: ["usuariosConMovimientos"],
    queryFn: async () => {
      const res = await axiosAPI.get("/reporte/usuario/movimiento");
      return res.data;
    },
  });

  return {
    usuariosConElementos,
    usuariosConRolYElementos,
    fichasConUsuarios,
    usuariosConMovimientos,

    // Estados combinados
    isLoading:
      isLoadingUsuariosConElementos ||
      isLoadingUsuariosConRolYElementos ||
      isLoadingFichasConUsuarios ||
      isLoadingUsuariosConMovimientos,
    isError:
      isErrorUsuariosConElementos ||
      isErrorUsuariosConRolYElementos ||
      isErrorFichasConUsuarios ||
      isErrorUsuariosConMovimientos,
    errors: {
      usuariosConElementos: errorUsuariosConElementos,
      usuariosConRolYElementos: errorUsuariosConRolYElementos,
      fichasConUsuarios: errorFichasConUsuarios,
      usuariosConMovimientos: errorUsuariosConMovimientos,
    },
  };
}

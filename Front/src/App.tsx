import { Route, Routes } from "react-router-dom"
import Layout from "./layouts/layout"
import Home from "./pages/Home/Home"
import { SolicitudTable } from "./pages/Solicitudes/Solicitudes";
import { VerificacionTable } from "./pages/Verificaciones/Verificaciones";
import { RolTable } from "./pages/Admin/Roles";
import { ElementosTable } from "./pages/Bodega/Elementos";
import { UnidadTable } from "./pages/Admin/UnidadesMedida";
import { MovimientoTable } from "./pages/Bodega/Movimientos";
import { TipoMovimientoTable } from "./pages/Bodega/TiposMovimiento";
import AreaTable from "./pages/Admin/areas";
import FcihasTable from "./pages/Admin/fichas";
import PermisoTable from "./pages/Admin/permisos";
import ProgramasTable from "./pages/Admin/programas";
import SedeTable from "./pages/Admin/sedes";
import SitiosTable from "./pages/Admin/sitios";
import { Inventario } from "./pages/Bodega/Inventario";
import UsersTable from "./pages/Admin/usuarios";
import AreaEstadisticas from "./pages/Estadisticas/Area";
import ReportArea from "./pages/Reportes/areas/Areas";
import ReportFichas from "./pages/Reportes/fichas/Fichas";
import ReportSedes from "./pages/Reportes/sedes/sedes";
import ReportSitios from "./pages/Reportes/sitios/sitios";
import ReportProgramasFormacion from "./pages/Reportes/Pformacion/pFormacion";
import EstadisticasFichas from "./pages/Estadisticas/Ficha";
import ProgramaEstadisticas from "./pages/Estadisticas/P_formacion";
import PermisosEstadisticas from "./pages/Estadisticas/permisos";
import RolModuloEstadisticas from "./pages/Estadisticas/Rol_Modulo";
import SedesEstadisticas from "./pages/Estadisticas/sedes";
import SitioEstadisticas from "./pages/Estadisticas/sitios";
import ReportUserFicha from "./pages/Reportes/userFichas/userFichas";
import ReportRolModulo from "./pages/Reportes/RolModulo/rolModulo";
import UserFichaEstadisticas from "./pages/Estadisticas/userFicha";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="home" element={<Home />} />
        <Route path="usuarios" element={<UsersTable />} />
        <Route path="areas" element={<AreaTable />} />
        <Route path="estadísticas/areas" element={<AreaEstadisticas />} />
        <Route path="reportes/areas" element={<ReportArea />} />
        <Route path="reportes/fichas" element={<ReportFichas />} />
        <Route path="reportes/sedes" element={<ReportSedes />} />
        <Route path="reporte/sitios" element={<ReportSitios />} />
        <Route path="fichas" element={<FcihasTable />} />
        <Route path="reporte/UseFicha" element={<ReportUserFicha />} />
        <Route path="estadisticas/fichas" element={<EstadisticasFichas />} />
        <Route path="permisos" element={<PermisoTable />} />
        <Route path="estadisticas/permisos" element={<PermisosEstadisticas />} />
        <Route path="reporte/programasf" element={<ReportProgramasFormacion />} />
        <Route path="programas" element={<ProgramasTable />} />
        <Route path="/estadisticas/programas" element={<ProgramaEstadisticas />} />
        <Route path="sedes" element={<SedeTable />} />
        <Route path="estadisticas/sedes" element={<SedesEstadisticas/>} />
        <Route path="sitios" element={<SitiosTable />} />
        <Route path="usuario/Ficha" element={<UserFichaEstadisticas/>}/>
        <Route path="estadisticas/sitios" element={<SitioEstadisticas />} />
        <Route path="roles" element={<RolTable />} />
        <Route path="estadisticas/rolModulo" element={<RolModuloEstadisticas />} />
        <Route path="reportes/rolModulo" element={<ReportRolModulo />} />
        <Route path="unidades" element={<UnidadTable />} />
        <Route path="elementos" element={<ElementosTable />} />
        <Route path="inventario" element={<Inventario />} />
        <Route path="movimientos" element={<MovimientoTable />} />
        <Route path="tipos" element={<TipoMovimientoTable />} />
        <Route path="solicitudes" element={<SolicitudTable/>}/>
        <Route path="verificaciones" element={<VerificacionTable/>}/>
      </Route>
    </Routes>
  )
}

export default App

import { Route, Routes } from "react-router-dom"
import Layout from "./layouts/layout"
import Home from "./pages/Home/Home"
import { SolicitudTable } from "./pages/Solicitudes/Solicitudes";
import { VerificacionTable } from "./pages/Verificaciones/Verificaciones";
import { RolTable } from "./pages/Admin/Roles";
import { ElementosTable } from "./pages/Bodega/Elementos";
import { UnidadTable } from "./pages/Bodega/UnidadesMedida";
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
import RolReport from "./pages/Reportes/Roles/Rol";
import { UnidadesEstadisticas } from "./pages/Estadisticas/Unidades";
import ReportElemento from "./pages/Reportes/Elementos/Elemento";
import { ElementoEstadisticas } from "./pages/Estadisticas/Elementos";
import ReportInventario from "./pages/Reportes/Inventarios/Inventario";
import { InventarioEstadisticas } from "./pages/Estadisticas/Inventario";
import ReportMovimiento from "./pages/Reportes/Movimientos/Movimiento";
import { MovimientoEstadisticas } from "./pages/Estadisticas/Movimientos";
import { TipoEstadisticas } from "./pages/Estadisticas/TipoMovimiento";
import ReportSolicitud from "./pages/Reportes/Solicitudes/Solicitud";
import { SolicitudEstadisticas } from "./pages/Estadisticas/Solicitud";
import ReportVerificacion from "./pages/Reportes/Verificaciones/Verificacion";
import { VerificacionesEstadisticas } from "./pages/Estadisticas/Verificacion";
import { InventarioSitio } from "./pages/Bodega/Inventario/Sitios/InventarioSitio";
import { InventarioArea } from "./pages/Bodega/Inventario/Areas/InventarioArea";
import {RolesEstadisticas} from "./pages/Estadisticas/Rol";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="usuarios" element={<UsersTable />} />
        <Route path="areas" element={<AreaTable />} />
        <Route path="fichas" element={<FcihasTable />} />
        <Route path="permisos" element={<PermisoTable />} />
        <Route path="programas" element={<ProgramasTable />} />
        <Route path="sedes" element={<SedeTable />} />
        <Route path="sitios" element={<SitiosTable />} />
        <Route path="roles" element={<RolTable />} />
        <Route path="reportes/roles" element={<RolReport />} />
        <Route path="estadisticas/roles" element={<RolesEstadisticas />} />
        <Route path="bodega/unidades" element={<UnidadTable />} />
        <Route path="estadisticas/unidades" element={<UnidadesEstadisticas />} />
        <Route path="bodega/elementos" element={<ElementosTable />} />
        <Route path="reportes/elementos" element={<ReportElemento />} />
        <Route path="estadisticas/elementos" element={<ElementoEstadisticas />} />
        <Route path="bodega/inventario/areas" element={<Inventario />} />
        <Route path="bodega/inventario/areas/:id" element={<InventarioArea />} />
          <Route
            path="bodega/inventario/areas/:id/sitios/:sitioId"
            element={<InventarioSitio />}
          />
        <Route path="reportes/inventario" element={<ReportInventario />} />
        <Route path="estadisticas/inventario" element={<InventarioEstadisticas />} />
        <Route path="bodega/movimientos" element={<MovimientoTable />} />
        <Route path="reportes/movimientos" element={<ReportMovimiento/>} />
        <Route path="estadisticas/movimientos" element={<MovimientoEstadisticas />} />
        <Route path="bodega/tipos" element={<TipoMovimientoTable />} />
        <Route path="estadisticas/tipos" element={<TipoEstadisticas />} />
        <Route path="solicitudes" element={<SolicitudTable/>}/>
        <Route path="reportes/solicitudes" element={<ReportSolicitud/>}/>
        <Route path="estadisticas/solicitudes" element={<SolicitudEstadisticas/>}/>
        <Route path="verificaciones" element={<VerificacionTable/>}/>
        <Route path="reportes/verificaciones" element={<ReportVerificacion/>}/>
        <Route path="estadisticas/verificaciones" element={<VerificacionesEstadisticas/>}/>
      </Route>
    </Routes>
  )
}

export default App
import { Route, Routes } from "react-router-dom";
import Layout from "./layouts/layout";
import Home from "./pages/Home/Home";
import { SolicitudTable } from "./pages/Solicitudes/Solicitudes";
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
import { VerificacionesEstadisticas } from "./pages/Estadisticas/Verificacion";
import { InventarioSitio } from "./pages/Bodega/Inventario/Sitios/InventarioSitio";
import { InventarioArea } from "./pages/Bodega/Inventario/Areas/InventarioArea";
import InventarioReportPage from "./pages/Reportes/Inventario/Inventario";
import UsuariosReportPage from "./pages/Reportes/Usuarios/Usuario";


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
        <Route path="bodega/unidades" element={<UnidadTable />} />
        <Route path="bodega/elementos" element={<ElementosTable />} />
        <Route path="report/inventario" element={<InventarioReportPage />} />
        <Route path="report/usuarios" element={<UsuariosReportPage />} />
        <Route path="bodega/inventario/areas" element={<Inventario />} />
        <Route path="bodega/inventario/areas/:id" element={<InventarioArea />} />
          <Route
            path="bodega/inventario/areas/:id/sitios/:sitioId"
            element={<InventarioSitio />}
          />
        <Route path="bodega/movimientos" element={<MovimientoTable />} />
        <Route path="bodega/tipos" element={<TipoMovimientoTable />} />
        <Route path="solicitudes" element={<SolicitudTable/>}/>
        <Route path="estadisticas/verificaciones" element={<VerificacionesEstadisticas/>}/>
      </Route>
    </Routes>
  );
}

export default App;

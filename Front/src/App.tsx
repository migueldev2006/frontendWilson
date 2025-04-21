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


function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="home" element={<Home />} />
        <Route path="usuarios" element={<UsersTable />} />
        <Route path="areas" element={<AreaTable />} />
        <Route path="fichas" element={<FcihasTable />} />
        <Route path="permisos" element={<PermisoTable />} />
        <Route path="programas" element={<ProgramasTable />} />
        <Route path="sedes" element={<SedeTable />} />
        <Route path="sitios" element={<SitiosTable />} />
        <Route path="roles" element={<RolTable />} />
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

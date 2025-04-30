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
import UsuariosEstadisticas from "./pages/Estadisticas/Usuario";
import UserReportSelector from "./pages/Reportes/Usuarios/Usuarios";
import CentrosTable from "./pages/Admin/centros";
import CentrosEstadisticas from "./pages/Estadisticas/Centros";
import CentroReport from "./pages/Reportes/Centros/Centros";
import MunicipiosTable from "./pages/Admin/municipio";
import TipoSitioTable from "./pages/Admin/tipoSitio";
import TipoSitioEstadisticas from "./pages/Estadisticas/TipoSitio";
import MunicipioReport from "./pages/Reportes/Municipios/Municipios";
import CategoriaReport from "./pages/Reportes/Categorias/Categorias";
import MunicipioEstadisticas from "./pages/Estadisticas/Municipios";
import CategoriasEstadisticas from "./pages/Estadisticas/Categorias";
import ModulosTable from "./pages/Admin/modulo";
import ModulosReport from "./pages/Reportes/Modulos/Modulos";
import ModulosEstadisticas from "./pages/Estadisticas/Modulos";
import RutasEstadisticas from "./pages/Estadisticas/Rutas";
import RutasTable from "./pages/Admin/rutas";
import CaracteristicasEstadisticas from "./pages/Estadisticas/Caracteristicas";

import Login from "./pages/Login"
import { useAuth } from "./providers/AuthProvider"
import StockEstadisticas from "./pages/Estadisticas/Stock";
import TopElementosUsados from "./pages/Estadisticas/TopElementos";
import MovimientosMensuales from "./pages/Estadisticas/MovimientoMes";


function App() {
  const { authenticated } = useAuth()
  return (
    <Routes>
      {authenticated &&
        <Route path="/" element={<Layout />}>
          <Route path="home" element={<Home />} />
          <Route path="usuarios" element={<UsersTable />} />
          <Route path="/reportes/usuarios" element={<UserReportSelector />} />
          <Route path="/estadisticas/usuarios" element={<UsuariosEstadisticas />} />
          <Route path="/centros" element={<CentrosTable />} />
          <Route path="/estadisticas/centros" element={<CentrosEstadisticas />} />
          <Route path="/reportes/centros" element={<CentroReport />} />
          <Route path="/tiposSitios" element={<TipoSitioTable />} />
          <Route path="/estadisticas/tiposSitios" element={<TipoSitioEstadisticas />} />
          <Route path="/municipios" element={<MunicipiosTable />} />
          <Route path="/reportes/municipios" element={<MunicipioReport />} />
          <Route path="/estadisticas/municipios" element={<MunicipioEstadisticas />} />
          <Route path="/reportes/categorias" element={<CategoriaReport />} />
          <Route path="/estadisticas/categorias" element={<CategoriasEstadisticas />} />
          <Route path="/reportes/modulos" element={<ModulosReport />} />
          <Route path="/modulos" element={<ModulosTable />} />
          <Route path="/estadisticas/modulos" element={<ModulosEstadisticas />} />
          <Route path="/estadisticas/caracteristicas" element={<CaracteristicasEstadisticas />} />
          <Route path="areas" element={<AreaTable />} />
          <Route path="/rutas" element={<RutasTable />} />
          <Route path="/estadisticas/rutas" element={<RutasEstadisticas />} />
          <Route path="fichas" element={<FcihasTable />} />
          <Route path="permisos" element={<PermisoTable />} />
          <Route path="programas" element={<ProgramasTable />} />
          <Route path="sedes" element={<SedeTable />} />
          <Route path="sitios" element={<SitiosTable />} />
          <Route path="roles" element={<RolTable />} />
          <Route path="unidades" element={<UnidadTable />} />
          <Route path="elementos" element={<ElementosTable />} />
          <Route path="inventario" element={<Inventario />} />
          <Route path="inventario/estadistica" element={<StockEstadisticas />} />
          <Route path="movimientos" element={<MovimientoTable />} />
          <Route path="movimientos/estadistica" element={<TopElementosUsados />} />
          <Route path="movimientos/mes/estadistica" element={<MovimientosMensuales />} />
          <Route path="tipos" element={<TipoMovimientoTable />} />
          <Route path="solicitudes" element={<SolicitudTable />} />
          <Route path="verificaciones" element={<VerificacionTable />} />
        </Route>
      }
      <Route path="login" element={<Login/>}/>
      <Route path="*" element={<h1 className="text-8xl font-bold">404 - Not Found</h1>} />
    </Routes>
  )
}

export default App

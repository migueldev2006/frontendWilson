import { Route, Routes } from "react-router-dom";
import Layout from "./layouts/layout";
import Home from "./pages/Home/Home";
import { SolicitudTable } from "./pages/Solicitudes/Solicitudes";
import { InventarioSitio } from "./pages/Bodega/Inventario/Sitios/InventarioSitio";
import { InventarioArea } from "./pages/Bodega/Inventario/Areas/InventarioArea";
import { Inventario } from "./pages/Bodega/Inventarios";
import { Perfil } from "./components/organismos/Perfil";
import Login from "./pages/Login";
import UsersTable from "./pages/Admin/usuarios";
import FichasTable from "./pages/Admin/fichas";
import SitiosTable from "./pages/Admin/sitios";
import PermisoTable from "./pages/Admin/permisos";
import { ElementosTable } from "./pages/Bodega/Elementos";
import { MovimientoTable } from "./pages/Bodega/Movimientos";
import { TipoMovimientoTable } from "./pages/Bodega/TiposMovimiento";
import { UnidadTable } from "./pages/Bodega/UnidadesMedida";
import CategoriasTable from "./pages/Admin/categorias";
import ProtectedRoute from "./routes/ProtectedRoute";
import InventarioReportPage from "./pages/Reportes/Inventario/Inventario";
import UsuariosReportPage from "./pages/Reportes/Elementos/Usuario";
import StockEstadisticas from "./pages/Estadisticas/Stock";
import TopElementosUsados from "./pages/Estadisticas/TopElementos";
import MovimientosMensuales from "./pages/Estadisticas/MovimientoMes";
import ElementosEstadisticas from "./pages/Estadisticas/ElementoUso";
import UsuariosEstadisticas from "./pages/Estadisticas/Usuario";
import AreaTable from "./pages/Admin/areas";

function App() {

  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="perfil" element={<Perfil />} />
          <Route path="admin/usuarios" element={<UsersTable />} />
          <Route path="admin/fichas" element={<FichasTable />} />
          <Route path="admin/areas" element={<AreaTable />} />
          <Route path="admin/sitios" element={<SitiosTable />} />
          <Route path="admin/permisos" element={<PermisoTable />} />
          <Route path="bodega/elementos" element={<ElementosTable />} />
          <Route path="bodega/movimientos" element={<MovimientoTable />} />
          <Route path="bodega/tipos" element={<TipoMovimientoTable />} />
          <Route path="bodega/unidades" element={<UnidadTable />} />
          <Route path="bodega/categorias" element={<CategoriasTable />} />
          <Route path="bodega/caracteristicas" element={<CategoriasTable />} />
          <Route path="bodega/inventario/" element={<Inventario />} />
          <Route path="bodega/inventario/areas" element={<Inventario />} />
          <Route
            path="bodega/inventario/areas/:id"
            element={<InventarioArea />}
          />
          <Route
            path="bodega/inventario/areas/:id/sitios/:sitioId"
            element={<InventarioSitio />}
          />
          <Route path="report/inventario" element={<InventarioReportPage />} />
          <Route path="report/elementos" element={<UsuariosReportPage />} />
          <Route path="inventario/estadistica/" element={<StockEstadisticas />} />
          <Route path="movimientos/estadistica" element={<TopElementosUsados />} />
          <Route path="movimientos/mes/estadistica" element={<MovimientosMensuales />} />
          <Route path="elementos/estadistica" element={<ElementosEstadisticas />} />
          <Route path="estadisticas/usuarios" element={<UsuariosEstadisticas />} />
          <Route path="elementos/estadisticas" element={<ElementosEstadisticas />} />
          <Route path="solicitudes" element={<SolicitudTable />} />
        </Route>
      </Route>
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;

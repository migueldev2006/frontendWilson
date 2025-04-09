import { Route, Routes } from "react-router-dom"
import Layout from "./layouts/layout"
import Home from "./pages/Home/Home"
import Admin from "./pages/Admin/admin"
import DashboardEstadisticas from "./pages/Estadisticas/DashboardEstadisticas"
import { Bodega } from "./components/organismos/taps/Bodega";
import { SolicitudTable } from "./pages/Solicitudes/Solicitudes";
import { VerificacionTable } from "./pages/Verificaciones/Verificaciones";
import { Configuraciones } from "./components/organismos/taps/Configuraciones";
import { Reportes } from "./components/organismos/taps/Reportes";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="Home" element={<Home />} />
        <Route path="admin" element={<Admin/>}/>
        <Route path="bodega" element={<Bodega/>}/>
        <Route path="solicitudes" element={<SolicitudTable/>}/>
        <Route path="reportes" element={<Reportes/>}/>
        <Route path="verificaciones" element={<VerificacionTable/>}/>
        <Route path="configuraciones" element={<Configuraciones/>}/>
        <Route path="estadisticas" element={<DashboardEstadisticas/>}/>
      </Route>
    </Routes>
  )
}

export default App

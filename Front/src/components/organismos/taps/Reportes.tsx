import Tap from "@/components/molecules/Tabs";
import ElementoReportPage from "@/pages/Reportes/Elementos/Elemento";
import InventarioReportSelector from "@/pages/Reportes/Inventarios/Inventario";
import MovimientoReportSelector from "@/pages/Reportes/Movimientos/Movimiento";
import RolReportSelector from "@/pages/Reportes/Roles/Rol";
import SolicitudReportSelector from "@/pages/Reportes/Solicitudes/Solicitud";
import TipoReportSelector from "@/pages/Reportes/TiposMovimiento/TipoMovimiento";
import UnidadReportSelector from "@/pages/Reportes/UnidadesMedida/UnidadMedida";
import VerificacionReportSelector from "@/pages/Reportes/Verificaciones/Verificacion";

export const Reportes =() => {

        const tabs = [
            {
                key : "1",
                title : "Usuarios",
                content : ""
            },
            {
                key : "2",
                title : "Roles",
                content : <RolReportSelector/>
            },
            {
                key : "3",
                title : "Usuarios Por Ficha",
                content : ""
            },
            {
                key : "4",
                title : "Fichas",
                content :""
            },
            {
                key : "5",
                title : "Programas Formacion",
                content :""
            },
            {
                key : "6",
                title : "Areas",
                content :""
            },
            {
                key : "7",
                title : "Sedes",
                content :""
            },
            {
                key : "8",
                title : "Centros",
                content :""
            },
            {
                key : "9",
                title : "Municipios",
                content :""
            },
            {
                key : "10",
                title : "Sitios",
                content :""
            },
            {
                key : "11",
                title : "Tipos Sitio",
                content :""
            },
            {
                key : "12",
                title : "Inventario",
                content :<InventarioReportSelector/>
            },
            {
                key : "13",
                title : "Verificaciones",
                content :<VerificacionReportSelector/>
            },
            {
                key : "14",
                title : "Categorias",
                content :""
            },
            {
                key : "15",
                title : "Unidades Medida",
                content :<UnidadReportSelector/>
            },
            {
                key : "16",
                title : "Caracteristicas",
                content :""
            },
            {
                key : "17",
                title : "Elementos",
                content :<ElementoReportPage/>
            },
            {
                key : "18",
                title : "Solicitudes",
                content :<SolicitudReportSelector/>
            },
            {
                key : "19",
                title : "Movimientos",
                content :<MovimientoReportSelector/>
            },
            {
                key : "20",
                title : "Permisos",
                content :""
            },
            {
                key : "21",
                title : "Rol Modulo",
                content :""
            },
            {
                key : "22",
                title : "Rutas",
                content :""
            },
            {
                key : "23",
                title : "Modulos",
                content :""
            },
            {
                key : "24",
                title : "Tipo de Movimientos",
                content :<TipoReportSelector/>
            },
        ]

  return (
        
        <Tap tabs={tabs}></Tap>
  )
}


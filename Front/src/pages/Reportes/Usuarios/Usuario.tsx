import { useState } from "react";
import useReportes from "@/hooks/Usuarios/useReporte";  // Ajusta la ruta si es necesario
import { VisualizadorPDF } from "@/components/organismos/PDFVisualizer";
import { ReportTemplate } from "@/components/templates/Report";
import { ReportCard } from "@/components/molecules/ReportCard";
import {
  ReporteAsignacionElemento,
  ReporteUsuario,
  ReporteUsuariosPorFicha,
  ReporteMovimientosUsuarioElemento,
} from "@/types/Usuario";  // Ajusta la ruta si es necesario

export default function UsuariosReportPage() {
  const {
    usuariosConElementos,
    usuariosConRolYElementos,
    fichasConUsuarios,
    usuariosConMovimientos,
    isLoading,
    isError,
  } = useReportes();

  const [selectedReport, setSelectedReport] = useState<string | null>(null);

  const reports = [
    {
      id: "usuarios-con-elementos",
      title: "USUARIOS CON ELEMENTOS ASIGNADOS",
      description: (data: ReporteAsignacionElemento[]) =>
        `Se han asignado elementos a ${data.length} usuarios. Este reporte muestra los elementos asignados a cada uno.`,
      accessors: [
        "id_usuario",
        "nombre_usuario",
        "documento",
        "elementos_asignados",
      ],
      headers: ["ID Usuario", "Nombre Usuario", "Documento", "Elementos Asignados"],
      withTable: true,
      filterFn: () => usuariosConElementos || [],
    },
    {
      id: "usuarios-con-rol-y-elementos",
      title: "USUARIOS CON ROL Y ELEMENTOS",
      description: (data: ReporteUsuario[]) =>
        `Este reporte muestra los usuarios con su rol y los elementos asignados. Se han encontrado ${data.length} usuarios con asignaciones.`,
      accessors: [
        "id_usuario",
        "nombre_usuario",
        "documento",
        "rol",
        "nombre_elemento",
        "fecha_asignacion",
      ],
      headers: ["ID Usuario", "Nombre Usuario", "Documento", "Rol", "Elemento", "Fecha Asignación"],
      withTable: true,
      filterFn: () => usuariosConRolYElementos || [],
    },
    {
      id: "fichas-con-usuarios",
      title: "FICHAS CON USUARIOS ASIGNADOS",
      description: (data: ReporteUsuariosPorFicha[]) =>
        `Este reporte muestra las fichas y los usuarios asignados a cada una. Se han encontrado ${data.length} fichas con usuarios asignados.`,
      accessors: ["id_ficha", "codigo", "nombre", "total_usuarios"],
      headers: ["ID Ficha", "Código", "Nombre", "Total de Usuarios"],
      withTable: true,
      filterFn: () => fichasConUsuarios || [],
    },
    {
      id: "usuarios-con-movimientos",
      title: "USUARIOS CON MOVIMIENTOS REGISTRADOS",
      description: (data: ReporteMovimientosUsuarioElemento[]) =>
        `Este reporte muestra los usuarios con movimientos registrados. Se han encontrado ${data.length} movimientos.`,
      accessors: [
        "id_usuario",
        "nombre_usuario",
        "documento",
        "rol",
        "nombre_elemento",
        "total_movimientos",
      ],
      headers: ["ID Usuario", "Nombre Usuario", "Documento", "Rol", "Elemento", "Total de Movimientos"],
      withTable: true,
      filterFn: () => usuariosConMovimientos || [],
    },
  ];

  if (isLoading) return <div>Cargando reportes...</div>;
  if (isError) return <div>Error al cargar reportes.</div>;

  const selected = reports.find((r) => r.id === selectedReport);
  const handleBack = () => setSelectedReport(null);

  if (selectedReport && selected) {
    const dataFiltrada = selected.filterFn();
    return (
      <VisualizadorPDF
        onBack={handleBack}
        component={
          <ReportTemplate
            title={selected.title}
            description={selected.description(dataFiltrada as any)}
            headers={selected.headers}
            accessors={selected.accessors}
            data={dataFiltrada as any}
          />
        }
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      {reports.map((r) => (
        <ReportCard
          key={r.id}
          title={r.title}
          description={
            typeof r.description === "function"
              ? r.description(r.filterFn() as any)
              : ""
          }
          onClick={() => setSelectedReport(r.id)}
        />
      ))}
    </div>
  );
}

import { useState } from "react";
import useReportes from "@/hooks/Usuarios/useReporte"; // Ajusta la ruta si es necesario
import { VisualizadorPDF } from "@/components/organismos/pdf/PDFVisualizer";
import { ReportTemplate } from "@/components/templates/Report";
import { ReportCard } from "@/components/molecules/ReportCard";
import {
  ReporteAsignacionElemento,
  ReporteUsuario,
  ReporteUsuariosPorFicha,
  ReporteMovimientosUsuarioElemento,
} from "@/types/Usuario"; // Ajusta la ruta si es necesario

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
  const [fechaInicio, setFechaInicio] = useState<string>("");
  const [fechaFin, setFechaFin] = useState<string>("");

  const filtrarPorFechas = <T extends { created_at: string }>(
    data: T[],
    fechaInicio: string,
    fechaFin: string
  ): T[] => {
    if (!fechaInicio || !fechaFin) return data;
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    return data.filter((item) => {
      const fecha = new Date(item.created_at);
      return fecha >= inicio && fecha <= fin;
    });
  };

  const formatFecha = (fecha: string) => {
    if (!fecha) return "sin filtro";
    return new Date(fecha).toLocaleDateString("es-CO", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const reports = [
    {
      id: "usuarios-con-elementos",
      title: "REPORTE DE USUARIOS CON ELEMENTOS ASIGNADOS – SGDSS",
      description: (data: ReporteAsignacionElemento[]) =>
        `
${fechaInicio || "sin filtro"} a ${fechaFin || "sin filtro"}
    
Este reporte presenta una visión general de los usuarios que tienen elementos asignados dentro del sistema de gestión de inventarios del SGDSS. Muestra la cantidad de usuarios que han recibido asignaciones de elementos, junto con los detalles de cada asignación.
    
Se han asignado elementos a un total de ${data.length} usuarios. Este informe busca brindar claridad sobre qué recursos están bajo la responsabilidad de cada usuario, facilitando el control y la administración eficiente de los elementos distribuidos dentro de la organización.`,
      tableDescription: `
La anterior tabla proporcionada muestra a cada usuario con los elementos que le han sido asignados dentro del rango de fechas especificado.
    
Cada fila representa a un usuario distinto y detalla los elementos específicos que se le han asignado. Esta información es clave para asegurar el uso responsable de los recursos y facilita la auditoría y planificación de asignaciones.
    
La trazabilidad que ofrece este reporte permite a los encargados de cada unidad monitorear eficientemente el uso y la distribución de los elementos, contribuyendo así a una gestión transparente y efectiva de los recursos institucionales.`,
      footerText:
"Este reporte ha sido generado automáticamente por el sistema de gestión de inventarios del SGDSS. La información aquí contenida es confidencial y está destinada exclusivamente para fines de control interno y toma de decisiones logísticas. Cualquier discrepancia detectada debe ser reportada a la coordinación administrativa.",
      accessors: [
        "id_usuario",
        "nombre_usuario",
        "documento",
        "elementos_asignados",
      ],
      headers: [
        "ID Usuario",
        "Nombre Usuario",
        "Documento",
        "Elementos Asignados",
      ],
      withTable: true,
      filterFn: () =>
        filtrarPorFechas(usuariosConElementos || [], fechaInicio, fechaFin),
    },

    {
      id: "usuarios-con-rol-y-elementos",
      title: "USUARIOS CON ROL Y ELEMENTOS",
      description: (data: ReporteUsuario[]) =>
        `
Del ${formatFecha(fechaInicio)} al ${formatFecha(fechaFin)}\n\n` +
        `
Se han encontrado ${data.length} usuarios con rol y elementos asignados.`,
      tableDescription: `La tabla presenta el detalle de los usuarios que tienen asignado un rol dentro del sistema, así como los elementos que les han sido entregados durante el periodo seleccionado. Cada fila representa una asignación específica, mostrando el nombre del usuario, su documento de identificación, el rol que desempeña, el nombre del elemento asignado y la fecha en que se realizó dicha asignación. Esta información permite identificar responsabilidades, distribuir recursos de manera eficiente y mantener un registro actualizado del uso de los activos.`,

      footerText:
"Este reporte ha sido generado automáticamente por el sistema de gestión de inventarios del SGDSS. La información aquí contenida es confidencial y está destinada exclusivamente para fines de control interno y toma de decisiones logísticas. Cualquier discrepancia detectada debe ser reportada a la coordinación administrativa.",
      accessors: [
        "id_usuario",
        "nombre_usuario",
        "documento",
        "rol",
        "nombre_elemento",
        "fecha_asignacion",
      ],
      headers: [
        "ID Usuario",
        "Nombre Usuario",
        "Documento",
        "Rol",
        "Elemento",
        "Fecha Asignación",
      ],
      withTable: true,
      filterFn: () =>
        filtrarPorFechas(usuariosConRolYElementos || [], fechaInicio, fechaFin),
    },
    {
      id: "fichas-con-usuarios",
      title: "FICHAS CON USUARIOS ASIGNADOS",
      description: (data: ReporteUsuariosPorFicha[]) =>
        `
Del ${formatFecha(fechaInicio)} al ${formatFecha(fechaFin)}\n\n` +
        `
Se han encontrado ${data.length} fichas con usuarios asignados.`,

      tableDescription: `
Esta tabla muestra el resumen de las fichas registradas en el sistema que tienen usuarios asignados durante el periodo seleccionado. Cada fila representa una ficha específica, incluyendo su identificador único, el código correspondiente, el nombre o descripción de la ficha, y la cantidad total de usuarios vinculados a ella. Esta información es clave para el seguimiento de la distribución de usuarios en programas o grupos formativos, facilitando el control académico, administrativo y logístico.`,

      footerText:
"Este reporte ha sido generado automáticamente por el sistema de gestión de inventarios del SGDSS. La información aquí contenida es confidencial y está destinada exclusivamente para fines de control interno y toma de decisiones logísticas. Cualquier discrepancia detectada debe ser reportada a la coordinación administrativa.",
      accessors: ["id_ficha", "codigo", "nombre", "total_usuarios"],
      headers: ["ID Ficha", "Código", "Nombre", "Total de Usuarios"],
      withTable: true,
      filterFn: () =>
        filtrarPorFechas(fichasConUsuarios || [], fechaInicio, fechaFin),
    },
    {
      id: "usuarios-con-movimientos",
      title: "USUARIOS CON MOVIMIENTOS REGISTRADOS",
      description: (data: ReporteMovimientosUsuarioElemento[]) =>
        `
Del ${formatFecha(fechaInicio)} al ${formatFecha(fechaFin)}\n\n` +
        `
Hay ${data.length} usuarios con movimientos registrados.`,

      tableDescription: `
Esta tabla presenta un resumen detallado de los usuarios que han realizado movimientos de inventario dentro del sistema durante el periodo especificado. Cada fila representa la participación de un usuario en el registro de movimientos relacionados con elementos asignados o gestionados. Un "movimiento" puede incluir acciones como entregas, devoluciones, reasignaciones o cualquier otra operación que implique la transferencia, modificación o actualización de un elemento dentro del inventario institucional.`,

      footerText:
"Este reporte ha sido generado automáticamente por el sistema de gestión de inventarios del SGDSS. La información aquí contenida es confidencial y está destinada exclusivamente para fines de control interno y toma de decisiones logísticas. Cualquier discrepancia detectada debe ser reportada a la coordinación administrativa.",
      accessors: [
        "id_usuario",
        "nombre_usuario",
        "documento",
        "rol",
        "nombre_elemento",
        "total_movimientos",
      ],
      headers: [
        "ID Usuario",
        "Nombre Usuario",
        "Documento",
        "Rol",
        "Elemento",
        "Total de Movimientos",
      ],
      withTable: true,
      filterFn: () =>
        filtrarPorFechas(usuariosConMovimientos || [], fechaInicio, fechaFin),
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
            tableDescription={selected.tableDescription}
            footerText={selected.footerText}
          />
        }
      />
    );
  }

  return (
    <>
      <div className="flex justify-center items-center ">
        <div className="flex flex-col md:flex-row gap-4 p-4">
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-center">
              Fecha inicio
            </label>
            <input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              className="border rounded px-2 py-1"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-center">
              Fecha fin
            </label>
            <input
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              className="border rounded px-2 py-1"
            />
          </div>
        </div>
      </div>
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
    </>
  );
}

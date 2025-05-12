import { useState } from "react";
import useReportes from "@/hooks/Usuarios/useReporte";
import useElementosPrestamo from "@/hooks/Elementos/useElementosPrestamo";
import { VisualizadorPDF } from "@/components/organismos/pdf/PDFVisualizer";
import { ReportTemplate } from "@/components/templates/Report";
import { ReportCard } from "@/components/molecules/ReportCard";
import {
  ReporteAsignacionElemento,
  
} from "@/types/Usuario";

export default function UsuariosReportPage() {
  const {
    usuariosConElementos,
    isLoading: isLoadingAsignaciones,
    isError: isErrorAsignaciones,
  } = useReportes();

  const {
  data: elementosPrestamo,
  isLoading: isLoadingPrestamo,
  isError: isErrorPrestamo,
} = useElementosPrestamo();



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
      title: "ASIGNACION DE ELEMENTOS",
      description: (data: ReporteAsignacionElemento[]) => `
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
  id: "elementos-en-prestamo",
  title: "ELEMENTOS EN ESTADO DE PRÉSTAMO",
  description: (data: any[]) => `
${fechaInicio || "sin filtro"} a ${fechaFin || "sin filtro"}

Este reporte presenta un listado de los elementos actualmente en estado de préstamo. Permite conocer qué usuarios tienen elementos en préstamo, la cantidad y detalles de cada elemento, junto con la fecha de salida.

El total de préstamos en proceso es de ${data.length}, lo que refleja la actividad actual del inventario y facilita el seguimiento de materiales prestados.`,
  tableDescription: `
La siguiente tabla detalla cada elemento en estado de préstamo actualmente activo. Incluye el nombre del usuario, el nombre del elemento, su descripción, cantidad y fecha de salida.

Este reporte es útil para llevar control de los elementos en circulación y para planificar recuperaciones o seguimientos.`,
  footerText:
    "Este reporte ha sido generado automáticamente por el sistema de gestión del SGDSS. Verifique que los datos correspondan con los registros físicos para evitar inconsistencias.",
  accessors: [
    "id_movimiento",
    "nombre_usuario",
    "documento",
    "nombre_elemento",
    "descripcion_elemento",
    "cantidad",
    "fecha_salida",
  ],
  headers: [
    "ID Movimiento",
    "Nombre Usuario",
    "Documento",
    "Elemento",
    "Descripción",
    "Cantidad",
    "Fecha de Salida",
  ],
  withTable: true,
  filterFn: () =>
    filtrarPorFechas(elementosPrestamo || [], fechaInicio, fechaFin), 
    }
  ];

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

import { useState } from "react";
import useReporte from "@/hooks/Inventarios/useReporte";
import { VisualizadorPDF } from "@/components/organismos/pdf/PDFVisualizer";
import { ReportTemplate } from "@/components/templates/Report";
import { ReportCard } from "@/components/molecules/ReportCard";
import {
  ReporteInventario,
  ReporteElementosPorAgotarse,
} from "@/types/Inventario";

export default function InventarioReportPage() {
  const {
    reporteInventario,
    elementosPorAgotarse,
    isLoading,
    isError,
  } = useReporte();

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
      id: "general",
      title: "Inventario General",
      description: (data: ReporteInventario[]) =>
        `${formatFecha(fechaInicio)} al ${formatFecha(fechaFin)}
      
Este reporte resume todos los elementos registrados en el sistema de gestión de inventarios del SGDSS, incluyendo su categoría, cantidad actual, unidad de medida, y ubicación por sede y sitio.
      
Se han registrado un total de ${data.length} elementos.`,

tableDescription: `

La anterior tabla proporcionada muestra el inventario completo, detallando cada elemento con su categoría, cantidad disponible, unidad de medida y ubicación específica dentro de la organización.
Este reporte busca proporcionar una visión integral del estado actual de los recursos materiales registrados en el sistema. Cada fila representa un ítem del inventario que ha sido categorizado, cuantificado y georreferenciado con base en su ubicación física (sede y sitio), lo cual permite una trazabilidad efectiva y una gestión más eficiente de los activos institucionales.

La información presentada es fundamental para la toma de decisiones estratégicas en cuanto a abastecimiento, mantenimiento y redistribución de elementos. Además, este reporte facilita la identificación de posibles inconsistencias, faltantes o excesos, promoviendo así una cultura de control interno y mejora continua.

Es importante destacar que los datos han sido recopilados mediante procesos sistemáticos y actualizados periódicamente, lo que garantiza su confiabilidad en los análisis administrativos. La tabla también sirve como respaldo documental para auditorías internas o externas, así como para la planificación de adquisiciones y gestión de presupuestos.

Se recomienda a los responsables de cada unidad revisar detalladamente la información correspondiente a su sede o sitio, y reportar cualquier anomalía a la coordinación administrativa para su pronta verificación y corrección.`,

footerText:
"Este reporte ha sido generado automáticamente por el sistema de gestión de inventarios del SGDSS. La información aquí contenida es confidencial y está destinada exclusivamente para fines de control interno y toma de decisiones logísticas. Cualquier discrepancia detectada debe ser reportada a la coordinación administrativa.",
      accessors: [
        "nombre_elemento",
        "nombre_categoria",
        "cantidad",
        "unidad_medida",
        "nombre_sede",
        "nombre_sitio",
        "created_at"
      ],
      headers: ["Elemento", "Categoría", "Cantidad", "Unidad", "Sede", "Sitio", "Fecha"],
      withTable: true,
      filterFn: () => filtrarPorFechas(reporteInventario || [], fechaInicio, fechaFin),
    },

    {
      id: "elementos-por-agotarse",
      title: "Materiales próximos a agotarse",
      description: (data: ReporteElementosPorAgotarse[]) =>
        `
${formatFecha(fechaInicio)} al ${formatFecha(fechaFin)}
        
Este reporte identifica los elementos cuyo stock ha caído por debajo del umbral crítico (menos de 5 unidades).
Actualmente hay ${data.length} elementos en esta condición.`,
      tableDescription: `
La siguiente tabla lista todos los elementos cuyo nivel de inventario ha caído por debajo del umbral crítico (menos de 5 unidades), lo que indica una alerta de stock bajo que debe ser atendida con prontitud.
Cada fila representa un elemento que se encuentra en riesgo de agotarse, y cuya falta podría afectar la continuidad de las operaciones internas. La tabla muestra el nombre del elemento y su cantidad actual disponible, sirviendo como una herramienta esencial para priorizar procesos de reabastecimiento.

Este reporte es particularmente útil para las áreas encargadas de compras y logística, ya que permite identificar de forma anticipada los insumos que deben ser adquiridos. Además, es una medida preventiva que fortalece la planificación de recursos, evitando interrupciones en los servicios y actividades institucionales.

Se recomienda a los responsables revisar estos datos de forma periódica y programar reposiciones antes de que los niveles lleguen a cero, reduciendo así los riesgos operativos. La actualización constante de este reporte asegura su efectividad como mecanismo de alerta temprana dentro del sistema de gestión de inventarios.`,

      footerText:
"Este reporte ha sido generado automáticamente por el sistema de gestión de inventarios del SGDSS. La información aquí contenida es confidencial y está destinada exclusivamente para fines de control interno y toma de decisiones logísticas. Cualquier discrepancia detectada debe ser reportada a la coordinación administrativa.",
      accessors: ["nombre_elemento", "stock"],
      headers: ["Elemento", "Stock"],
      withTable: true,
      filterFn: () => elementosPorAgotarse || [],
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

import { useState } from "react";
import useReporte from "@/hooks/Inventarios/useReporte";
import { VisualizadorPDF } from "@/components/organismos/pdf/PDFVisualizer";
import { ReportTemplate } from "@/components/templates/Report";
import { ReportCard } from "@/components/molecules/ReportCard";
import {
  ReporteInventario,
  ReporteAreaConMasElementos,
  ReporteCantidadElementosPorArea,
  ReporteElementosPorAgotarse,
} from "@/types/Inventario";

export default function InventarioReportPage() {
  const {
    reporteInventario,
    areaConMasElementos,
    elementosPorAgotarse,
    conteoInventarioElemento,
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
      title: "REPORTE GENERAL DE INVENTARIO – SGDSS Sede Yamboro",
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
      title: "ELEMENTOS POR AGOTARSE – Alerta de Stock Bajo",
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
    {
      id: "conteo-elementos",
      title: "CONTEO DE ELEMENTOS EN INVENTARIO",
      description: (data: ReporteCantidadElementosPorArea[]) =>
        ` 
${formatFecha(fechaInicio)} al ${formatFecha(fechaFin)}
        
Este informe presenta un resumen del número total de elementos por cada área funcional.\n\nSe registran ${data.reduce((acc, d) => acc + d.cantidad, 0)} elementos en ${data.length} áreas.`,
      tableDescription: `
Esta tabla presenta una visión global del número total de elementos registrados en cada área funcional dentro del sistema de inventarios del SGDSS.

Cada fila representa un área específica y muestra la cantidad agregada de elementos que le han sido asignados o que se encuentran bajo su responsabilidad. Esta información permite hacer análisis comparativos entre áreas, identificar desequilibrios en la distribución de recursos y orientar decisiones sobre redistribución o planificación de compras.
El reporte facilita el monitoreo de la carga de inventario por área, promoviendo una gestión más equitativa y transparente de los bienes institucionales. También contribuye al diseño de estrategias logísticas según la demanda operativa de cada unidad.

La disponibilidad de estos datos respalda la toma de decisiones basadas en evidencia y fortalece los procesos de auditoría y control interno. Los responsables de cada área deben utilizar esta tabla para verificar la congruencia entre el inventario físico y el registrado, y comunicar cualquier discrepancia para su ajuste oportuno.`,

      footerText:
"Este reporte ha sido generado automáticamente por el sistema de gestión de inventarios del SGDSS. La información aquí contenida es confidencial y está destinada exclusivamente para fines de control interno y toma de decisiones logísticas. Cualquier discrepancia detectada debe ser reportada a la coordinación administrativa.",
      accessors: ["nombre_area", "cantidad"],
      headers: ["Área", "Cantidad Total"],
      withTable: true,
      filterFn: () => (conteoInventarioElemento || []),
    },
    {
      id: "area-mas-elementos",
      title: "ÁREA CON MÁS ELEMENTOS REGISTRADOS",
      description: (data: ReporteAreaConMasElementos[]) => {
        if (!data || data.length === 0) {
          return "No se encontraron datos suficientes para determinar el área con mayor cantidad de elementos registrados.";
        }

        const top = data[0];
        return `
${formatFecha(fechaInicio)} al ${formatFecha(fechaFin)}

Este reporte identifica el área con mayor cantidad de elementos registrados.

El área "${top.nombre_area}" registra un total de ${top.total_elementos} unidades.


          `.trim();
      },
      tableDescription: `
La siguiente tabla muestra cuál es el área funcional que actualmente concentra la mayor cantidad de elementos registrados en el sistema de inventarios.

Este tipo de información es clave para comprender la distribución de activos dentro de la organización y evaluar si dicha concentración responde a necesidades operativas reales, o si por el contrario, podría estar generando un acaparamiento innecesario de recursos.

Identificar el área con más elementos también permite priorizar inspecciones, auditorías o procesos de verificación en dicha unidad, con el fin de garantizar que los recursos estén siendo utilizados eficientemente y no estén subutilizados o en condición de obsolescencia.

Esta tabla puede servir como punto de partida para planes de redistribución o ajustes logísticos, buscando siempre una asignación más racional de los bienes institucionales. Asimismo, fomenta la rendición de cuentas y la transparencia en la gestión del inventario a nivel organizacional.`,

      footerText:
"Este reporte ha sido generado automáticamente por el sistema de gestión de inventarios del SGDSS. La información aquí contenida es confidencial y está destinada exclusivamente para fines de control interno y toma de decisiones logísticas. Cualquier discrepancia detectada debe ser reportada a la coordinación administrativa.",
      accessors: ["nombre_area", "total_elementos"],
      headers: ["Área", "Total de elementos"],
      withTable: true,
      filterFn: () => (areaConMasElementos ? [areaConMasElementos] : []),
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

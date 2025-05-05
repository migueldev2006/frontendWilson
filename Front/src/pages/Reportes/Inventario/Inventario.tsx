import { useState } from "react";
import useReporte from "@/hooks/Inventarios/useReporte";
import { VisualizadorPDF } from "@/components/organismos/PDFVisualizer";
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

  function filtrarPorFecha<T extends { fecha?: string }>(
    data: T[],
    fechaInicio?: string,
    fechaFin?: string
  ): T[] {
    if (!fechaInicio || !fechaFin) return data;
    return data.filter((item) => {
      if (!item.fecha) return false;
      return item.fecha >= fechaInicio && item.fecha <= fechaFin;
    });
  }

  const reports = [
    {
      id: "general",
      title: "REPORTE GENERAL DE INVENTARIO – SGDSS Sede Yamboro",
      description: (data: ReporteInventario[]) =>
        `
      
       ${fechaInicio || "sin filtro"} a ${fechaFin || "sin filtro"}
      
      Este reporte resume todos los elementos registrados en el sistema de gestión de inventarios del SGDSS, incluyendo su categoría, cantidad actual, unidad de medida, y ubicación por sede y sitio.
      
      Se han registrado un total de ${data.length} elementos.`,
      tableDescription:
        "La siguiente tabla muestra el inventario completo, detallando cada elemento con su categoría, cantidad disponible, unidad de medida y ubicación específica dentro de la organización.",
      accessors: [
        "nombre_elemento",
        "nombre_categoria",
        "cantidad",
        "unidad_medida",
        "nombre_sede",
        "nombre_sitio",
      ],
      headers: ["Elemento", "Categoría", "Cantidad", "Unidad", "Sede", "Sitio"],
      withTable: true,
      filterFn: () => reporteInventario || [],
    },
    {
      id: "elementos-por-agotarse",
      title: "ELEMENTOS POR AGOTARSE – Alerta de Stock Bajo",
      description: (data: ReporteElementosPorAgotarse[]) =>
        `
       ${fechaInicio || "sin filtro"} a ${fechaFin || "sin filtro"}
      
      Este reporte identifica los elementos cuyo stock ha caído por debajo del umbral crítico (menos de 5 unidades).
      Actualmente hay ${data.length} elementos en esta condición.\n\nRango de fechas aplicado:`,
      tableDescription:
        "La tabla siguiente lista los elementos con niveles de stock críticamente bajos. Es crucial revisar y reponer estos insumos con prioridad.",
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
      ${fechaInicio || "sin filtro"} a ${fechaFin || "sin filtro"}
      
      Este informe presenta un resumen del número total de elementos por cada área funcional.\n\nSe registran ${data.reduce((acc, d) => acc + d.cantidad, 0)} elementos en ${data.length} áreas.`,
      tableDescription:
        "Esta tabla muestra la cantidad total de elementos almacenados por cada área del sistema.",
      accessors: ["nombre_area", "cantidad"],
      headers: ["Área", "Cantidad Total"],
      withTable: true,
      filterFn: () => conteoInventarioElemento || [],
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
${fechaInicio || "sin filtro"} a ${fechaFin || "sin filtro"}


Este reporte identifica el área con mayor cantidad de elementos registrados.

El área "${top.nombre_area}" registra un total de ${top.total_elementos} unidades.


        `.trim();
      },
      tableDescription:
        "La tabla muestra el área con mayor cantidad de elementos registrados actualmente en el sistema.",
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
          />
        }
      />
    );
  }

  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 p-4">
        <div className="flex flex-col">
          <label className="text-sm font-semibold">Fecha inicio</label>
          <input
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            className="border rounded px-2 py-1"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-semibold">Fecha fin</label>
          <input
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
            className="border rounded px-2 py-1"
          />
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

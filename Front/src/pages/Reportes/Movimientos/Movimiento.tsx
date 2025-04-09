import { useState } from "react";
import { VisualizadorPDF } from "@/components/organismos/PDFVisualizer";
import { ReportTemplate } from "@/components/templates/Report";
import { ReportCard } from "@/components/molecules/ReportCard";
import { useMovimiento } from "@/hooks/Movimientos/useMovimiento";
import { Movimiento } from "@/types/Movimiento";

export default function MovimientoReportSelector() {
  const { movimientos } = useMovimiento();
  const [selectedReport, setSelectedReport] = useState<string | null>(null);

  if (!movimientos) return <p>Cargando...</p>;

  const reports = [
    {
      id: "todos",
      title: "Movimientos de Inventario",
      description: (data: Movimiento[]) => {
        const total = data.length;
        const aceptados = data.filter((m) => m.aceptado).length;
        const enProceso = data.filter((m) => m.en_proceso).length;
        const cancelados = data.filter((m) => m.cancelado).length;
  
        const devolutivos = data.filter((m) => m.devolutivo).length;
        const noDevolutivos = data.filter((m) => m.no_devolutivo).length;
  
        const ultimaActualizacion = new Date(
          data.reduce((max, m) =>
            new Date(m.updated_at) > new Date(max.updated_at) ? m : max
          ).updated_at
        ).toLocaleDateString();
  
        return `
          Este reporte presenta un resumen detallado de todos los movimientos registrados en el sistema de inventario.
  
          En total, se han registrado ${total} movimientos, de los cuales ${aceptados} han sido aceptados, 
          ${enProceso} se encuentran en proceso, y ${cancelados} han sido cancelados.
  
          En cuanto a su naturaleza, ${devolutivos} corresponden a elementos devolutivos y ${noDevolutivos} a no devolutivos.
  
          Esta información permite analizar el flujo de elementos dentro del sistema, evaluar el estado actual de las solicitudes 
          y tomar decisiones estratégicas sobre la gestión de recursos.
  
          La última actualización de datos se registró el día ${ultimaActualizacion}.
        `;
      },
      headers: [
        "Descripción",
        "Cantidad",
        "Hora de Ingreso",
        "Hora de Salida",
        "Fecha de Registro",
      ],
      accessors: [
        "descripcion",
        "cantidad",
        "hora_ingreso",
        "hora_salida",
        "created_at",
      ],
      withTable: true,
      filterFn: (data: Movimiento[]) => data,
    },
  ];
  
  

  const selected = reports.find((r) => r.id === selectedReport);
  const handleBack = () => setSelectedReport(null);

  if (selectedReport && selected) {
    const dataFiltrada = selected.filterFn(movimientos);

    return (
      <VisualizadorPDF
        onBack={handleBack}
        component={
          <ReportTemplate
            title={selected.title}
            description={selected.description(dataFiltrada)}
            headers={
              selected.withTable && selected.headers ? selected.headers : []
            }
            accessors={
              selected.withTable && selected.accessors ? selected.accessors : []
            }
            data={selected.withTable ? dataFiltrada : []}
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
              ? r.description(movimientos)
              : ""
          }
          onClick={() => setSelectedReport(r.id)}
        />
      ))}
    </div>
  );
}

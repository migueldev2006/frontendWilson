import { useState } from "react";
import { VisualizadorPDF } from "@/components/organismos/PDFVisualizer";
import { ReportTemplate } from "@/components/templates/Report";
import { ReportCard } from "@/components/molecules/ReportCard";
import { useInventario } from "@/hooks/Inventarios/useInventario";
import { Inventario } from "@/types/Inventario";

export default function InventarioReportSelector() {
  const { inventarios } = useInventario();
  const [selectedReport, setSelectedReport] = useState<string | null>(null);

  if (!inventarios) return <p>Cargando...</p>;

  const reports = [
    {
      id: "todos",
      title: "Inventarios",
      description: (data: Inventario[]) => {
        const total = data.length;
        const activos = data.filter((i) => i.estado).length;
        const inactivos = total - activos;

        const fechaMasReciente = data.reduce((ultima, actual) => {
          const fechaActual = new Date(actual.updated_at);
          return fechaActual > new Date(ultima.updated_at) ? actual : ultima;
        }, data[0]);

        return `
El presente reporte detalla el estado de los tipos de movimiento registrados en el sistema de inventario. 
Actualmente, se encuentran registrados un total de ${total} movimientos de inventario, 
de los cuales ${activos} están activos y ${inactivos} inactivos.
      
La última modificación registrada en los movimientos se realizó el día ${new Date(fechaMasReciente.updated_at).toLocaleDateString()}.
          
Este informe permite una visión general del comportamiento de los movimientos asociados a los elementos dentro de los distintos sitios, 
proporcionando información clave para la toma de decisiones y control logístico.
        `;
      },
      headers: ["Stock", "Fecha Creacion", "Fecha Actualizacion"],
      accessors: ["stock", "created_at", "updated_at"],
      withTable: true,
      filterFn: (data: Inventario[]) => data,
    },
  ];

  const selected = reports.find((r) => r.id === selectedReport);
  const handleBack = () => setSelectedReport(null);

  if (selectedReport && selected) {
    const dataFiltrada = selected.filterFn(inventarios);

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
              ? r.description(inventarios)
              : ""
          }
          onClick={() => setSelectedReport(r.id)}
        />
      ))}
    </div>
  );
}

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
      title: "Tipos de Movimiento Registrados",
      description: (data: Inventario[]) => {
        return ``;
      },
      headers: [""],
      accessors: [""],
      withTable: false,
      filterFn: (data: Inventario[]) => data,
    },
    {
      id: "",
      title: "",
      description: (data: Inventario[]) => {
        return `hola`;
      },
      withTable: false,
      filterFn: (data: Inventario[]) => data,
    },
    {
      id: "",
      title: "",
      description: (data: Inventario[]) => {
        return `hola`;
      },
      withTable: false,
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

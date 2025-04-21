import { useState } from "react";
import { VisualizadorPDF } from "@/components/organismos/PDFVisualizer";
import { ReportTemplate } from "@/components/templates/Report";
import { ReportCard } from "@/components/molecules/ReportCard";
import { useUnidad } from "@/hooks/UnidadesMedida/useUnidad";
import { Unidad } from "@/types/Unidad";

export default function UnidadReportSelector() {
  const { unidades } = useUnidad();
  const [selectedReport, setSelectedReport] = useState<string | null>(null);

  if (!unidades) return <p>Cargando...</p>;

  const reports = [
    {
      id: "todos",
      title: "Tipos de Movimiento Registrados",
      description: (data: Unidad[]) => {
        const total = data.length;
        return `
Los Tipos de Movimiento, un factor clave  ala hora de realizar un movimiento ya que gracias a ello podemos identificar que se realizara en los movimientos.

No obstante  no facilitaran aun mas la inetraccion entre los movimientos.

Se han registrado un total de ${total} tipos de movimiento.

A continuacion bridaremos un listado general de los roles registrado en el sistema.`;
      },
      accessors: ["nombre", "created_at"],
      headers: ["Nombre", "Fecha de creación"],
      withTable: true,
      filterFn: (data: Unidad[]) => data,
    },
    {
      id: "",
      title: "",
      description: (data: Unidad[]) => {
        return `hola`;
      },
      withTable: false,
      filterFn: (data: Unidad[]) => data,
    },
    {
      id: "",
      title: "",
      description: (data: Unidad[]) => {
        return `hola`;
      },
      withTable: false,
      filterFn: (data: Unidad[]) => data,
    },
  ];

  const selected = reports.find((r) => r.id === selectedReport);
  const handleBack = () => setSelectedReport(null);

  if (selectedReport && selected) {
    const dataFiltrada = selected.filterFn(unidades);

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
            typeof r.description === "function" ? r.description(unidades) : ""
          }
          onClick={() => setSelectedReport(r.id)}
        />
      ))}
    </div>
  );
}

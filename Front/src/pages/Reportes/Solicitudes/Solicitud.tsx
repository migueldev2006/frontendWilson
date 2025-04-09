import { useState } from "react";
import { VisualizadorPDF } from "@/components/organismos/PDFVisualizer";
import { ReportTemplate } from "@/components/templates/Report";
import { ReportCard } from "@/components/molecules/ReportCard";
import { useSolicitud } from "@/hooks/Solicitudes/useSolicitud";
import { Solicitud } from "@/types/Solicitud";

export default function SolicitudReportSelector() {
  const { solicitudes } = useSolicitud();
  const [selectedReport, setSelectedReport] = useState<string | null>(null);

  if (!solicitudes) return <p>Cargando...</p>;

  const reports = [
    {
      id: "todos",
      title: "Solicitudes Registradas",
      description: (data: Solicitud[]) => {
        const total = data.length
        return `
Enter tanto nos encontramos con las solicitudes la cuales decribe la forma en la que se es solicitado un elemento hasta su acepatcion, es importante aclarar que gracias  a estas solicitudes no es posible entender cual  quien es el usuario encargado de realizra la solicitud, a que elemnto la solicito y la cantidad.

Sin embargo no siempre podremos depender de estas ya que en muchas ocasiones se deben realizar movimientos en su lugar.

En tanto conocemos que haya un total de ${total} solicitudes realizadas.
`;
      },
      headers: ["Descripcion", "Cantidad", "Fecha Creacion"],
      accessors: ["descripcion", "cantidad", "created_at"],
      withTable: true,
      filterFn: (data: Solicitud[]) => data,
    },
  ];

  const selected = reports.find((r) => r.id === selectedReport);
  const handleBack = () => setSelectedReport(null);

  if (selectedReport && selected) {
    const dataFiltrada = selected.filterFn(solicitudes);

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
              ? r.description(solicitudes)
              : ""
          }
          onClick={() => setSelectedReport(r.id)}
        />
      ))}
    </div>
  );
}

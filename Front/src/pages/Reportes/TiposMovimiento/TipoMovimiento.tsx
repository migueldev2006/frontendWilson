import { useState } from "react";
import { VisualizadorPDF } from "@/components/organismos/PDFVisualizer";
import { ReportTemplate } from "@/components/templates/Report";
import { ReportCard } from "@/components/molecules/ReportCard";
import { useTipoMovimiento } from "@/hooks/TiposMovimento/useTipoMovimiento";
import { TipoMovimiento } from "@/types/TipoMovimiento";

export default function TipoReportSelector() {
  const { tipos } = useTipoMovimiento();
  const [selectedReport, setSelectedReport] = useState<string | null>(null);

  if (!tipos) return <p>Cargando...</p>;

  const reports = [
    {
      id: "todos",
      title: "Tipos de Movimiento Registrados",
      description: (data: TipoMovimiento[]) => {
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
      filterFn: (data: TipoMovimiento[]) => data,
    },
    {
      id: "activos",
      title: "Roles Activos",
      description: (data: TipoMovimiento[]) => {
        const activos = data.filter((e) => e.estado);
        const total = activos.length;
        return `
Tenemos entre la garn variedad de roles no siempre todos van a estar activos hay algunas ocasiones en las que por motivos de no implementar mas un rol que se deciden llevar acabo el proceso de desactivacion bien sea que por el momento ya no hay usuarios con ese rol o que posiblemente no se vilvera a usar mas

Actualmente hay ${total} roles con estado activo.

Estos roles representan los recursos disponibles y operativos dentro del sistema.`;
      },
      accessors: ["nombre", "valor", "created_at"],
      headers: ["Nombre", "Valor", "Fecha de creación"],
      withTable: true,
      filterFn: (data: TipoMovimiento[]) => data.filter((e) => e.estado),
    },
    {
      id: "",
      title: "",
      description: (data: TipoMovimiento[]) => {
        return `hola`;
      },
      withTable: false,
      filterFn: (data: TipoMovimiento[]) => data,
    },
  ];

  const selected = reports.find((r) => r.id === selectedReport);
  const handleBack = () => setSelectedReport(null);

  if (selectedReport && selected) {
    const dataFiltrada = selected.filterFn(tipos);

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
            typeof r.description === "function" ? r.description(tipos) : ""
          }
          onClick={() => setSelectedReport(r.id)}
        />
      ))}
    </div>
  );
}

import { useState } from "react";
import { VisualizadorPDF } from "@/components/organismos/PDFVisualizer";
import { ReportTemplate } from "@/components/templates/Report";
import { ReportCard } from "@/components/molecules/ReportCard";
import { useModulo } from "@/hooks/Modulos/useModulo";
import { Modulo } from "@/types/Modulo";

export default function ModulosReportSelector() {
  const { modulos } = useModulo();
  const [selectedReport, setSelectedReport] = useState<string | null>(null);

  if (!modulos) return <p>Cargando...</p>;

  const reports = [
    {
      id: "todos",
      title: "Modulos Disponibles",
      description: (data: Modulo[]) => {
        const total = data.length;
        const activos = data.filter((e) => e.estado).length;
        return `
En el presente reporte se ofrece un resumen general de los módulos registrados en el sistema, detallando información como su nombre, funcionalidad principal y fecha de creación.

Llevar un control adecuado de los módulos permite garantizar una estructura organizada del sistema, facilitando su mantenimiento, evolución y el control de acceso por parte de los usuarios según sus roles y permisos.

Hasta el momento, se han registrado un total de ${total} módulos. 
De ellos, ${activos} se encuentran activos actualmente, lo cual representa las funcionalidades disponibles y en uso dentro del sistema.

A continuación se muestra una tabla con los datos de los módulos registrados:`;
      },
      accessors: ["nombre", "created_at"],
      headers: ["Nombre", "Fecha de creación"],
      withTable: true,
      filterFn: (data: Modulo[]) => data,
    },
    {
      id: "activos e inactivos",
      title: "Modulos Activos e Inactivos",
      description: (data: Modulo[]) => {
        const activos = data.filter((e) => e.estado);
        const inactivos = data.filter((e) => !e.estado).length;
        const total = activos.length;
        return `
En todo sistema, es común que algunos módulos sean desactivados temporal o permanentemente, ya sea por cambios en los procesos internos, reemplazo de funcionalidades o simplemente porque ya no son necesarios en el flujo operativo.

Llevar un control del estado de los módulos es esencial para mantener la organización, optimizar el rendimiento del sistema y evitar confusiones entre los usuarios al acceder a funcionalidades que ya no están en uso.

Actualmente hay ${total} módulos activos y ${inactivos} módulos inactivos.

Este reporte permite identificar qué módulos están operativos dentro del sistema y cuáles podrían requerir mantenimiento, actualización o eliminación definitiva.`;
      },
      accessors: ["nombre", "valor", "created_at"],
      headers: ["Nombre", "Valor", "Fecha de creación"],
      withTable: true,
      filterFn: (data: Modulo[]) => data.filter((e) => e.estado),
    },
  ];

  const selected = reports.find((r) => r.id === selectedReport);
  const handleBack = () => setSelectedReport(null);

  if (selectedReport && selected) {
    const dataFiltrada = selected.filterFn(modulos);

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
            typeof r.description === "function" ? r.description(modulos) : ""
          }
          onClick={() => setSelectedReport(r.id)}
        />
      ))}
    </div>
  );
}

import { useState } from "react";
import { VisualizadorPDF } from "@/components/organismos/PDFVisualizer";
import { ReportTemplate } from "@/components/templates/Report";
import { ReportCard } from "@/components/molecules/ReportCard";
import { useUsuario } from "@/hooks/Usuarios/useUsuario";
import { User } from "@/types/Usuario";

export default function UserReportSelector() {
  const { users } = useUsuario();
  const [selectedReport, setSelectedReport] = useState<string | null>(null);

  if (!users) return <p>Cargando...</p>;

  const reports = [
    {
      id: "todos",
      title: "Usuarios Registrados",
      description: (data: User[]) => {
        const total = data.length;
        const activos = data.filter((e) => e.estado).length;
        return `
En el presente reporte se presenta un resumen general de los usuarios registrados en el sistema, mostrando información relevante como su nombre, correo electrónico y fecha de registro.

Es importante llevar un control detallado de los usuarios ya que ellos son quienes interactúan directamente con las funcionalidades del sistema. Su gestión adecuada garantiza un mejor manejo de accesos, trazabilidad y soporte.

Hasta el momento, se han registrado un total de ${total} usuarios.
De ellos, ${activos} se encuentran activos actualmente, lo cual representa el grupo de personas que tiene acceso vigente al sistema.

A continuación se muestra una tabla con los datos de los usuarios registrados:`;
      },
      accessors: ["nombre", "created_at"],
      headers: ["Nombre", "Fecha de creación"],
      withTable: true,
      filterFn: (data: User[]) => data,
    },
    {
      id: "activos e inactivos",
      title: "Usuarios Activos e Inactivos",
      description: (data: User[]) => {
        const activos = data.filter((e) => e.estado);
        const inactivos = data.filter((e) => !e.estado).length;
        const total = activos.length;
        return `
En todo sistema, es común que algunos usuarios permanezcan inactivos por diversas razones, como la finalización de sus labores, falta de uso prolongado o suspensión temporal del acceso.

Llevar un control sobre estos estados es fundamental para mantener la seguridad y la integridad de la plataforma, evitando accesos innecesarios o no autorizados.

Actualmente hay ${total} usuarios con estado activo y ${inactivos} usuarios inactivos.

Este reporte permite identificar cuántos usuarios están participando activamente en el sistema y cuáles podrían requerir revisión, reactivación o eliminación definitiva.`;
      },
      accessors: ["nombre", "valor", "created_at"],
      headers: ["Nombre", "Valor", "Fecha de creación"],
      withTable: true,
      filterFn: (data: User[]) => data.filter((e) => e.estado),
    },
  ];

  const selected = reports.find((r) => r.id === selectedReport);
  const handleBack = () => setSelectedReport(null);

  if (selectedReport && selected) {
    const dataFiltrada = selected.filterFn(users);

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
            typeof r.description === "function" ? r.description(users) : ""
          }
          onClick={() => setSelectedReport(r.id)}
        />
      ))}
    </div>
  );
}

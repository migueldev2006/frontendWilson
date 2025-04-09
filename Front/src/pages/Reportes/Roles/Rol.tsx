import { useState } from "react";
import { VisualizadorPDF } from "@/components/organismos/PDFVisualizer";
import { ReportTemplate } from "@/components/templates/Report";
import { ReportCard } from "@/components/molecules/ReportCard";
import { useRol } from "@/hooks/Roles/useRol";
import { Rol } from "@/types/Rol";

export default function RolReportSelector() {
  const { roles } = useRol();
  const [selectedReport, setSelectedReport] = useState<string | null>(null);

  if (!roles) return <p>Cargando...</p>;

  const reports = [
    {
      id: "todos",
      title: "Roles Registrados",
      description: (data: Rol[]) => {
        const total = data.length;
        const activos = data.filter((e) => e.estado).length;
        return `
Los roles son muy importantes puesto que gacias ellos el usario va apoder tener el acceso a ciertos modulos de nuestro sistema, es decir que de aqui pparte sobre a que opciones puede acceder en nusetro software.

Si bien es cierto algunos de nuestro roles deben darsel ciertos permisos, ya que gracias a ello es que pueden acceder alos modulos correspondeintes.

Se han registrado un total de ${total} roles.
De ellos, ${activos} están activos actualmente.

Este reporte brinda una visión general del total de roles registrados en el sistema.`;
      },
      accessors: ["nombre", "created_at"],
      headers: ["Nombre", "Fecha de creación"],
      withTable: true,
      filterFn: (data: Rol[]) => data,
    },
    {
      id: "activos e inactivos",
      title: "Roles Activos e Inactivos",
      description: (data: Rol[]) => {
        const activos = data.filter((e) => e.estado);
        const inactivos = data.filter((e) => !e.estado).length;
        const total = activos.length;
        return `
Tenemos entre la garn variedad de roles no siempre todos van a estar activos hay algunas ocasiones en las que por motivos de no implementar mas un rol que se deciden llevar acabo el proceso de desactivacion bien sea que por el momento ya no hay usuarios con ese rol o que posiblemente no se vilvera a usar mas

Actualmente hay ${total} roles con estado activo y ${inactivos} de ellos esta inactivado.

Estos roles representan los recursos disponibles y operativos dentro del sistema.`;
      },
      accessors: ["nombre", "valor", "created_at"],
      headers: ["Nombre", "Valor", "Fecha de creación"],
      withTable: true,
      filterFn: (data: Rol[]) => data.filter((e) => e.estado),
    },
  ];

  const selected = reports.find((r) => r.id === selectedReport);
  const handleBack = () => setSelectedReport(null);

  if (selectedReport && selected) {
    const dataFiltrada = selected.filterFn(roles);

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
            typeof r.description === "function" ? r.description(roles) : ""
          }
          onClick={() => setSelectedReport(r.id)}
        />
      ))}
    </div>
  );
}

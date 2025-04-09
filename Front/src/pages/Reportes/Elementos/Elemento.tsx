import { useState } from "react";
import { useElemento } from "@/hooks/Elementos/useElemento";
import { VisualizadorPDF } from "@/components/organismos/PDFVisualizer";
import { ReportTemplate } from "@/components/templates/Report";
import { ReportCard } from "@/components/molecules/ReportCard";
import { Elemento } from "@/types/Elemento";

export default function ElementoReportSelector() {
  const { elementos } = useElemento();
  const [selectedReport, setSelectedReport] = useState<string | null>(null);

  if (!elementos) return <p>Cargando...</p>;

  const reports = [
    {
      id: "todos",
      title: "Total de Elementos Registrados",
      description: (data: Elemento[]) => {
        const total = data.length;
        const activos = data.filter((e) => e.estado).length;
        return `
En el presente reporte vamos a dar a conocer la totalidad de los elemntos que se han registrado en el sistema dando a conocer su nombre, el costo que tuvo y la fecha en la cual fue registrado. 

Se han registrado un total de ${total} elementos. De ellos, ${activos} están activos actualmente.

Es iportante conoecr que los elemtos registrados en el sitemas pasan asignarse a un inventario en donde se establecera la cantidad a registar por cada uno de estos.
        
        A continuacion daremos a conocer la una tabla con los registros de los elemntos en el sistema:`;
      },
      accessors: ["nombre", "valor", "created_at"],
      headers: ["Nombre", "Valor", "Fecha de creación"],
      withTable: true,
      filterFn: (data: Elemento[]) => data,
    },
    {
      id: "activos",
      title: "Elementos Activos",
      description: (data: Elemento[]) => {
        const activos = data.filter((e) => e.estado);
        const total = activos.length;
        return `
Actualmente hay ${total} elementos con estado activo.

La importancia de si estos elementos estan activados o no es muy importante puesto que podemos determinar en caso de caducar que el elemento ha sido desactivado del ineventario debido a que ha caducado o se ha agotado.

Por tal motivo se podria llegar a verificar que no hay cantidad alguna disponible en su momento y por lo tanto el elemento o material no estaria disponible en ninguna circunstancia.

Estos elementos representan los recursos disponibles y operativos dentro del sistema.`;
      },
      accessors: ["nombre", "valor", "created_at"],
      headers: ["Nombre", "Valor", "Fecha de creación"],
      withTable: true,
      filterFn: (data: Elemento[]) => data.filter((e) => e.estado),
    },
    {
      id: "sin_estado",
      title: "Elementos Inactivos",
      description: (data: Elemento[]) => {
        const inactivos = data.filter((e) => !e.estado).length;
        return `
Se han encontrado ${inactivos} elementos con estado inactivo.

Dado que hasta el momento no ha sido desactivado ningun elemento quiere decir que no se han agotado las reservas encontradas en el stock del inevntario y que aunsigue disponible.

Pero por otro lado eso solo da a entender que en el CGDSS se cuenta con los elemetos suficientes para el trabajo solicitados en las diferentes sedes

Es importante revisar estos registros para determinar si deben ser reactivados o dados de baja definitivamente.`;
      },
      // withTable: false,
      filterFn: (data: Elemento[]) => data,
    },
    {
      id: "nuevos",
      title: "Elementos Nuevos del Mes",
      description: (data: Elemento[]) => {
        const now = new Date();
        const delMes = data.filter((e) => {
          const created = new Date(e.created_at);
          return (
            created.getMonth() === now.getMonth() &&
            created.getFullYear() === now.getFullYear()
          );
        }).length;

        const porcentaje =
          data.length > 0 ? ((delMes / data.length) * 100).toFixed(2) : "0.00";
        return `
Este mes se han registrado ${delMes} nuevos elementos.

Es importante realizar este tipo de seguimiento ya que asi nos damos cuenta como ha progresado el registro de nuevos elementos al mes, en este caso por el momento se maneja un porcentaje del ${porcentaje} %   

El seguimiento de los elementos recientemente añadidos permite evaluar el crecimiento del inventario y la actualización de recursos.`;
      },
      withTable: false,
      filterFn: (data: Elemento[]) => data,
    },
  ];

  const selected = reports.find((r) => r.id === selectedReport);
  const handleBack = () => setSelectedReport(null);

  if (selectedReport && selected) {
    const dataFiltrada = selected.filterFn(elementos);

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
            typeof r.description === "function" ? r.description(elementos) : ""
          }
          onClick={() => setSelectedReport(r.id)}
        />
      ))}
    </div>
  );
}

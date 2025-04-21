// import { useState } from "react";
// import { useCentro } from "@/hooks/Centros/useCentros";
// import { VisualizadorPDF } from "@/components/organismos/PDFVisualizer";
// import { ReportTemplate } from "@/components/templates/Report";
// import { ReportCard } from "@/components/molecules/ReportCard";
// import { Centro } from "@/types/Centro";

// export default function CentroReportSelector() {
//   const { centros } = useCentro();
//   const [selectedReport, setSelectedReport] = useState<string | null>(null);

//   if (!centros) return <p>Cargando...</p>;

//   const reports = [
//     {
//       id: "todos",
//       title: "Total de Centros Registrados",
//       description: (data: Centro[]) => {
//         const total = data.length;
//         const activos = data.filter((e) => e.estado).length;
//         return `
// En el presente reporte vamos a dar a conocer la totalidad de los centros de formación del SENA que se han registrado en el sistema, incluyendo su nombre, ubicación y la fecha en la cual fueron ingresados.

// Se han registrado un total de ${total} centros de formación. De ellos, ${activos} se encuentran activos actualmente

// Es importante conocer el estado de los centros registrados, ya que representan los espacios físicos donde se desarrollan las actividades de formación, capacitación y acompañamiento a los aprendices.

// A continuación se muestra una tabla con los registros actuales de los centros de formación en el sistema:`;
//       },
//       accessors: ["nombre", "valor", "created_at"],
//       headers: ["Nombre", "Valor", "Fecha de creación"],
//       withTable: true,
//       filterFn: (data: Centro[]) => data,
//     },
//     {
//       id: "activos",
//       title: "Centros Activos",
//       description: (data: Centro[]) => {
//         const activos = data.filter((e) => e.estado);
//         const total = activos.length;
//         return `
// Actualmente hay ${total} centros de formación con estado activo.

// La activación o desactivación de un centro de formación es un aspecto clave, ya que permite identificar cuáles sedes están operativas y disponibles para ofrecer procesos de formación, y cuáles han sido cerradas temporal o permanentemente.

// En caso de que un centro se desactive, puede deberse a procesos de reestructuración, mantenimiento o suspensión de actividades formativas. Esto permite mantener actualizada la información institucional y facilitar la planeación estratégica.

// Los centros activos representan los espacios vigentes en los que se están llevando a cabo actividades de formación, capacitación y desarrollo de competencias.`;
//       },
//       accessors: ["nombre", "valor", "created_at"],
//       headers: ["Nombre", "Valor", "Fecha de creación"],
//       withTable: true,
//       filterFn: (data: Centro[]) => data.filter((e) => e.estado),
//     },
//     {
//       id: "sin_estado",
//       title: "Centros Inactivos",
//       description: (data: Centro[]) => {
//         const inactivos = data.filter((e) => !e.estado).length;
//         return `
// Se han encontrado ${inactivos} elementos con estado inactivo.

// Dado que hasta el momento no ha sido desactivado ningun elemento quiere decir que no se han agotado las reservas encontradas en el stock del inevntario y que aunsigue disponible.

// Pero por otro lado eso solo da a entender que en el CGDSS se cuenta con los elemetos suficientes para el trabajo solicitados en las diferentes sedes

// Es importante revisar estos registros para determinar si deben ser reactivados o dados de baja definitivamente.`;
//       },
//       // withTable: false,
//       filterFn: (data: Centro[]) => data,
//     },
//     {
//       id: "nuevos",
//       title: "Elementos Nuevos del Mes",
//       description: (data: Centro[]) => {
//         const now = new Date();
//         const delMes = data.filter((e) => {
//           const created = new Date(e.created_at);
//           return (
//             created.getMonth() === now.getMonth() &&
//             created.getFullYear() === now.getFullYear()
//           );
//         }).length;

//         const porcentaje =
//           data.length > 0 ? ((delMes / data.length) * 100).toFixed(2) : "0.00";
//         return `
// Este mes se han registrado ${delMes} nuevos elementos.

// Es importante realizar este tipo de seguimiento ya que asi nos damos cuenta como ha progresado el registro de nuevos elementos al mes, en este caso por el momento se maneja un porcentaje del ${porcentaje} %   

// El seguimiento de los elementos recientemente añadidos permite evaluar el crecimiento del inventario y la actualización de recursos.`;
//       },
//       withTable: false,
//       filterFn: (data: Centro[]) => data,
//     },
//   ];

//   const selected = reports.find((r) => r.id === selectedReport);
//   const handleBack = () => setSelectedReport(null);

//   if (selectedReport && selected) {
//     const dataFiltrada = selected.filterFn(centros);

//     return (
//       <VisualizadorPDF
//         onBack={handleBack}
//         component={
//           <ReportTemplate
//             title={selected.title}
//             description={selected.description(dataFiltrada)}
//             headers={
//               selected.withTable && selected.headers ? selected.headers : []
//             }
//             accessors={
//               selected.withTable && selected.accessors ? selected.accessors : []
//             }
//             data={selected.withTable ? dataFiltrada : []}
//           />
//         }
//       />
//     );
//   }

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
//       {reports.map((r) => (
//         <ReportCard
//           key={r.id}
//           title={r.title}
//           description={
//             typeof r.description === "function" ? r.description(centros) : ""
//           }
//           onClick={() => setSelectedReport(r.id)}
//         />
//       ))}
//     </div>
//   );
// }

import { useState } from "react";
import { useSede } from "@/hooks/sedes/useSedes"; 
import { VisualizadorPDF } from "@/components/organismos/PDFVisualizer";
import { ReportTemplate } from "@/components/templates/Report";
import { ReportCard } from "@/components/molecules/ReportCard";
import { Sede } from "@/types/sedes"; 

export default function ReportSedes() {
  const { sede } = useSede();
  const [fechaInicio, setFechaInicio] = useState<string>("");
  const [fechaFin, setFechaFin] = useState<string>("");
  const [selectedReport, setSelectedReport] = useState<string | null>(null);

  if (!sede) return <p>Cargando...</p>;

  const filtrarPorFechas = (
    data: Sede[],
    fechaInicio: string,
    fechaFin: string
  ) => {
    if (!fechaInicio || !fechaFin) return data; 
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    return data.filter((sede) => {
      const fecha = new Date(sede.created_at);
      return fecha >= inicio && fecha <= fin;
    });
  };

  const formatFecha = (fecha: string) => {
    const date = new Date(fecha);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); 
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const dataFiltrada = filtrarPorFechas(sede, fechaInicio, fechaFin);

  const reports = [
    {
      id: "todos",
      title: "REPORTE GENERAL DE SEDES REGISTRADAS – SGDSS Sede Yamboro",
      description: (data: Sede[], inicio: string, fin: string) => {
        const total = data.length;
        const activos = data.filter((e) => e.estado).length;
        const rango =
          inicio && fin
            ? `Fecha: ${formatFecha(inicio)} al ${formatFecha(fin)}.`
            : "";
        return `
${rango}
Se han registrado un total de ${total} sedes.
De ellas, ${activos} están activas actualmente.

Resumen General
Actualmente, el sistema cuenta con un total de ${total} sedes registradas, de las cuales ${activos} están activas.
Este informe proporciona una visión integral de todas las sedes registradas, junto con los detalles de su estado y fechas de creación respectivas.

Observaciones Relevantes

-El registro de sedes está alineado con los esfuerzos por mejorar la trazabilidad de los materiales y recursos dentro del SGDSS.

-Se recomienda revisar aquellas sedes cuyo nombre pueda sugerir que no están activas, para mantener la integridad en los datos.

-La identificación clara del estado de cada sede permite una mejor gestión y seguimiento dentro del sistema.`;
      },
      accessors: ["nombre","created_at"],
      headers: ["Nombre", "Fecha de Creación"],
      withTable: true,
      filterFn: (data: Sede[]) => data,
    },
    {
      id: "activos",
      title: "REPORTE DE SEDES ACTIVAS – SGDSS Sede Yamboro",
      description: (data: Sede[], inicio: string, fin: string) => {
        const activos = data.filter((e) => e.estado);
        const total = activos.length;
        const rango =
          inicio && fin
            ? `Fecha: ${formatFecha(inicio)} al ${formatFecha(fin)}.`
            : "";
        return `
${rango}
Actualmente hay ${total} sedes activas.

Resumen General
Actualmente, se encuentran ${total} sedes activas dentro del sistema SGDSS – sede Yamboro. Estas sedes representan lugares habilitados y disponibles para las operaciones y el manejo de recursos dentro del programa de formación.

Observaciones Relevantes

-Estas sedes están actualmente habilitadas para la gestión de materiales y recursos, por lo que cualquier movimiento de elementos dentro de ellas se encuentra trazado.

-Se recomienda mantener actualizada esta información para reflejar fielmente el estado operativo de las sedes.

-La correcta identificación de las sedes activas mejora la logística y la toma de decisiones dentro de la gestión de formación.`;
      },
      accessors: ["nombre",  "created_at"],
      headers: ["Nombre",  "Fecha de Creación"],
      withTable: true,
      filterFn: (data: Sede[]) => data.filter((e) => e.estado),
    },
    {
      id: "inactivas",
      title: "REPORTE DE SEDES INACTIVAS – SGDSS Sede Yamboro",
      description: (data: Sede[], inicio: string, fin: string) => {
        const inactivas = data.filter((e) => !e.estado).length;
        const rango =
          inicio && fin
            ? `Fecha: ${formatFecha(inicio)} al ${formatFecha(fin)}.`
            : "";
        return `
${rango}
Se han encontrado ${inactivas} sedes con estado inactivo.

Resumen General
Durante el periodo actual, se han identificado ${inactivas} sedes con estado inactivo dentro del sistema de gestión del SGDSS. Estas sedes actualmente no se encuentran operativas y requieren una evaluación para determinar su pertinencia en el inventario de trazabilidad de materiales.

Observaciones Relevantes

-Algunas sedes podrían haber sido deshabilitadas temporalmente, por lo que se recomienda validar su reactivación si se considera necesario.

-Se identifican nombres con apariencia de prueba (por ejemplo: "prueva"), lo que indica que podrían haber sido creadas con fines de testeo. Estas deben ser depuradas si no cumplen una función activa.

-La depuración de sedes inactivas mejora la trazabilidad y evita posibles errores en la asignación o seguimiento de materiales.`;
      },
      accessors: ["nombre",  "created_at"],
      headers: ["Nombre",  "Fecha de Creación"],
      withTable: true,
      filterFn: (data: Sede[]) => data.filter((e) => !e.estado),
    },
    {
      id: "nuevas",
      title: "REPORTE MENSUAL – NUEVAS SEDES REGISTRADAS EN EL SGDSS Sede Yamboro",
      description: (data: Sede[], inicio: string, fin: string) => {
        const now = new Date();
        const delMes = data.filter((e) => {
          const created = new Date(e.created_at);
          return (
            created.getMonth() === now.getMonth() &&
            created.getFullYear() === now.getFullYear()
          );
        }).length;

        const rango =
          inicio && fin
            ? `Fecha: ${formatFecha(inicio)} al ${formatFecha(fin)}.`
            : "";
        return `
${rango}
Este mes se han registrado ${delMes} nuevas Sedes.

Durante el mes actual, se han integrado ${delMes} nuevas sedes al sistema SGDSS de la sede Yamboro. Estas sedes son claves para la administración de espacios y recursos dentro del sistema.

Observaciones Relevantes:

-Se recomienda verificar las nuevas sedes para asociarlas adecuadamente a los programas de formación.

-Se identifican nombres de prueba como "prueva", lo que sugiere que parte de las sedes podrían haber sido creadas para fines de testeo. Se recomienda su revisión y depuración si no tienen uso operativo.

-La integración adecuada de nuevas sedes permite mantener la trazabilidad de recursos y materiales desde el primer momento, asegurando su correcta asignación y gestión.`;
      },
      accessors: ["nombre", "estado", "created_at"],
      headers: ["Nombre", "Estado", "Fecha de Creación"],
      withTable: true,
      filterFn: (data: Sede[]) => data,
    },
  ];

  const selected = reports.find((r) => r.id === selectedReport);
  const handleBack = () => setSelectedReport(null);

  if (selectedReport && selected) {
    const dataFiltradaPorReporte = selected.filterFn(dataFiltrada).map((item) => ({
      ...item,
      created_at: formatFecha(item.created_at),
    }));

    return (
      <VisualizadorPDF
        onBack={handleBack}
        component={
          <ReportTemplate
            title={selected.title}
            description={selected.description(dataFiltradaPorReporte, fechaInicio, fechaFin)}
            headers={selected.withTable && selected.headers ? selected.headers : []}
            accessors={selected.withTable && selected.accessors ? selected.accessors : []}
            data={selected.withTable ? dataFiltradaPorReporte : []}
          />
        }
      />
    );
  }

  return (
    <>
      <div className="p-4">
        <div className="flex justify-center">
          <div className="grid xl:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-center font-medium">Fecha de inicio</label>
              <input
                type="date"
                className="w-full border rounded p-2"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm text-center font-medium">Fecha de fin</label>
              <input
                type="date"
                className="w-full border rounded p-2"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {fechaInicio && fechaFin ? (
        <div className="flex ml-12 mr-12 gap-4 grid xl:grid-cols-3">
          {reports.map((r) => (
            <ReportCard
              key={r.id}
              title={r.title}
              description={r.description(r.filterFn(dataFiltrada), fechaInicio, fechaFin)}
              onClick={() => setSelectedReport(r.id)}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center">
          Selecciona un rango de fechas para ver los reportes disponibles.
        </p>
      )}
    </>
  );
}

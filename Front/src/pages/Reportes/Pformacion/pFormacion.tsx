import { useState } from "react";
import { usePrograma } from "@/hooks/programas/usePrograma";
import { VisualizadorPDF } from "@/components/organismos/PDFVisualizer";
import { ReportTemplate } from "@/components/templates/Report";
import { ReportCard } from "@/components/molecules/ReportCard";
import { Pformacion } from "@/types/programaFormacion";

export default function ReportProgramasFormacion() {
  const { programas } = usePrograma();
  const [fechaInicio, setFechaInicio] = useState<string>("");
  const [fechaFin, setFechaFin] = useState<string>("");
  const [selectedReport, setSelectedReport] = useState<string | null>(null);

  if (!programas) return <p>Cargando...</p>;

  const filtrarPorFechas = (data: Pformacion[], inicio: string, fin: string) => {
    if (!inicio || !fin) return [];
    const start = new Date(inicio);
    const end = new Date(fin);
    return data.filter((p) => {
      const fecha = new Date(p.created_at);
      return fecha >= start && fecha <= end;
    });
  };

  const formatFecha = (fecha: string) => {
    const date = new Date(fecha);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const dataPorFecha = filtrarPorFechas(programas, fechaInicio, fechaFin);

  const reports = [
    {
      id: "todos",
      title: "REPORTE GENERAL DE PROGRAMAS DE FORMACIÓN – SGDSS Sede Yamboro",
      description: (data: Pformacion[], inicio: string, fin: string) => {
        const total = data.length;
        const activos = data.filter((p) => p.estado).length;
        const rango = inicio && fin ? `Fecha: ${formatFecha(inicio)} al ${formatFecha(fin)}.` : "";
        return `
${rango}
Se han registrado un total de ${total} programas de formación.
De ellos, ${activos} están activos actualmente.

Resumen General
Este informe detalla todos los programas de formación registrados, lo cual permite analizar el crecimiento y gestión educativa del centro.

Observaciones Relevantes

- Validar que todos los nombres estén correctamente escritos.
- Verificar la relación de los programas con las áreas correspondientes.
- Revisar el estado actual de cada programa.`;
      },
      accessors: ["nombre", "created_at"],
      headers: ["Nombre del programa", "Fecha de creación"],
      withTable: true,
      filterFn: (data: Pformacion[]) => data,
    },
    {
      id: "activos",
      title: "REPORTE DE PROGRAMAS DE FORMACIÓN ACTIVOS – SGDSS Sede Yamboro",
      description: (data: Pformacion[], inicio: string, fin: string) => {
        const activos = data.filter((p) => p.estado);
        const total = activos.length;
        const rango = inicio && fin ? `Fecha: ${formatFecha(inicio)} al ${formatFecha(fin)}.` : "";
        return `
${rango}
Actualmente hay ${total} programas activos.

Resumen General
Los programas activos reflejan la oferta educativa vigente del centro de formación.

Observaciones Relevantes

- Asegurar la pertinencia y actualización de cada programa activo.
- Confirmar la vinculación con las necesidades del sector productivo.`;
      },
      accessors: ["nombre", "created_at"],
      headers: ["Nombre del programa", "Fecha de creación"],
      withTable: true,
      filterFn: (data: Pformacion[]) => data.filter((p) => p.estado),
    },
    {
      id: "inactivos",
      title: "REPORTE DE PROGRAMAS DE FORMACIÓN INACTIVOS – SGDSS Sede Yamboro",
      description: (data: Pformacion[], inicio: string, fin: string) => {
        const inactivos = data.filter((p) => !p.estado);
        const total = inactivos.length;
        const rango = inicio && fin ? `Fecha: ${formatFecha(inicio)} al ${formatFecha(fin)}.` : "";
        return `
${rango}
Se han identificado ${total} programas que actualmente están inactivos.

Resumen General
Estos programas no están siendo ofrecidos actualmente. Es importante revisarlos para una posible reactivación o depuración.

Observaciones Relevantes

- Revisar las causas de inactividad.
- Determinar si deben ser actualizados, reactivados o eliminados.`;
      },
      accessors: ["nombre", "created_at"],
      headers: ["Nombre del programa", "Fecha de creación"],
      withTable: true,
      filterFn: (data: Pformacion[]) => data.filter((p) => !p.estado),
    },
    {
      id: "nuevos",
      title: "REPORTE MENSUAL – NUEVOS PROGRAMAS DE FORMACIÓN REGISTRADOS",
      description: (data: Pformacion[], inicio: string, fin: string) => {
        const now = new Date();
        const delMes = data.filter((p) => {
          const created = new Date(p.created_at);
          return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
        }).length;

        const rango = inicio && fin ? `Fecha: ${formatFecha(inicio)} al ${formatFecha(fin)}.` : "";
        return `
${rango}
Durante este mes se han registrado ${delMes} nuevos programas de formación.

Resumen General
El registro de nuevos programas responde a las necesidades de formación de la población y del sector productivo.

Observaciones Relevantes

- Asegurar la calidad de los nuevos programas.
- Verificar su correcta documentación y estado inicial.`;
      },
      accessors: ["nombre", "created_at"],
      headers: ["Nombre del programa", "Fecha de creación"],
      withTable: true,
      filterFn: (data: Pformacion[]) => data,
    },
  ];

  const selected = reports.find((r) => r.id === selectedReport);
  const handleBack = () => setSelectedReport(null);

  if (selectedReport && selected) {
    const dataFiltrada = selected.filterFn(dataPorFecha).map((item) => ({
      ...item,
      created_at: formatFecha(item.created_at),
    }));

    return (
      <VisualizadorPDF
        onBack={handleBack}
        component={
          <ReportTemplate
            title={selected.title}
            description={selected.description(dataFiltrada, fechaInicio, fechaFin)}
            headers={selected.withTable && selected.headers ? selected.headers : []}
            accessors={selected.withTable && selected.accessors ? selected.accessors : []}
            data={selected.withTable ? dataFiltrada : []}
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
              description={r.description(r.filterFn(dataPorFecha), fechaInicio, fechaFin)}
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

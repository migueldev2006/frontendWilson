import { useState } from "react";
import { useUsuarioFcihas } from "@/hooks/usersFichas/useUserFichas";
import { VisualizadorPDF } from "@/components/organismos/PDFVisualizer";
import { ReportTemplate } from "@/components/templates/Report";
import { ReportCard } from "@/components/molecules/ReportCard";
import { UserFicha } from "@/types/userFicha";

export default function ReportUserFicha() {
  const { usersFcihas, isLoading, isError, error } = useUsuarioFcihas();
  const [fechaInicio, setFechaInicio] = useState<string>("");
  const [fechaFin, setFechaFin] = useState<string>("");
  const [selectedReport, setSelectedReport] = useState<string | null>(null);

  if (isLoading) return <p>Cargando datos...</p>;
  if (isError) return <p>Error al cargar los datos: {error?.message}</p>;
  if (!usersFcihas) return <p>No se encontraron asignaciones.</p>;

  const filtrarPorFechas = (
    data: UserFicha[],
    fechaInicio: string,
    fechaFin: string
  ) => {
    if (!fechaInicio || !fechaFin) return [];
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    return data.filter((item) => {
      const fecha = new Date(item.created_at);
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

  const dataPorFecha = filtrarPorFechas(usersFcihas, fechaInicio, fechaFin);

  const reports = [
    {
      id: "todos",
      title: "REPORTE GENERAL DE ASIGNACIONES USUARIO-FICHA – SGDSS Sede Yamboro",
      description: (data: UserFicha[], inicio: string, fin: string) => {
        const total = data.length;
        const rango = inicio && fin ? `Fecha: ${formatFecha(inicio)} al ${formatFecha(fin)}.` : "";
        return `
${rango}
Se han registrado un total de ${total} asignaciones entre usuarios y fichas.

Resumen General
Este informe detalla todas las asignaciones hechas entre los usuarios y las fichas de formación en el sistema SGDSS de la sede Yamboro. El objetivo es llevar un control preciso de quiénes están vinculados a cada ficha, facilitando la trazabilidad de los materiales y el seguimiento formativo.

Observaciones Relevantes:
- Este reporte permite identificar de manera clara las relaciones establecidas entre usuarios y fichas en un periodo de tiempo específico.
- Se recomienda mantener actualizada esta información para asegurar una correcta trazabilidad y gestión de la formación.
        `;
      },
      accessors: ["id_usuario_ficha", "fk_usuario", "fk_ficha", "created_at"],
      headers: ["ID", "ID Usuario", "ID Ficha", "Fecha de creación"],
      withTable: true,
      filterFn: (data: UserFicha[]) => data,
    },
    {
      id: "nuevos",
      title: "REPORTE MENSUAL – NUEVAS ASIGNACIONES USUARIO-FICHA",
      description: (data: UserFicha[], inicio: string, fin: string) => {
        const now = new Date();
        const nuevas = data.filter((e) => {
          const fecha = new Date(e.created_at);
          return (
            fecha.getMonth() === now.getMonth() &&
            fecha.getFullYear() === now.getFullYear()
          );
        }).length;

        const rango = inicio && fin ? `Fecha: ${formatFecha(inicio)} al ${formatFecha(fin)}.` : "";

        return `
${rango}
Este mes se han registrado ${nuevas} nuevas asignaciones entre usuarios y fichas.

Resumen General
Durante el mes actual, se han integrado nuevas relaciones entre usuarios y fichas al sistema SGDSS, lo cual refleja la evolución y dinámica de la formación en la sede Yamboro.

Observaciones Relevantes:
- Se sugiere verificar que estas asignaciones estén correctamente documentadas y respondan a necesidades reales de los programas formativos.
- El control mensual de estas relaciones permite mantener una base de datos precisa y facilita futuras auditorías o reportes de seguimiento.
        `;
      },
      accessors: ["id_usuario_ficha", "fk_usuario", "fk_ficha", "created_at"],
      headers: ["ID", "ID Usuario", "ID Ficha", "Fecha de creación"],
      withTable: true,
      filterFn: (data: UserFicha[]) => data,
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
              <label className="block text-sm text-center font-medium">
                Fecha de inicio
              </label>
              <input
                type="date"
                className="w-full border rounded p-2"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm text-center font-medium">
                Fecha de fin
              </label>
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
        <div className="flex ml-12 mr-12 gap-4 grid xl:grid-cols-2">
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

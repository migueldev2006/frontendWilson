import { useState } from "react";
import { useSitios } from "@/hooks/sitios/useSitios";
import { VisualizadorPDF } from "@/components/organismos/PDFVisualizer";
import { ReportTemplate } from "@/components/templates/Report";
import { ReportCard } from "@/components/molecules/ReportCard";
import { Sitios } from "@/types/sitios";

export default function ReportSitios() {
  const { sitios } = useSitios();
  const [fechaInicio, setFechaInicio] = useState<string>("");
  const [fechaFin, setFechaFin] = useState<string>("");
  const [selectedReport, setSelectedReport] = useState<string | null>(null);

  if (!sitios) return <p>Cargando...</p>;

  const filtrarPorFechas = (data: Sitios[], inicio: string, fin: string) => {
    if (!inicio || !fin) return [];
    const start = new Date(inicio);
    const end = new Date(fin);
    return data.filter((s) => {
      const fecha = new Date(s.created_at);
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

  const dataPorFecha = filtrarPorFechas(sitios, fechaInicio, fechaFin);

  const reports = [
    {
      id: "todos",
      title: "REPORTE GENERAL DE SITIOS REGISTRADOS - SGDSS Sede Yamboro",
      description: (data: Sitios[], inicio: string, fin: string) => {
        const total = data.length;
        const activos = data.filter((s) => s.estado).length;
        const rango = inicio && fin ? `Fecha: ${formatFecha(inicio)} al ${formatFecha(fin)}.` : "";
        return `
${rango}
Se han registrado un total de ${total} sitios.
De ellos, ${activos} están activos actualmente.

Resumen General
Este reporte proporciona una visión completa de todos los sitios registrados en el SGDSS. Se incluyen datos sobre sus ubicaciones, responsables asignados y estados de operación.

Observaciones Relevantes

- Asegurar que los nombres y responsables estén actualizados.
- Revisar ubicaciones duplicadas o poco claras.
- Validar que todos los sitios estén asociados correctamente a sus respectivas áreas.`;
      },
      accessors: ["nombre", "persona_encargada", "ubicacion", "created_at"],
      headers: ["Nombre", "Encargado", "Ubicación", "Fecha de creación"],
      withTable: true,
      filterFn: (data: Sitios[]) => data,
    },
    {
      id: "activos",
      title: "REPORTE DE SITIOS ACTIVOS – SGDSS Sede Yamboro",
      description: (data: Sitios[], inicio: string, fin: string) => {
        const activos = data.filter((s) => s.estado);
        const total = activos.length;
        const rango = inicio && fin ? `Fecha: ${formatFecha(inicio)} al ${formatFecha(fin)}.` : "";
        return `
${rango}
Actualmente hay ${total} sitios con estado activo.

Resumen General
Este informe refleja los sitios actualmente operativos, facilitando la gestión activa de materiales y espacios.

Observaciones Relevantes

- Los sitios activos son clave en los flujos de materiales.
- Verificar que cada sitio cuente con su encargado designado correctamente.`;
      },
      accessors: ["nombre", "ubicacion", "created_at"],
      headers: ["Nombre", "Ubicación", "Fecha de creación"],
      withTable: true,
      filterFn: (data: Sitios[]) => data.filter((s) => s.estado),
    },
    {
      id: "inactivos",
      title: "REPORTE DE SITIOS INACTIVOS – SGDSS Sede Yamboro",
      description: (data: Sitios[], inicio: string, fin: string) => {
        const inactivos = data.filter((s) => !s.estado);
        const total = inactivos.length;
        const rango = inicio && fin ? `Fecha: ${formatFecha(inicio)} al ${formatFecha(fin)}.` : "";
        return `
${rango}
Se han identificado ${total} sitios con estado inactivo.

Resumen General
Estos sitios no se encuentran en operación actualmente. Se recomienda revisar su pertinencia dentro del sistema.

Observaciones Relevantes

- Considerar reactivación o depuración de sitios obsoletos.
- Revisar consistencia de datos en sitios inactivos.`;
      },
      accessors: ["nombre", "ubicacion", "created_at"],
      headers: ["Nombre", "Ubicación", "Fecha de creación"],
      withTable: true,
      filterFn: (data: Sitios[]) => data.filter((s) => !s.estado),
    },
    {
      id: "nuevos",
      title: "REPORTE MENSUAL – NUEVOS SITIOS REGISTRADOS",
      description: (data: Sitios[], inicio: string, fin: string) => {
        const now = new Date();
        const delMes = data.filter((s) => {
          const created = new Date(s.created_at);
          return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
        }).length;

        const rango = inicio && fin ? `Fecha: ${formatFecha(inicio)} al ${formatFecha(fin)}.` : "";
        return `
${rango}
Este mes se han registrado ${delMes} nuevos sitios.

Resumen General
El crecimiento de sitios refleja una expansión del sistema de trazabilidad. Es fundamental asegurar que estén correctamente definidos desde su creación.

Observaciones Relevantes

- Verificar información básica desde el momento de creación.
- Confirmar relación con áreas correspondientes.`;
      },
      accessors: ["nombre", "ubicacion", "created_at"],
      headers: ["Nombre", "Ubicación", "Fecha de creación"],
      withTable: true,
      filterFn: (data: Sitios[]) => data,
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

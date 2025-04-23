import { useState } from "react";
import { useCategoria } from "@/hooks/Categorias/useCategorias";
import { VisualizadorPDF } from "@/components/organismos/PDFVisualizer";
import { ReportTemplate } from "@/components/templates/Report";
import { ReportCard } from "@/components/molecules/ReportCard";
import { Categoria } from "@/schemas/Categorias";

export default function CategoriaReport() {
  const { categorias } = useCategoria();
  const [fechaInicio, setFechaInicio] = useState<string>("");
  const [fechaFin, setFechaFin] = useState<string>("");
  const [selectedReport, setSelectedReport] = useState<string | null>(null);

  if (!categorias) return <p>Cargando...</p>;

  const filtrarPorFechas = (data: Categoria[], inicio: string, fin: string) => {
    if (!inicio || !fin) return [];
    const from = new Date(`${inicio}T00:00:00`);
    const to = new Date(`${fin}T23:59:59`);
    return data.filter((categoria) => {
      const fecha = new Date(categoria.created_at);
      return fecha >= from && fecha <= to;
    });
  };

  const formatFecha = (fecha: string) => {
    const d = new Date(fecha);
    d.setHours(d.getHours() + 5);
    return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
};

  const dataFiltrada = filtrarPorFechas(categorias, fechaInicio, fechaFin);

  const reports = [
    {
      id: "todos",
      title: "Total de Categorías Registradas",
      description: (data: Categoria[], inicio?: string, fin?: string) => {
        const total = data.length;
        const activos = data.filter((e) => e.estado).length;
        const rango = inicio && fin ? `Fecha: ${formatFecha(inicio)} al ${formatFecha(fin)}.` : "";

        return `
${rango}

En este reporte se presenta el total de categorías registradas en el sistema. De un total de ${total} categorías, ${activos} están activas.

Las categorías permiten organizar y clasificar la información de manera estructurada.

A continuación se listan los registros encontrados:`;
      },
      headers: ["Nombre", "Fecha de creación"],
      accessors: ["nombre", "created_at"],
      withTable: true,
      filterFn: (data: Categoria[]) => data,
    },
    {
      id: "activos",
      title: "Categorías Activas",
      description: (data: Categoria[], inicio?: string, fin?: string) => {
        const activos = data.filter((e) => e.estado).length;
        const rango = inicio && fin ? `Fecha: ${formatFecha(inicio)} al ${formatFecha(fin)}.` : "";

        return `
${rango}

Se han encontrado ${activos} categorías activas en el sistema.`.trim();
      },
      headers: ["Nombre", "Fecha de creación"],
      accessors: ["nombre", "created_at"],
      withTable: true,
      filterFn: (data: Categoria[]) => data.filter((e) => e.estado),
    },

    {
      id: "inactivos",
      title: "Categorías Inactivas",
      description: (data: Categoria[], inicio?: string, fin?: string) => {
        const inactivos = data.filter((e) => !e.estado).length;
        const rango = inicio && fin ? `Fecha: ${formatFecha(inicio)} al ${formatFecha(fin)}.` : "";

        return `
${rango}

Actualmente hay ${inactivos} categorías inactivas.`.trim();
      },
      headers: ["Nombre", "Fecha de creación"],
      accessors: ["nombre", "created_at"],
      withTable: true,
      filterFn: (data: Categoria[]) => data.filter((e) => !e.estado),
    },
    {
      id: "nuevos",
      title: "Categorías Nuevas ",
      description: (data: Categoria[], inicio?: string, fin?: string) => {
        if (!inicio || !fin) return "No se proporcionó un rango de fechas.";

       

        return `
Entre el ${formatFecha(inicio)} y el ${formatFecha(fin)}, se han registrado las siguientes categorías:`.trim();
      },
      headers: ["Nombre", "Fecha de creación"],
      accessors: ["nombre", "created_at"],
      withTable: true,
      filterFn: (data: Categoria[]) => data,
    },
  ];

  const selected = reports.find((r) => r.id === selectedReport);
  const handleBack = () => setSelectedReport(null);

  if (selectedReport && selected) {
    const dataPorFecha = filtrarPorFechas(categorias, fechaInicio, fechaFin);
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
            headers={selected.withTable ? selected.headers : []}
            accessors={selected.withTable ? selected.accessors : []}
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
        <div className="ml-12 mr-12 gap-4 grid xl:grid-cols-3">
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

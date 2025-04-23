import { useState } from "react";
import { VisualizadorPDF } from "@/components/organismos/PDFVisualizer";
import { ReportTemplate } from "@/components/templates/Report";
import { ReportCard } from "@/components/molecules/ReportCard";
import { useSolicitud } from "@/hooks/Solicitudes/useSolicitud";
import { useInventario } from "@/hooks/Inventarios/useInventario";
import { useUsuario } from "@/hooks/Usuarios/useUsuario";
import { Solicitud } from "@/types/Solicitud";
import { useElemento } from "@/hooks/Elementos/useElemento";

export default function ReportSolicitud() {
  const { solicitudes } = useSolicitud();
const {inventarios} = useInventario()
const {users} = useUsuario()
const {elementos} = useElemento()
  const [fechaInicio, setFechaInicio] = useState<string>("");
  const [fechaFin, setFechaFin] = useState<string>("");
  const [selectedReport, setSelectedReport] = useState<string | null>(null);

  if (!solicitudes) return <p>Cargando...</p>;

  const filtrarPorFechas = (
    data: Solicitud[],
    fechaInicio: string,
    fechaFin: string
  ) => {
    if (!fechaInicio || !fechaFin) return [];
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    return data.filter((solicitud) => {
      const fecha = new Date(solicitud.created_at);
      return fecha >= inicio && fecha <= fin;
    });
  };

  const formatFecha = (fecha: string) => {
    const date = new Date(fecha);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // +1 porque los meses van de 0 a 11
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const dataPorFecha = filtrarPorFechas(solicitudes, fechaInicio, fechaFin);

  const reports = [
    {
      id: "mayores-cantidades",
      title: "Top 3 Mayores Cantidades Solicitadas",
      description: (
        solicitudes: Solicitud[],
        inicio?: string,
        fin?: string,
      ) => {
        const top = [...solicitudes]
          .sort((a, b) => b.cantidad - a.cantidad)
          .slice(0, 3)
          .map((sol, i) => {
            const inventario = inventarios?.find(
              (inv) => inv.id_inventario === sol.fk_inventario
            );
            const elemento = elementos?.find(
              (e) => e.id_elemento === inventario?.fk_elemento
            );
            return `${i + 1}: ${elemento?.nombre ?? "Elemento desconocido"} - ${sol.cantidad} unidades solicitadas`;
          });

        const rango =
          inicio && fin
            ? `Fecha: ${formatFecha(inicio)} al ${formatFecha(fin)}.`
            : "";

        return `
${rango}

    
Este informe presenta las tres solicitudes con la mayor cantidad de unidades pedidas.
    
${top.join("\n")}
    
Estos datos pueden ayudarte a identificar los elementos más críticos en términos de demanda.`;
      },
      withTable: false,
      filterFn: (data: Solicitud[]) => data,
    },
    {
      id: "usuario-mayor-solicitudes",
      title: "Usuario con Mayor Número de Solicitudes",
      description: (
        solicitudes: Solicitud[],
        inicio?: string,
        fin?: string,
      ) => {
        const conteo: Record<number, number> = {};
        solicitudes.forEach((s) => {
          conteo[s.fk_usuario] = (conteo[s.fk_usuario] || 0) + 1;
        });

        const [idTop, total] =
          Object.entries(conteo).sort((a, b) => b[1] - a[1])[0] ?? [];
        const usuario = users?.find((u) => u.id_usuario === Number(idTop));
        const rango =
          inicio && fin
            ? `Fecha: ${formatFecha(inicio)} al ${formatFecha(fin)}.`
            : "";

        return `
${rango}
    
Este informe muestra qué usuario ha realizado más solicitudes dentro del sistema.
    
Usuario: ${usuario?.nombre ?? "Desconocido"} con ${total} solicitudes realizadas.
    
Estos datos pueden ser útiles para identificar usuarios activos o áreas de alta demanda.`;
      },
      withTable: false,
      filterFn: (data: Solicitud[]) => data,
    },
  
  ];

  const selected = reports.find((r) => r.id === selectedReport);
  const handleBack = () => setSelectedReport(null);

  if (selectedReport && selected) {
    const dataPorFecha = filtrarPorFechas(solicitudes, fechaInicio, fechaFin);
    const dataFiltrada = selected.filterFn(dataPorFecha).map((item) => ({
      ...item,
      created_at: formatFecha(item.created_at),
    }));

    return (
      <VisualizadorPDF
        onBack={handleBack}
        component={
          <ReportTemplate
            title={`${selected.title}`}
            description={selected.description(
              dataFiltrada,
              fechaInicio,
              fechaFin
            )}
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
          <div className="grid  xl:grid-cols-2 gap-4">
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
        <div className="p-4 grid md:grid-cols-3 gap-4">
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

import { useState } from "react";
import { VisualizadorPDF } from "@/components/organismos/PDFVisualizer";
import { ReportTemplate } from "@/components/templates/Report";
import { ReportCard } from "@/components/molecules/ReportCard";
import { useMovimiento } from "@/hooks/Movimientos/useMovimiento";
import { Movimiento } from "@/types/Movimiento";
import { useElemento } from "@/hooks/Elementos/useElemento";

export default function ReportMovimiento() {
  const { movimientos } = useMovimiento();
  const {elementos} = useElemento()
  const [fechaInicio, setFechaInicio] = useState<string>("");
  const [fechaFin, setFechaFin] = useState<string>("");
  const [selectedReport, setSelectedReport] = useState<string | null>(null);

  if (!movimientos) return <p>Cargando...</p>;

  const filtrarPorFechas = (
    data: Movimiento[],
    fechaInicio: string,
    fechaFin: string
  ) => {
    if (!fechaInicio || !fechaFin) return [];
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    return data.filter((movimiento) => {
      const fecha = new Date(movimiento.created_at);
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

  const dataPorFecha = filtrarPorFechas(movimientos, fechaInicio, fechaFin);

  const reports = [
    {
      id: "total-movimientos-rango",
      title: "Comportamiento de Movimientos en el Rango Seleccionado",
      description: (
        movimientos: Movimiento[],
        inicio?: string,
        fin?: string
      ) => {
        const total = movimientos.length;
        const aceptados = movimientos.filter((m) => m.aceptado).length;
        const pendientes = movimientos.filter((m) => m.en_proceso).length;
        const rechazados = movimientos.filter((m) => m.cancelado).length;

        const rango =
          inicio && fin
            ? `Fecha: ${formatFecha(inicio)} al ${formatFecha(fin)}.`
            : "";

        return `
${rango}

    
Durante este periodo, se registraron un total de ${total} movimientos.  
De ellos:

${aceptados} han sido aceptados
${pendientes} han quedado pendientes
${rechazados} han sidorechazados
    
Este informe proporciona una vista general del comportamiento del sistema de movimientos.`;
      },
      withTable: false,
      filterFn: (data: Movimiento[]) => data,
    },
    {
      id: "elementos-con-mas-movimientos",
      title: "Elementos con Mayor Frecuencia de Movimientos",
      description: (
        movimientos: Movimiento[],
        inicio?:string,
        fin?:string
      ) => {
        const conteo: Record<number, number> = {};
        movimientos.forEach((m) => {
          conteo[m.fk_inventario] = (conteo[m.fk_inventario] || 0) + 1;
        });

        const top = Object.entries(conteo)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([id, cantidad], i) => {
            const nombre =
              elementos?.find((el) => el.id_elemento === Number(id))?.nombre ??
              "Desconocido";
            return `${i + 1}: ${nombre} - ${cantidad} movimientos`;
          });
          const rango =
          inicio && fin
            ? `Fecha: ${formatFecha(inicio)} al ${formatFecha(fin)}.`
            : "";

        return `
${rango}

    
Este informe detalla los tres elementos a los que más se les han realizado movimientos.
    
${top.join("\n")}
    
Estos datos son útiles para detectar qué recursos tienen más rotación.`;
      },
      withTable: false,
      filterFn: (data: Movimiento[]) => data,
    },
    {
      id: "estado-movimientos",
      title: "Estado Más Frecuente de los Movimientos",
      description: (movimientos: Movimiento[], inicio?:string, fin?:string) => {
        const aceptados = movimientos.filter((m) => m.aceptado).length;
        const pendientes = movimientos.filter((m) => m.en_proceso).length;
        const rechazados = movimientos.filter((m) => m.cancelado).length;

        const estados = [
          { tipo: "Aceptados", cantidad: aceptados },
          { tipo: "Pendientes", cantidad: pendientes },
          { tipo: "Rechazados", cantidad: rechazados },
        ];

        const mayor = estados.sort((a, b) => b.cantidad - a.cantidad)[0];

        const rango =
          inicio && fin
            ? `Fecha: ${formatFecha(inicio)} al ${formatFecha(fin)}.`
            : "";

        return `
${rango}

    
El estado más frecuente en los movimientos registrados ha sido: ${mayor.tipo} con ${mayor.cantidad} ocurrencias.
    
Distribución total:
Aceptados: ${aceptados}
Pendientes: ${pendientes}
Rechazados: ${rechazados}
    
Esto refleja la tendencia actual de respuesta en los procesos de movimiento dentro del sistema.`;
      },
      withTable: false,
      filterFn: (data: Movimiento[]) => data,
    },
  ];

  const selected = reports.find((r) => r.id === selectedReport);
  const handleBack = () => setSelectedReport(null);

  if (selectedReport && selected) {
    const dataPorFecha = filtrarPorFechas(movimientos, fechaInicio, fechaFin);
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
            description={selected.description(dataFiltrada, fechaInicio, fechaFin)}
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

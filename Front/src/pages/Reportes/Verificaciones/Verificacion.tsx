import { useState } from "react";
import { VisualizadorPDF } from "@/components/organismos/PDFVisualizer";
import { ReportTemplate } from "@/components/templates/Report";
import { ReportCard } from "@/components/molecules/ReportCard";
import { useVerificacion } from "@/hooks/Verificaciones/useVerificacion";
import { Verificacion } from "@/types/Verificacion";
import { useSitios } from "@/hooks/sitios/useSitios";

export default function ReportVerificacion() {
  const { verificaciones } = useVerificacion();
  const { sitios } = useSitios();
  const [fechaInicio, setFechaInicio] = useState<string>("");
  const [fechaFin, setFechaFin] = useState<string>("");
  const [selectedReport, setSelectedReport] = useState<string | null>(null);

  if (!verificaciones) return <p>Cargando...</p>;

  const filtrarPorFechas = (
    data: Verificacion[],
    fechaInicio: string,
    fechaFin: string
  ) => {
    if (!fechaInicio || !fechaFin) return [];
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    return data.filter((verificacion) => {
      const fecha = new Date(verificacion.created_at);
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

  const dataPorFecha = filtrarPorFechas(verificaciones, fechaInicio, fechaFin);

  const reports = [
    {
      id: "sitio-mas-verificado",
      title: "Sitio Más Verificado",
      description: (
        verificaciones: Verificacion[],
        inicio?: string,
        fin?: string
      ) => {
        if (!verificaciones || verificaciones.length === 0)
          return "No hay verificaciones disponibles para este informe.";
    
        const conteo: Record<number, number> = {};
        verificaciones.forEach((v) => {
          conteo[v.fk_sitio] = (conteo[v.fk_sitio] || 0) + 1;
        });
    
        const [idTop, total] =
          Object.entries(conteo).sort((a, b) => b[1] - a[1])[0] ?? [];
        const sitio = sitios?.find((s) => s.id_sitio === Number(idTop));
        const rango =
          inicio && fin
            ? `Fecha: ${formatFecha(inicio)} al ${formatFecha(fin)}.`
            : "";
    
        return `
    ${rango}
    
    Este informe muestra cuál ha sido el sitio más verificado dentro del sistema.
    
    Sitio más verificado: ${sitio?.nombre ?? "Desconocido"} con un total de ${total} verificaciones realizadas.`;
      },
      withTable: false,
      filterFn: (verificaciones?: Verificacion[]) => verificaciones ?? [],
    },
    
    {
      id: "verificaciones-totales",
      title: "Listado de Verificaciones Realizadas",
      description: (
        verificaciones: Verificacion[],
        inicio?: string,
        fin?: string
      ) => {
        const total = verificaciones.length;
        const rango =
          inicio && fin
            ? `Fecha: ${formatFecha(inicio)} al ${formatFecha(fin)}.`
            : "";

        return `
    ${rango}
    
    Este informe presenta un listado detallado de todas las verificaciones registradas en el sistema.
    
    Total de verificaciones: ${total}.
    
    La verificación es un paso fundamental en el proceso de control y supervisión de elementos y materiales.`;
      },
      accessors: [
        "id_sitio",
        "hora_ingreso",
        "hora_salida",
        "persona_asignada",
        "created_at",
      ],
      headers: [
        "Sitio",
        "Hora Ingreso",
        "Hora Salida",
        "Responsable",
        "Fecha de creación",
      ],
      withTable: true,
      filterFn: (data: Verificacion[]) => data,
    },
    {
      id: "horario-frecuente",
      title: "Horario Frecuente de Verificación",
      description: (
        verificaciones: Verificacion[],
        inicio?: string,
        fin?: string
      ) => {
        if (!verificaciones || verificaciones.length === 0)
          return "No hay datos suficientes.";

        // Tomamos solo la hora de entrada y salida (formato HH)
        const horas: Record<string, number> = {};
        verificaciones.forEach((v) => {
          const horaIn = new Date(`1970-01-01T${v.hora_ingreso}`).getHours();
          const horaOut = new Date(`1970-01-01T${v.hora_salida}`).getHours();

          for (let h = horaIn; h <= horaOut; h++) {
            horas[h] = (horas[h] || 0) + 1;
          }
        });

        const horaFrecuente = Object.entries(horas).sort(
          (a, b) => b[1] - a[1]
        )[0];
        const horaFormateada = `${horaFrecuente?.[0]}:00`;
        const rango =
          inicio && fin
            ? `Fecha: ${formatFecha(inicio)} al ${formatFecha(fin)}.`
            : "";

        return `
    ${rango}
    
    Este informe determina la franja horaria más frecuente en la que se han realizado verificaciones.
    
    Horario más común: ${horaFormateada}, con un total de ${horaFrecuente?.[1]} verificaciones coincidentes.
    
    Esto puede indicar los momentos de mayor actividad o supervisión.`;
      },
      withTable: false,
      filterFn: (verificaciones?: Verificacion[]) => {
        if (!verificaciones) return [];
        return verificaciones;
      }
    },
    {
      id: "persona-frecuente",
      title: "Persona Más Asignada a Verificaciones",
      description: (
        verificaciones: Verificacion[],
        inicio?: string,
        fin?: string
      ) => {
        const conteo: Record<string, number> = {};
        verificaciones.forEach((v) => {
          if (v.persona_asignada) {
            conteo[v.persona_asignada] = (conteo[v.persona_asignada] || 0) + 1;
          }
        });

        const [nombreTop, total] =
          Object.entries(conteo).sort((a, b) => b[1] - a[1])[0] ?? [];
        const rango =
          inicio && fin
            ? `Fecha: ${formatFecha(inicio)} al ${formatFecha(fin)}.`
            : "";

        return `
    ${rango}
    
    Este informe identifica a la persona que más ha sido asignada a procesos de verificación.
    
    Persona: ${nombreTop} con ${total} verificaciones asignadas.`;
      },
      withTable: false,
      filterFn: (data: Verificacion[]) => data,
    },
  ];

  const selected = reports.find((r) => r.id === selectedReport);
  const handleBack = () => setSelectedReport(null);

  if (selectedReport && selected) {
    const dataPorFecha = filtrarPorFechas(verificaciones, fechaInicio, fechaFin);
    const dataFiltrada = selected.filterFn(dataPorFecha)?.map((item) => ({
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
              description={r.description(r.filterFn(dataPorFecha) ?? [])}
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

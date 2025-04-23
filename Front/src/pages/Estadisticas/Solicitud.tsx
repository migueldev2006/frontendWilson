import { Chart, registerables } from "chart.js";
import { useSolicitud } from "@/hooks/Solicitudes/useSolicitud";
import GraficaBase from "@/components/graficasBase/graficas";

Chart.register(...registerables);

export const SolicitudEstadisticas = () => {
  const { solicitudes, isLoading } = useSolicitud();

  if (isLoading) return <p>Cargando...</p>;
  if (!solicitudes || solicitudes.length === 0)
    return <p>No hay datos de solicitudes.</p>;

  const conteoPorEstado: Record<string, number> = {
    Pendiente: 0,
    Aceptada: 0,
    Rechazada: 0,
  };
  const conteoPorSede: Record<string, number> = {};
  const conteoPorMes: number[] = new Array(12).fill(0);
  const meses = [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic",
  ];

  solicitudes.forEach((solicitud) => {
    // Conteo por mes
    const mes = new Date(solicitud.created_at).getMonth();
    conteoPorMes[mes]++;
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-3">
      {/* Gráfica de barras - Solicitudes por estado */}
      <GraficaBase
        tipo="bar"
        className="dark:bg-zinc-800 dark:text-white"
        titulo="Solicitudes por estado"
        data={{
          labels: Object.keys(conteoPorEstado),
          datasets: [
            {
              label: "Cantidad de solicitudes",
              data: Object.values(conteoPorEstado),
              backgroundColor: "#60a5fa",
            },
          ],
        }}
      />

      {/* Gráfica de pie - Distribución de solicitudes por estado */}
      <GraficaBase
        tipo="pie"
        className="dark:bg-zinc-800 dark:text-white"
        titulo="Distribución de solicitudes"
        data={{
          labels: ["Pendientes", "Aceptadas", "Rechazadas"],
          datasets: [
            {
              data: [
                conteoPorEstado.Pendiente,
                conteoPorEstado.Aceptada,
                conteoPorEstado.Rechazada,
              ],
              backgroundColor: ["#f87171", "#34d399", "#60a5fa"],
            },
          ],
        }}
      />

      {/* Gráfica de radar - Solicitudes por sede */}
      <GraficaBase
        tipo="radar"
        className="dark:bg-zinc-800 dark:text-white"
        titulo="Solicitudes por sede"
        data={{
          labels: Object.keys(conteoPorSede),
          datasets: [
            {
              label: "Número de solicitudes",
              data: Object.values(conteoPorSede),
              backgroundColor: "rgba(59,130,246,0.2)",
              borderColor: "#3b82f6",
            },
          ],
        }}
      />

      {/* Gráfica de líneas - Solicitudes a lo largo del año */}
      <GraficaBase
        tipo="line"
        className="dark:bg-zinc-800 dark:text-white"
        titulo="Solicitudes a lo largo del tiempo"
        data={{
          labels: meses,
          datasets: [
            {
              label: "Solicitudes",
              data: conteoPorMes,
              borderColor: "#34d399",
              backgroundColor: "#bbf7d0",
              fill: true,
            },
          ],
        }}
      />
    </div>
  );
};

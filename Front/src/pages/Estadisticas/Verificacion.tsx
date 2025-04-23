import { Chart, registerables } from "chart.js";
import { useVerificacion } from "@/hooks/Verificaciones/useVerificacion";
import GraficaBase from "@/components/graficasBase/graficas";

Chart.register(...registerables);

export const VerificacionesEstadisticas = () => {
  const { verificaciones, isLoading } = useVerificacion();

  if (isLoading) return <p>Cargando...</p>;
  if (!verificaciones || verificaciones.length === 0)
    return <p>No hay datos de verificaciones.</p>;

  const conteoPorEstado: Record<string, number> = {
    Pendiente: 0,
    Completada: 0,
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

  verificaciones.forEach((verificacion) => {
    const mes = new Date(verificacion.created_at).getMonth();
    conteoPorMes[mes]++;
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-3">
      {/* Gráfica de barras - Verificaciones por estado */}
      <GraficaBase
        tipo="bar"
        className="dark:bg-zinc-800 dark:text-white"
        titulo="Verificaciones por estado"
        data={{
          labels: Object.keys(conteoPorEstado),
          datasets: [
            {
              label: "Cantidad de verificaciones",
              data: Object.values(conteoPorEstado),
              backgroundColor: "#60a5fa",
            },
          ],
        }}
      />

      {/* Gráfica de pie - Distribución de verificaciones (Completadas vs Pendientes) */}
      <GraficaBase
        tipo="pie"
        className="dark:bg-zinc-800 dark:text-white"
        titulo="Distribución de verificaciones"
        data={{
          labels: ["Completadas", "Pendientes", "Rechazadas"],
          datasets: [
            {
              data: [
                conteoPorEstado.Completada,
                conteoPorEstado.Pendiente,
                conteoPorEstado.Rechazada,
              ],
              backgroundColor: ["#34d399", "#f87171", "#60a5fa"],
            },
          ],
        }}
      />

      {/* Gráfica de radar - Verificaciones por sede */}
      <GraficaBase
        tipo="radar"
        className="dark:bg-zinc-800 dark:text-white"
        titulo="Verificaciones por sede"
        data={{
          labels: Object.keys(conteoPorSede),
          datasets: [
            {
              label: "Número de verificaciones",
              data: Object.values(conteoPorSede),
              backgroundColor: "rgba(59,130,246,0.2)",
              borderColor: "#3b82f6",
            },
          ],
        }}
      />

      {/* Gráfica de líneas - Verificaciones a lo largo del año */}
      <GraficaBase
        tipo="line"
        className="dark:bg-zinc-800 dark:text-white"
        titulo="Verificaciones a lo largo del tiempo"
        data={{
          labels: meses,
          datasets: [
            {
              label: "Verificaciones",
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

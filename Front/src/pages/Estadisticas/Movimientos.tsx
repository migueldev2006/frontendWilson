import { Chart, registerables } from "chart.js";
import { useMovimiento } from "@/hooks/Movimientos/useMovimiento";
import GraficaBase from "@/components/graficasBase/graficas";

Chart.register(...registerables);

export const MovimientoEstadisticas = () => {
  const { movimientos, isLoading } = useMovimiento();

  if (isLoading) return <p>Cargando...</p>;
  if (!movimientos || movimientos.length === 0) return <p>No hay datos de movimientos.</p>;

  const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  const conteoPorMes = new Array(12).fill(0);

  const estadoCounts = { aceptado: 0, en_proceso: 0, cancelado: 0 };
  const tipoCounts: Record<string, number> = {};
  let devolutivos = 0;
  let no_devolutivos = 0;

  movimientos.forEach((mov) => {
    const mes = new Date(mov.created_at).getMonth();
    conteoPorMes[mes]++;

    if (mov.aceptado) estadoCounts.aceptado++;
    else if (mov.en_proceso) estadoCounts.en_proceso++;
    else if (mov.cancelado) estadoCounts.cancelado++;

    mov.devolutivo ? devolutivos++ : no_devolutivos++;

    tipoCounts[mov.tipo_movimiento] = (tipoCounts[mov.tipo_movimiento] || 0) + 1;
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-3">
      {/* Line - Movimientos por mes */}
      <GraficaBase
        tipo="line"
        className="dark:bg-zinc-800 dark:text-white"
        titulo="Movimientos registrados por mes"
        data={{
          labels: meses,
          datasets: [{
            label: "Movimientos",
            data: conteoPorMes,
            borderColor: "#3b82f6",
            backgroundColor: "#93c5fd",
            fill: true,
          }]
        }}
      />

      {/* Pie - Estado de movimientos */}
      <GraficaBase
        tipo="pie"
        className="dark:bg-zinc-800 dark:text-white"
        titulo="Estado de los movimientos"
        data={{
          labels: ["Aceptados", "En proceso", "Cancelados"],
          datasets: [{
            data: [estadoCounts.aceptado, estadoCounts.en_proceso, estadoCounts.cancelado],
            backgroundColor: ["#22c55e", "#facc15", "#ef4444"]
          }]
        }}
      />

      {/* Radar - Tipos de movimiento */}
      <GraficaBase
        tipo="bar"
        className="dark:bg-zinc-800 dark:text-white"
        titulo="Tipos de movimiento"
        data={{
          labels: Object.keys(tipoCounts),
          datasets: [{
            label: "Movimientos por tipo",
            data: Object.values(tipoCounts),
            backgroundColor: "rgba(251,191,36,0.3)",
            borderColor: "#fbbf24",
            pointBackgroundColor: "#fbbf24"
          }]
        }}
      />

      {/* PolarArea - Devolutivos vs No */}
      <GraficaBase
        tipo="polarArea"
        className="dark:bg-zinc-800 dark:text-white"
        titulo="Devolutivos vs No Devolutivos"
        data={{
          labels: ["Devolutivos", "No devolutivos"],
          datasets: [{
            data: [devolutivos, no_devolutivos],
            backgroundColor: ["#0ea5e9", "#a78bfa"]
          }]
        }}
      />
    </div>
  );
};
import { Chart, registerables } from "chart.js";
import GraficaBase from "@/components/graficasBase/graficas";
import {  useMasUsados } from "@/hooks/Movimientos/useMasUsados";

Chart.register(...registerables);

const TopElementosUsados = () => {
  const { topElementos, isLoading, isError, error } = useMasUsados();

  if (isLoading) return <p>Cargando datos...</p>;
  if (isError) return <p>Error cargando datos: {`${error}`}</p>;
  if (!topElementos || topElementos.length === 0) return <p>No hay datos de uso.</p>;

  const labels = topElementos.map(e => e.nombre);
  const valores = topElementos.map(e => e.total_usos);

  const barData = {
    labels,
    datasets: [
      {
        label: "Total de usos por elemento",
        data: valores,
        backgroundColor: labels.map((_, i) => `hsl(${(i * 36) % 360}, 70%, 60%)`),
      },
    ],
  };

  const barOptions = {
    responsive: true,
    indexAxis: "y" as const, // Barras horizontales
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          precision: 0,
          stepSize: 1,
        },
      },
    },
  };

  return (
    <div className="p-4">
      <GraficaBase
        className="bg-white dark:bg-zinc-800 dark:text-white"
        tipo="bar"
        data={barData}
        options={barOptions}
        titulo="Top elementos más usados"
      />
    </div>
  );
};

export default TopElementosUsados;

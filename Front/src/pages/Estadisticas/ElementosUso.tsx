import { Chart, registerables } from "chart.js";
import { useElementUso } from "@/hooks/Elementos/useElementUso";
import GraficaBase from "@/components/graficasBase/graficas";

Chart.register(...registerables);

const ElementosEstadisticas = () => {
  const { elementUso, isLoading, isError, error } = useElementUso();

  if (isLoading) return <p>Cargando datos...</p>;
  if (isError) return <p>Error: {error?.message}</p>;
  if (!elementUso || elementUso.length === 0) return <p>No hay datos disponibles.</p>;

  const doughnutData = {
    labels: elementUso.map(e => e.elemento),
    datasets: [
      {
        label: "Índice de uso (%)",
        data: elementUso.map(e => +(e.indice_uso * 100).toFixed(2)),
        backgroundColor: [
          "#60a5fa", "#34d399", "#fbbf24", "#f87171", "#a78bfa",
          "#f472b6", "#4ade80", "#818cf8", "#fb7185", "#facc15"
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="p-4">
      <GraficaBase
        tipo="doughnut"
        data={doughnutData}
        titulo="Índice de uso por elemento (%)"
        className="bg-white dark:bg-zinc-800 dark:text-white w-1/2 h-auto"
      />
    </div>
  );
};

export default ElementosEstadisticas;
import { Chart, registerables } from "chart.js";
import { useElementUso } from "@/hooks/Elementos/useElementUso";
import GraficaBase from "@/components/graficasBase/graficas";

Chart.register(...registerables);

const ElementosEstadisticas = () => {
  const { elementUso, isLoading, isError, error } = useElementUso();

  if (isLoading) return <p>Cargando datos...</p>;
  if (isError) return <p>Error: {error?.message}</p>;
  if (!elementUso || elementUso.length === 0) return <p>No hay datos disponibles.</p>;

  // Agrupar por área
  const datosPorArea = elementUso.reduce((acc, curr) => {
    const { area, elemento, indice_uso } = curr;
    if (!acc[area]) acc[area] = [];
    acc[area].push({ elemento, indice_uso });
    return acc;
  }, {} as Record<string, { elemento: string; indice_uso: number }[]>);

  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
      {Object.entries(datosPorArea).map(([area, elementos]) => {
        const data = {
          labels: elementos.map(e => e.elemento),
          datasets: [
            {
              label: "Índice de uso (%)",
              data: elementos.map(e => +(e.indice_uso * 100).toFixed(2)),
              backgroundColor: [
                "#60a5fa", "#34d399", "#fbbf24", "#f87171", "#a78bfa",
                "#f472b6", "#4ade80", "#818cf8", "#fb7185", "#facc15"
              ],
              borderWidth: 1,
            },
          ],
        };

        return (
          <GraficaBase
            key={area}
            tipo="doughnut"
            data={data}
            titulo={`Índice de uso por elemento - ${area}`}
            className="bg-white dark:bg-zinc-800 dark:text-white w-full h-auto"
          />
        );
      })}
    </div>
  );
};

export default ElementosEstadisticas;

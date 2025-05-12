import { Chart, registerables } from "chart.js";
import { useMovimientosPorMes } from "@/hooks/Movimientos/useMovimientoMes";
import GraficaBase from "@/components/graficasBase/graficas";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { MovimientoMes } from "@/types/Movimiento";

Chart.register(...registerables);

const colores = [
  "#60a5fa", "#f87171", "#34d399", "#fbbf24", "#a78bfa", "#f472b6",
  "#fb923c", "#818cf8", "#2dd4bf", "#c084fc"
];

const GraficaMovimientosMes = () => {
  const { movimientosMes = [], isLoading, isError } = useMovimientosPorMes();

  if (isLoading) return <p>Cargando movimientos...</p>;
  if (isError || !movimientosMes.length) return <p>No hay datos.</p>;

  
  const mesesUnicos = Array.from(
    new Set(movimientosMes.map((m) => format(new Date(m.mes), "yyyy-MM")))
  ).sort();

  const etiquetas = mesesUnicos.map((m) =>
    format(new Date(m + "-01"), "MMM yyyy", { locale: es })
  );

  
  const movimientosPorArea = movimientosMes.reduce((acc, movimiento) => {
    if (!acc[movimiento.area]) acc[movimiento.area] = [];
    acc[movimiento.area].push(movimiento);
    return acc;
  }, {} as Record<string, MovimientoMes[]>);

  const graficas = Object.entries(movimientosPorArea).map(([area, movimientos]) => {
    
    const tipoElementoKeys = Array.from(
      new Set(movimientos.map(m => `${m.tipo_movimiento} | ${m.elemento}`))
    );

    const datasets = tipoElementoKeys.map((key, idx) => {
      const [tipo, elemento] = key.split(" | ");
      const dataPorMes = mesesUnicos.map((mesKey) => {
        const m = movimientos.find(
          (x) =>
            x.tipo_movimiento === tipo &&
            x.elemento === elemento &&
            format(new Date(x.mes), "yyyy-MM") === mesKey
        );
        return m?.total || 0;
      });

      return {
        label: `${tipo} - ${elemento}`,
        data: dataPorMes,
        backgroundColor: colores[idx % colores.length],
      };
    });

    const data = {
      labels: etiquetas,
      datasets,
    };

    return (
      <GraficaBase
        key={area}
        className="bg-white dark:bg-zinc-800 dark:text-white"
        tipo="bar"
        data={data}
        options={{
          responsive: true,
          plugins: { legend: { position: "top" } },
          scales: {
            x: { stacked: false },
            y: { beginAtZero: true, ticks: { precision: 0, stepSize: 1 } },
          },
        }}
        titulo={`Movimientos por mes - Área: ${area}`}
      />
    );
  });

  return (
    <div className="p-3">
      <h2 className="text-xl font-semibold mb-4 text-zinc-800 dark:text-white">
        Movimientos por Mes y Producto
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {graficas}
      </div>
    </div>
  );
};

export default GraficaMovimientosMes;

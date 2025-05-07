import { Chart, registerables } from "chart.js";
import { useMovimientosPorMes } from "@/hooks/Movimientos/useMovimientoMes";
import GraficaBase from "@/components/graficasBase/graficas";
import { format } from "date-fns";
import { es } from "date-fns/locale";
Chart.register(...registerables);

const colores = [
  "#60a5fa", "#f87171", "#34d399", "#fbbf24", "#a78bfa", "#f472b6",
  "#fb923c", "#818cf8", "#2dd4bf", "#c084fc"
];

const GraficaMovimientosMes = () => {
  const { movimientosMes=[], isLoading, isError } = useMovimientosPorMes();

  if (isLoading) return <p>Cargando movimientos...</p>;
  if (isError || !movimientosMes.length) return <p>No hay datos.</p>;

  // Extraer y ordenar los meses
  const mesesUnicos = Array.from(
    new Set(movimientosMes.map((m) => format(new Date(m.mes), "yyyy-MM")))
  ).sort();

  const etiquetas = mesesUnicos.map((m) =>
    format(new Date(m + "-01"), "MMM yyyy", { locale: es })
  );

  // Agrupar los datos por tipo de movimiento
  const tipos = Array.from(new Set(movimientosMes.map((m) => m.tipo_movimiento)));

  const datasets = tipos.map((tipo, idx) => {
    const dataPorMes = mesesUnicos.map((mesKey) => {
      const encontrado = movimientosMes.find(
        (m) =>
          m.tipo_movimiento === tipo &&
          format(new Date(m.mes), "yyyy-MM") === mesKey
      );
      return encontrado?.total || 0;
    });

    return {
      label: tipo,
      data: dataPorMes,
      backgroundColor: colores[idx % colores.length],
    };
  });

  const data = {
    labels: etiquetas,
    datasets,
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      x: {
        stacked: false,
      },
      y: {
        stacked: false,
        beginAtZero: true,
        ticks: {
          precision: 0,
          stepSize: 1,
        },
      },
    },
  };
  

  return (
    <GraficaBase
      className="bg-white dark:bg-zinc-800 dark:text-white"
      tipo="bar"
      data={data}
      options={options}
      titulo="Movimientos por mes"
    />
  );
};

export default GraficaMovimientosMes;

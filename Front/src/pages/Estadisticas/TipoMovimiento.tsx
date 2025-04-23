import { Chart, registerables } from "chart.js";
import { useTipoMovimiento } from "@/hooks/TiposMovimento/useTipoMovimiento";
import GraficaBase from "@/components/graficasBase/graficas";

Chart.register(...registerables);

export const TipoEstadisticas = () => {
  const { tipos, isLoading } = useTipoMovimiento();

  if (isLoading) return <p>Cargando...</p>;
  if (!tipos || tipos.length === 0) return <p>No hay datos de tipos de movimiento.</p>;

  const activos = tipos.filter(t => t.estado).length;
  const inactivos = tipos.length - activos;

  const conteoPorMes = new Array(12).fill(0);
  const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

  const conteoPorNombre: Record<string, number> = {};

  tipos.forEach((tipo) => {
    // Conteo por mes
    const mes = new Date(tipo.created_at).getMonth();
    conteoPorMes[mes]++;

    // Conteo por nombre (puede haber repetidos en BD)
    conteoPorNombre[tipo.nombre] = (conteoPorNombre[tipo.nombre] || 0) + 1;
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-3">
      {/* Gráfica de barras - Tipos por mes */}
      <GraficaBase
        tipo="bar"
        className="dark:bg-zinc-800 dark:text-white"
        titulo="Tipos de movimiento creados por mes"
        data={{
          labels: meses,
          datasets: [{
            label: "Tipos creados",
            data: conteoPorMes,
            backgroundColor: "#60a5fa"
          }]
        }}
      />

      {/* Gráfica Doughnut - Activos vs Inactivos */}
      <GraficaBase
        tipo="doughnut"
        className="dark:bg-zinc-800 dark:text-white"
        titulo="Distribución por estado"
        data={{
          labels: ["Activos", "Inactivos"],
          datasets: [{
            data: [activos, inactivos],
            backgroundColor: ["#4ade80", "#f87171"]
          }]
        }}
      />

      {/* PolarArea - Conteo por nombre */}
      <GraficaBase
        tipo="polarArea"
        className="dark:bg-zinc-800 dark:text-white"
        titulo="Tipos por nombre"
        data={{
          labels: Object.keys(conteoPorNombre),
          datasets: [{
            data: Object.values(conteoPorNombre),
            backgroundColor: [
              "#facc15", "#60a5fa", "#34d399", "#f87171", "#c084fc", "#f472b6"
            ]
          }]
        }}
      />
    </div>
  );
};
import { Chart, registerables } from "chart.js";
import { useUnidad } from "@/hooks/UnidadesMedida/useUnidad";
import GraficaBase from "@/components/graficasBase/graficas";

Chart.register(...registerables);

export const UnidadesEstadisticas = () => {
  const { unidades, isLoading } = useUnidad();

  if (isLoading) return <p>Cargando...</p>;
  if (!unidades || unidades.length === 0) return <p>No hay datos de unidades de medida.</p>;

  const activos = unidades.filter(u => u.estado).length;
  const inactivos = unidades.length - activos;

  const conteoPorMes = new Array(12).fill(0);
  const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

  const conteoPorNombre: Record<string, number> = {};

  unidades.forEach((unidad) => {
    const mes = new Date(unidad.created_at).getMonth();
    conteoPorMes[mes]++;

    conteoPorNombre[unidad.nombre] = (conteoPorNombre[unidad.nombre] || 0) + 1;
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-3">
      {/* Gráfica Line - Unidades por mes */}
      <GraficaBase
        tipo="line"
        className="dark:bg-zinc-800 dark:text-white"
        titulo="Unidades creadas por mes"
        data={{
          labels: meses,
          datasets: [{
            label: "Unidades creadas",
            data: conteoPorMes,
            borderColor: "#6366f1",
            backgroundColor: "#c7d2fe",
            fill: true
          }]
        }}
      />

      {/* Gráfica Doughnut - Activas vs Inactivas */}
      <GraficaBase
        tipo="doughnut"
        className="dark:bg-zinc-800 dark:text-white"
        titulo="Estado de las unidades"
        data={{
          labels: ["Activas", "Inactivas"],
          datasets: [{
            data: [activos, inactivos],
            backgroundColor: ["#22c55e", "#ef4444"]
          }]
        }}
      />

      {/* Gráfica Radar - Recuento por nombre */}
      <GraficaBase
        tipo="bar"
        className="dark:bg-zinc-800 dark:text-white"
        titulo="Recuento por tipo de unidad"
        data={{
          labels: Object.keys(conteoPorNombre),
          datasets: [{
            label: "Unidades registradas",
            data: Object.values(conteoPorNombre),
            backgroundColor: "rgba(14,165,233,0.2)",
            borderColor: "#0ea5e9",
            pointBackgroundColor: "#0ea5e9"
          }]
        }}
      />
    </div>
  );
};

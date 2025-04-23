import { Chart, registerables } from "chart.js";
import { useInventario } from "@/hooks/Inventarios/useInventario";
import GraficaBase from "@/components/graficasBase/graficas";

Chart.register(...registerables);

export const InventarioEstadisticas = () => {
  const { inventarios, isLoading } = useInventario();

  if (isLoading) return <p>Cargando...</p>;
  if (!inventarios || inventarios.length === 0) return <p>No hay datos de inventarios.</p>;

  const inventariosPorSitio: Record<string, number> = {};
  const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  const inventariosPorMes = new Array(12).fill(0);
  let activos = 0;
  let inactivos = 0;
  const puntosStock: { x: number; y: number }[] = [];

  inventarios.forEach((inv, index) => {
    // Conteo por sitio
    const sitioKey = `Sitio ${inv.fk_sitio}`;
    inventariosPorSitio[sitioKey] = (inventariosPorSitio[sitioKey] || 0) + 1;

    // Por mes
    const mes = new Date(inv.created_at).getMonth();
    inventariosPorMes[mes]++;

    // Estado
    inv.estado ? activos++ : inactivos++;

    // Stock
    puntosStock.push({ x: index + 1, y: inv.stock });
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4 p-3">
      {/* Bar - Inventarios por sitio */}
      <GraficaBase
        tipo="bar"
        className="dark:bg-zinc-800 dark:text-white"
        titulo="Inventarios por sitio"
        data={{
          labels: Object.keys(inventariosPorSitio),
          datasets: [{
            label: "Cantidad de inventarios",
            data: Object.values(inventariosPorSitio),
            backgroundColor: "#60a5fa"
          }]
        }}
      />

      {/* Line - Inventarios creados por mes */}
      <GraficaBase
        tipo="line"
        className="dark:bg-zinc-800 dark:text-white"
        titulo="Inventarios creados por mes"
        data={{
          labels: meses,
          datasets: [{
            label: "Inventarios",
            data: inventariosPorMes,
            borderColor: "#34d399",
            backgroundColor: "#bbf7d0",
            fill: true
          }]
        }}
      />

      {/* Doughnut - Estado del inventario */}
      <GraficaBase
        tipo="doughnut"
        className="dark:bg-zinc-800 dark:text-white"
        titulo="Estado de los inventarios"
        data={{
          labels: ["Activos", "Inactivos"],
          datasets: [{
            data: [activos, inactivos],
            backgroundColor: ["#4ade80", "#f87171"]
          }]
        }}
      />

      {/* Scatter - Distribución del stock */}
      <GraficaBase
        tipo="scatter"
        className="dark:bg-zinc-800 dark:text-white"
        titulo="Distribución de stock por inventario"
        data={{
          datasets: [{
            label: "Stock",
            data: puntosStock,
            backgroundColor: "#facc15"
          }]
        }}
      />
    </div>
  );
};
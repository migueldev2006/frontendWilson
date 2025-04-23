import { Chart, registerables } from "chart.js";
import { useElemento } from "@/hooks/Elementos/useElemento";
import GraficaBase from "@/components/graficasBase/graficas";

Chart.register(...registerables);

export const ElementoEstadisticas = () => {
  const { elementos, isLoading } = useElemento();
  if (isLoading) return <p>Cargando...</p>;
  if (!elementos?.length) return <p>No hay elementos registrados.</p>;

  const porTipo = { perecederos: 0, noPerecederos: 0 };
  const porMes = new Array(12).fill(0);
  const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  let activos = 0;

  elementos.forEach(el => {
    if (el.perecedero) porTipo.perecederos++;
    else porTipo.noPerecederos++;

    const mes = new Date(el.created_at).getMonth();
    porMes[mes]++;

    if (el.estado) activos++;
  });

  const inactivos = elementos.length - activos;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3">
      <GraficaBase className="dark:bg-zinc-800 dark:text-white"  tipo="pie" data={{
        labels: ["Perecederos", "No perecederos"],
        datasets: [{ data: [porTipo.perecederos, porTipo.noPerecederos], backgroundColor: ["#facc15", "#818cf8"] }]
      }} titulo="Tipo de elementos" />
      <GraficaBase className="dark:bg-zinc-800 dark:text-white" tipo="line" data={{
        labels: meses,
        datasets: [{ label: "Creados por mes", data: porMes, backgroundColor: "#bbf7d0", borderColor: "#34d399", fill: true }]
      }} titulo="Elementos creados por mes" />
      <GraficaBase className="dark:bg-zinc-800 dark:text-white" tipo="pie" data={{
        labels: ["Activos", "Inactivos"],
        datasets: [{ data: [activos, inactivos], backgroundColor: ["#4ade80", "#f87171"] }]
      }} titulo="Estado de elementos" />
    </div>
  );
};
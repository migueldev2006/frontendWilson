import { Chart, registerables } from "chart.js";
import { useSede } from "../../hooks/sedes/useSedes";
import GraficaBase from "@/components/graficasBase/graficas";

Chart.register(...registerables);

const sedesEstadisticas = () => {
  const { sede, isLoading } = useSede();

  if (isLoading) return <p>Cargando...</p>;
  if (!sede || sede.length === 0) return <p>No hay datos de sedes.</p>;


  const conteoPorCentro: Record<string, number> = {}; 
  const conteoPorMes: number[] = new Array(12).fill(0); 
  const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  let activas = 0; 

  sede.forEach((sede) => {
   
    const sedeKey = `centro ${sede.fk_centro}`;
    conteoPorCentro[sedeKey] = (conteoPorCentro[sedeKey] || 0) + 1;

   
    const mes = new Date(sede.created_at).getMonth();
    conteoPorMes[mes]++;

    
    if (sede.estado) activas++;
  });

  const inactivas = sede.length - activas; 


  const barData = {
    labels: Object.keys(conteoPorCentro), 
    datasets: [
      {
        label: "Sedes por centro",
        data: Object.values(conteoPorCentro), 
        backgroundColor: "#60a5fa", 
      },
    ],
  };

  const lineData = {
    labels: meses, 
    datasets: [
      {
        label: "Sedes creadas por mes",
        data: conteoPorMes, 
        borderColor: "#34d399", 
        backgroundColor: "#bbf7d0", 
        fill: true, 
      },
    ],
  };

  const pieData = {
    labels: ["Activas", "Inactivas"], 
    datasets: [
      {
        data: [activas, inactivas], 
        backgroundColor: ["#4ade80", "#f87171"], 
      },
    ],
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3">
      <GraficaBase className="bg-white dark:bg-zinc-800 dark:text-white" tipo="bar" data={barData} titulo="Sedes por centro" />
      <GraficaBase className="bg-white dark:bg-zinc-800 dark:text-white" tipo="line" data={lineData} titulo="Sedes creadas por mes" />
      <GraficaBase className="bg-white dark:bg-zinc-800 dark:text-white" tipo="pie" data={pieData} titulo="Distribución de estado" />
    </div>
  );
};

export default sedesEstadisticas;

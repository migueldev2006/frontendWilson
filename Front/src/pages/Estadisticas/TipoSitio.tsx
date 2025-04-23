import { Chart, registerables } from "chart.js";
import {  useTipoSitio } from "../../hooks/TipoSitio/useTipoSitio";
import GraficaBase from "@/components/graficasBase/graficas";

Chart.register(...registerables);

const TipoSitioEstadisticas = () => {
  const { tipos, isLoading } = useTipoSitio();
  

  if (isLoading) return <p>Cargando...</p>;
  if (!tipos || tipos.length === 0) return <p>No hay datos de tipos de sitios.</p>;

  const conteoPorMes: number[] = new Array(12).fill(0); 
  const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  let activas = 0; // Contador de áreas activas

  tipos.forEach((tipoSitio) => {
  
    const mes = new Date(tipoSitio.created_at).getMonth();
    conteoPorMes[mes]++;
  
    if (tipoSitio.estado) activas++;
  });
  
  const inactivas = tipos.length - activas;
  
  // Aquí generas las labels y los valores para la gráfica
 

  const lineData = {
    labels: meses, 
    datasets: [
      {
        label: "Tipo de sitios creados por mes",
        data: conteoPorMes, 
        borderColor: "#34d399", 
        backgroundColor: "#bbf7d0", 
        fill: true, 
      },
    ],
  };

  const pieData = {
    labels: ["Activos", "Inactivos"], 
    datasets: [
      {
        data: [activas, inactivas], 
        backgroundColor: ["#4ade80", "#f87171"], 
      },
    ],
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3">
      
      <GraficaBase className="bg-white dark:bg-zinc-800 dark:text-white" tipo="line" data={lineData} titulo="Tipo de sitios creados por mes" />
      <GraficaBase className="bg-white dark:bg-zinc-800 dark:text-white" tipo="pie" data={pieData} titulo="Distribución de estado" />
    </div>
  );
};

export default TipoSitioEstadisticas;

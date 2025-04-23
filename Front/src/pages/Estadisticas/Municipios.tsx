import { Chart, registerables } from "chart.js";
import {  useMunicipio } from "../../hooks/Municipio/useMunicipio";
import GraficaBase from "@/components/graficasBase/graficas";

Chart.register(...registerables);

const MunicipioEstadisticas = () => {
  const { municipios, isLoading } = useMunicipio();

  if (isLoading) return <p>Cargando...</p>;
  if (!municipios || municipios.length === 0) return <p>No hay datos de áreas.</p>;



  const conteoPorMes: number[] = new Array(12).fill(0); 
  const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  let activas = 0; // Contador de áreas activas

  municipios.forEach((area) => {
 
    const mes = new Date(area.created_at).getMonth();
    conteoPorMes[mes]++;

    
    if (area.estado) activas++;
  });

  const inactivas = municipios.length - activas; 


  

  const lineData = {
    labels: meses, 
    datasets: [
      {
        label: "Municipios creados por mes",
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
      <GraficaBase className="bg-white dark:bg-zinc-800 dark:text-white" tipo="line" data={lineData} titulo="Municipios creados por mes" />
      <GraficaBase className="bg-white dark:bg-zinc-800 dark:text-white" tipo="pie" data={pieData} titulo="Distribución de estado" />
    </div>
  );
};

export default MunicipioEstadisticas;

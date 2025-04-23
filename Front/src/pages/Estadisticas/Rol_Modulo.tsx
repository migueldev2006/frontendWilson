import { Chart, registerables } from "chart.js";
import {useRolModulo } from "../../hooks/rolModulo/useRolModulo";
import GraficaBase from "@/components/graficasBase/graficas";

Chart.register(...registerables);

const RolModuloEstadisticas = () => {
  const { rolModulos, isLoading } = useRolModulo();

  if (isLoading) return <p>Cargando...</p>;
  if (!rolModulos || rolModulos.length === 0) return <p>No hay datos de programas.</p>;


  
  const conteoPorMes: number[] = new Array(12).fill(0); 
  const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];


  rolModulos.forEach((area) => {
   


   
    const mes = new Date(area.created_at).getMonth();
    conteoPorMes[mes]++;

    

  });






  const lineData = {
    labels: meses, 
    datasets: [
      {
        label: "Rol modulo creados por mes",
        data: conteoPorMes, 
        borderColor: "#34d399", 
        backgroundColor: "#bbf7d0", 
        fill: true, 
      },
    ],
  };



  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3">
  
      <GraficaBase className="bg-white dark:bg-zinc-800 dark:text-white" tipo="line" data={lineData} titulo="Rol modulo  creados por mes" />
    
    </div>
  );
};

export default RolModuloEstadisticas;

import { Chart, registerables } from "chart.js";
import { useCaracteristica } from "../../hooks/Caracteristicas/useCaracteristicas";
import GraficaBase from "@/components/graficasBase/graficas";

Chart.register(...registerables);

const CaracteristicasEstadisticas = () => {
  const { caracteristicas, isLoading } = useCaracteristica();

  if (isLoading) return <p>Cargando...</p>;
  if (!caracteristicas || caracteristicas.length === 0) return <p>No hay datos de Caracteristicas.</p>;


  
  const conteoPorMes: number[] = new Array(12).fill(0); 
  const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];


  caracteristicas.forEach((caracteristica) => {

   
    const mes = new Date(caracteristica.created_at).getMonth();
    conteoPorMes[mes]++;


  });

   



  const lineData = {
    labels: meses, 
    datasets: [
      {
        label: "Caracteristicas creadas por mes",
        data: conteoPorMes, 
        borderColor: "#34d399", 
        backgroundColor: "#bbf7d0", 
        fill: true, 
      },
    ],
  };

  

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3">
      
      <GraficaBase className="bg-white dark:bg-zinc-800 dark:text-white" tipo="line" data={lineData} titulo="Caracteristicas creadas por mes" />
      
    </div>
  );
};

export default CaracteristicasEstadisticas;

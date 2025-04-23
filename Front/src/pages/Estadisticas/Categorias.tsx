import { Chart, registerables } from "chart.js";
import { useCategoria } from "../../hooks/Categorias/useCategorias";
import GraficaBase from "@/components/graficasBase/graficas";

Chart.register(...registerables);

const CategoriasEstadisticas = () => {
  const {  categorias, isLoading } = useCategoria();

  if (isLoading) return <p>Cargando...</p>;
  if (!categorias || categorias.length === 0) return <p>No hay datos de categorias.</p>;


  
  const conteoPorMes: number[] = new Array(12).fill(0); 
  const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  let activas = 0; // Contador de áreas activas

  categorias.forEach((area) => {
   
   
    const mes = new Date(area.created_at).getMonth();
    conteoPorMes[mes]++;

    
    if (area.estado) activas++;
  });

  const inactivas = categorias.length - activas; 



  const lineData = {
    labels: meses, 
    datasets: [
      {
        label: "Categorias creadas por mes",
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
      <GraficaBase className="bg-white dark:bg-zinc-800 dark:text-white" tipo="line" data={lineData} titulo="Categorias creadas por mes" />
      <GraficaBase className="bg-white dark:bg-zinc-800 dark:text-white" tipo="pie" data={pieData} titulo="Distribución de estado" />
    </div>
  );
};

export default CategoriasEstadisticas;

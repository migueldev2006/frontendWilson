import { Chart, registerables } from "chart.js";
import { usePermisos } from "../../hooks/permisos/usePermisos";
import GraficaBase from "@/components/graficasBase/graficas";

Chart.register(...registerables);

const PermisosEstadisticas = () => {
  const { permiso, isLoading } = usePermisos();

  if (isLoading) return <p>Cargando...</p>;
  if (!permiso || permiso.length === 0) return <p>No hay datos de permiso.</p>;


  
 
  const conteoPorMes: number[] = new Array(12).fill(0); 
  
  
  const mesesNombres = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  
  permiso.forEach((permisos) => {
   
 
  
    const mes = new Date(permisos.created_at).getMonth();
    conteoPorMes[mes]++;

    
   
  });



  const barDat = {
    labels: mesesNombres,
    datasets: [
      {
        label: "Total de permisos",
        data: conteoPorMes,
        backgroundColor: "#34d399",
      },
    ],
  };


 

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3">
     
      <GraficaBase className="bg-white dark:bg-zinc-800 dark:text-white" tipo="bar" data={barDat} titulo="permisos por mes" />


    </div>
  );
};

export default PermisosEstadisticas;

import { Chart, registerables } from "chart.js";
import { useSitios } from "../../hooks/sitios/useSitios";
import GraficaBase from "@/components/graficasBase/graficas";

Chart.register(...registerables);

const SitioEstadisticas = () => {
  const { sitios, isLoading } = useSitios();

  if (isLoading) return <p>Cargando...</p>;
  if (!sitios || sitios.length === 0) return <p>No hay datos de sitios.</p>;


  const conteoPorArea: Record<string, number> = {}; 
  const conteoPorTipoSitio: Record<string, number> = {}; 
  const conteoPorMes: number[] = new Array(12).fill(0); 
  
  let activas = 0; // Contador de áreas activas
  const mesesNombres = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  sitios.forEach((sitio) => {
   
    const sitioKey = `Area ${sitio.fk_area}`;
    conteoPorArea[sitioKey] = (conteoPorArea[sitioKey] || 0) + 1;

    const sedeKey = `Tipo de sitio ${sitio.fk_tipo_sitio}`;
    conteoPorTipoSitio[sedeKey] = (conteoPorTipoSitio[sedeKey] || 0) + 1;

   
    const mes = new Date(sitio.created_at).getMonth();
    conteoPorMes[mes]++;

    
    if (sitio.estado) activas++;
  });

  const inactivas = sitios.length - activas; 

  const barDat = {
    labels: mesesNombres,
    datasets: [
      {
        label: "Total de sitios",
        data: conteoPorMes,
        backgroundColor: "#34d399",
      },
    ],
  };
  const barData = {
    labels: Object.keys(conteoPorArea), 
    datasets: [
      {
        label: "sitios por area",
        data: Object.values(conteoPorArea), 
        backgroundColor: "#60a5fa", 
      },
    ],
  };
  const barDatas = {
    labels: Object.keys(conteoPorTipoSitio), 
    datasets: [
      {
        label: "sitios por tipo de sitio",
        data: Object.values(conteoPorTipoSitio), 
        backgroundColor: "#60a5fa", 
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
      <GraficaBase className="bg-white dark:bg-zinc-800 dark:text-white" tipo="bar" data={barData} titulo="sitios por area" />
      <GraficaBase className="bg-white dark:bg-zinc-800 dark:text-white" tipo="bar" data={barDat} titulo="sitios por mes" />
      <GraficaBase className="bg-white dark:bg-zinc-800 dark:text-white" tipo="bar" data={barDatas} titulo="sitios por tipo de sitio" />

      <GraficaBase className="bg-white dark:bg-zinc-800 dark:text-white" tipo="pie" data={pieData} titulo="Distribución de estado" />
    </div>
  );
};

export default SitioEstadisticas;

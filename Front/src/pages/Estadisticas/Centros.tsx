import { Chart, registerables } from "chart.js";
import { useCentro } from "../../hooks/Centros/useCentros";
import GraficaBase from "@/components/graficasBase/graficas";
import { useMunicipio } from "@/hooks/Municipio/useMunicipio";
Chart.register(...registerables);

const CentrosEstadisticas = () => {
  const { centros, isLoading } = useCentro();
  const {  municipios, isLoading : loadin} = useMunicipio();

  if (isLoading) return <p>Cargando...</p>;
  if (loadin) return <p>Cargando Municipios...</p>;
  if (!centros || centros.length === 0) return <p>No hay datos de Centros.</p>;


  const conteoPorMunicipio: Record<string, number> = {}; 
  const conteoPorMes: number[] = new Array(12).fill(0); 
  const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  let activos = 0; // Contador de centros activas

  centros.forEach((centro) => {
    const municipio = municipios?.find(m => m.id_municipio === centro.fk_municipio);
    const municiNombre = municipio?.nombre || "Desconocido";
  
    conteoPorMunicipio[municiNombre] = (conteoPorMunicipio[municiNombre] || 0) + 1;
  
    const mes = new Date(centro.created_at).getMonth();
    conteoPorMes[mes]++;
  
    if (centro.estado) activos++;
  });
  
  const inactivos = centros.length - activos;
  
  // Aquí generas las labels y los valores para la gráfica
  const barData = {
    labels: Object.keys(conteoPorMunicipio), 
    datasets: [
      {
        label: "Centros por Municipios",
        data: Object.values(conteoPorMunicipio),
        backgroundColor: "#60a5fa",
      },
    ],
  };

  const lineData = {
    labels: meses, 
    datasets: [
      {
        label: "Centros creados por mes",
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
        data: [activos, inactivos], 
        backgroundColor: ["#4ade80", "#f87171"], 
      },
    ],
  };

  //esto para que muestre enteros en y
  const lineOptions = {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          precision: 0, 
        },
      },
    },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3">
      <GraficaBase className="bg-white dark:bg-zinc-800 dark:text-white" tipo="bar" options={lineOptions}  data={barData} titulo="Centros por Municipios" />
      <GraficaBase className="bg-white dark:bg-zinc-800 dark:text-white" tipo="line" options={lineOptions} data={lineData} titulo="Centros creados por mes" />
      <GraficaBase className="bg-white dark:bg-zinc-800 dark:text-white" tipo ="pie" data={pieData} titulo="Distribución de estado" />
    </div>
  );
};

export default CentrosEstadisticas;

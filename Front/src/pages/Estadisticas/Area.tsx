import { Chart, registerables } from "chart.js";
import { useAreas } from "../../hooks/areas/useAreas";
import GraficaBase from "@/components/graficasBase/graficas";
import { useSede } from "@/hooks/sedes/useSedes";

Chart.register(...registerables);

const AreaEstadisticas = () => {
  const { areas, isLoading } = useAreas();
  const {sede}=useSede();

  if (isLoading) return <p>Cargando...</p>;
  if (!areas || areas.length === 0) return <p>No hay datos de áreas.</p>;


  const conteoPorSede: Record<string, number> = {}; 
  const conteoPorMes: number[] = new Array(12).fill(0); 
  const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  let activas = 0; // Contador de áreas activas

  areas.forEach((area) => {
    const sedeEncontrada = sede?.find((s) => s.id_sede === area.fk_sede);
    const sedeNombre = sedeEncontrada ? sedeEncontrada.nombre : `Sede ${area.fk_sede}`;
  
    conteoPorSede[sedeNombre] = (conteoPorSede[sedeNombre] || 0) + 1;
  
    const mes = new Date(area.created_at).getMonth();
    conteoPorMes[mes]++;
  
    if (area.estado) activas++;
});

  const inactivas = areas.length - activas; 


  const barData = {
    labels: Object.keys(conteoPorSede), 
    datasets: [
      {
        label: "Áreas por sede",
        data: Object.values(conteoPorSede), 
        backgroundColor: "#60a5fa", 
      },
    ],
  };

  const lineData = {
    labels: meses, 
    datasets: [
      {
        label: "Áreas creadas por mes",
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
      <GraficaBase className="bg-white dark:bg-zinc-800 dark:text-white" tipo="bar" data={barData} titulo="Áreas por sede" />
      <GraficaBase className="bg-white dark:bg-zinc-800 dark:text-white" tipo="line" data={lineData} titulo="Áreas creadas por mes" />
      <GraficaBase className="bg-white dark:bg-zinc-800 dark:text-white" tipo="pie" data={pieData} titulo="Distribución de estado" />
    </div>
  );
};

export default AreaEstadisticas;

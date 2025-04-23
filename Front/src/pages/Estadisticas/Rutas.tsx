import { Chart, registerables } from "chart.js";
import {  useRuta } from "../../hooks/Rutas/useRuta";
import GraficaBase from "@/components/graficasBase/graficas";
import { useModulo } from "@/hooks/Modulos/useModulo";
Chart.register(...registerables);

const RutasEstadisticas = () => {
  const { rutas, isLoading } = useRuta();
  const { modulos, isLoading : loadin} = useModulo();

  if (isLoading) return <p>Cargando...</p>;
  if (loadin) return <p>Cargando Modulos...</p>;
  if (!rutas || rutas.length === 0) return <p>No hay datos de Rutas.</p>;


  const conteoPorModulo: Record<string, number> = {}; 
  const conteoPorMes: number[] = new Array(12).fill(0); 
  const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  let activas = 0; // Contador de áreas activas

  rutas.forEach((ruta) => {
    const modulo = modulos?.find(r => r.id_modulo === ruta.fk_modulo);
    const moduloNombre = modulo?.nombre || "Desconocido";
  
    conteoPorModulo[moduloNombre] = (conteoPorModulo[moduloNombre] || 0) + 1;
  
    const mes = new Date(ruta.created_at).getMonth();
    conteoPorMes[mes]++;
  
    if (ruta.estado) activas++;
  });
  
  const inactivas = rutas.length - activas;
  
  // Aquí generas las labels y los valores para la gráfica
  const barData = {
    labels: Object.keys(conteoPorModulo), // ['Administrador', 'Usuario', ...]
    datasets: [
      {
        label: "Ruta por modulo",
        data: Object.values(conteoPorModulo), // [4, 7, ...]
        backgroundColor: "#60a5fa",
      },
    ],
  };

  const lineData = {
    labels: meses, 
    datasets: [
      {
        label: "Rutas creadas por mes",
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
      <GraficaBase className="bg-white dark:bg-zinc-800 dark:text-white" tipo="bar" data={barData} titulo="Rutas por modulos" />
      <GraficaBase className="bg-white dark:bg-zinc-800 dark:text-white" tipo="line" data={lineData} titulo="Rutas creadas por mes" />
      <GraficaBase className="bg-white dark:bg-zinc-800 dark:text-white" tipo="pie" data={pieData} titulo="Distribución de estado" />
    </div>
  );
};

export default RutasEstadisticas;

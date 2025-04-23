import { Chart, registerables } from "chart.js";
import GraficaBase from "@/components/graficasBase/graficas";

Chart.register(...registerables);

export const ElementoEstadisticas = () => {
    const barData = {
        labels: Object.keys(""), 
        datasets: [
          {
            label: "Áreas por sede",
            data: Object.values(""), 
            backgroundColor: "#60a5fa", 
          },
        ],
      };
    
      const lineData = {
        labels: [], 
        datasets: [
          {
            label: "Áreas creadas por mes",
            data: "", 
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
            data: [], 
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
}
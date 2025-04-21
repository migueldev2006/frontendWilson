import GraficaBase from "@/components/graficasBase/graficas";
import { Chart, registerables } from "chart.js";
import { useFichas } from "../../hooks/fichas/useFichas";
import { ChartData } from "chart.js";  

Chart.register(...registerables);

const EstadisticasFichas = () => {
  const { fichas, isLoading } = useFichas();

  if (isLoading) return <p>Cargando...</p>;
  if (!fichas || fichas.length === 0) return <p>No hay datos de fichas.</p>;

  const mesesNombres = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  const conteoPorMes = new Array(12).fill(0);
  const conteoActivasPorMes = new Array(12).fill(0);
  const conteoInactivasPorMes = new Array(12).fill(0);
  const conteoPorPrograma: { [key: number]: number } = {};


  fichas.forEach((ficha) => {
    const fecha = new Date(ficha.created_at);
    const mes = fecha.getMonth();
    conteoPorMes[mes]++;
    if (ficha.estado) conteoActivasPorMes[mes]++;
    else conteoInactivasPorMes[mes]++;
    

    if (conteoPorPrograma[ficha.fk_programa]) {
      conteoPorPrograma[ficha.fk_programa]++;
    } else {
      conteoPorPrograma[ficha.fk_programa] = 1;
    }
  });


  const barData = {
    labels: mesesNombres,
    datasets: [
      {
        label: "Total de fichas",
        data: conteoPorMes,
        backgroundColor: "#34d399",
      },
    ],
  };


  const pieData = {
    labels: ["Activas", "Inactivas"],
    datasets: [
      {
        data: [
          fichas.filter((ficha) => ficha.estado).length,
          fichas.filter((ficha) => !ficha.estado).length,
        ],
        backgroundColor: ["#4ade80", "#f87171"],
      },
    ],
  };

  const lineData: ChartData<"line", any[], string> = {
    labels: mesesNombres,
    datasets: [
      {
        label: "Fichas activas",
        data: conteoActivasPorMes,
        borderColor: "#34d399",
        fill: false,
        tension: 0.4,
      },
      {
        label: "Fichas inactivas",
        data: conteoInactivasPorMes,
        borderColor: "#e11d48",
        fill: false,
        tension: 0.4,
      },
    ],
  };



  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3">
      <GraficaBase className="bg-white dark:bg-zinc-800 dark:text-white" tipo="bar" data={barData} titulo="Total de fichas por mes"/>
      <GraficaBase className="bg-white dark:bg-zinc-800 dark:text-white" tipo="pie" data={pieData} titulo="Distribución de estado de las fichas"/>
      <GraficaBase className="bg-white dark:bg-zinc-800 dark:text-white" tipo="line" data={lineData} titulo="Fichas activas vs inactivas por mes"/>
    </div>
  );
};

export default EstadisticasFichas;

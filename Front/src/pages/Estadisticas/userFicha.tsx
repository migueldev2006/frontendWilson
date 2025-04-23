import { Chart, registerables } from "chart.js";
import { useUsuarioFcihas } from "@/hooks/usersFichas/useUserFichas";
import GraficaBase from "@/components/graficasBase/graficas";

Chart.register(...registerables);

const UserFichaEstadisticas = () => {
  const { usersFcihas, isLoading } = useUsuarioFcihas();

  if (isLoading) return <p>Cargando...</p>;
  if (!usersFcihas || usersFcihas.length === 0) return <p>No hay asignaciones usuario-ficha.</p>;

  const conteoPorFicha: Record<string, number> = {}; // conteo de usuarios por ficha
  const conteoPorMes: number[] = new Array(12).fill(0); // conteo por mes de creación
  const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

  usersFcihas.forEach((registro) => {
    const ficha = `Ficha ${registro.fk_ficha}`;
    conteoPorFicha[ficha] = (conteoPorFicha[ficha] || 0) + 1;

    const mes = new Date(registro.created_at).getMonth();
    conteoPorMes[mes]++;
  });

  const totalAsignaciones = usersFcihas.length;

  const barData = {
    labels: Object.keys(conteoPorFicha),
    datasets: [
      {
        label: "Usuarios por ficha",
        data: Object.values(conteoPorFicha),
        backgroundColor: "#60a5fa",
      },
    ],
  };

  const lineData = {
    labels: meses,
    datasets: [
      {
        label: "Asignaciones por mes",
        data: conteoPorMes,
        borderColor: "#34d399",
        backgroundColor: "#bbf7d0",
        fill: true,
      },
    ],
  };

  const pieData = {
    labels: ["Total de asignaciones"],
    datasets: [
      {
        data: [totalAsignaciones],
        backgroundColor: ["#4ade80"],
      },
    ],
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3">
      <GraficaBase
        className="bg-white dark:bg-zinc-800 dark:text-white"
        tipo="bar"
        data={barData}
        titulo="Usuarios por ficha"
      />
      <GraficaBase
        className="bg-white dark:bg-zinc-800 dark:text-white"
        tipo="line"
        data={lineData}
        titulo="Asignaciones por mes"
      />
      <GraficaBase
        className="bg-white dark:bg-zinc-800 dark:text-white"
        tipo="pie"
        data={pieData}
        titulo="Total de asignaciones"
      />
    </div>
  );
};

export default UserFichaEstadisticas;

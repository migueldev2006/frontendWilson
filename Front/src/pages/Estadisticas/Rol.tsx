import { Chart, registerables } from "chart.js";
import { useRol } from "@/hooks/Roles/useRol";
import GraficaBase from "@/components/graficasBase/graficas";

Chart.register(...registerables);

export const RolesEstadisticas = () => {
  const { roles, isLoading } = useRol();

  if (isLoading) return <p>Cargando...</p>;
  if (!roles || roles.length === 0) return <p>No hay datos de roles.</p>;

  const conteoPorRol: Record<string, number> = {};
  const estadoConteo: Record<string, number> = { Activo: 0, Inactivo: 0 };
  const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  const conteoPorMes = new Array(12).fill(0);

  roles.forEach((rol) => {
    conteoPorRol[rol.nombre] = (conteoPorRol[rol.nombre] || 0) + 1;
    const estado = rol.estado ? "Activo" : "Inactivo";
    estadoConteo[estado]++;

    const mes = new Date(rol.created_at).getMonth();
    conteoPorMes[mes]++;
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-3">
      <GraficaBase className="dark:bg-zinc-800 dark:text-white" tipo="bar" titulo="Roles por nombre" data={{
        labels: Object.keys(conteoPorRol),
        datasets: [{
          label: "Cantidad de usuarios",
          data: Object.values(conteoPorRol),
          backgroundColor: "#60a5fa",
        }]
      }} />

      <GraficaBase className="dark:bg-zinc-800 dark:text-white" tipo="pie" titulo="Distribución de roles activos/inactivos" data={{
        labels: ["Activos", "Inactivos"],
        datasets: [{
          data: [estadoConteo.Activo, estadoConteo.Inactivo],
          backgroundColor: ["#4ade80", "#f87171"],
        }]
      }} /> 

      <GraficaBase className="dark:bg-zinc-800 dark:text-white" tipo="line" titulo="Roles creados por mes" data={{
        labels: meses,
        datasets: [{
          label: "Roles",
          data: conteoPorMes,
          borderColor: "#34d399",
          backgroundColor: "#bbf7d0",
          fill: true,
        }]
      }} />
    </div>
  );
};
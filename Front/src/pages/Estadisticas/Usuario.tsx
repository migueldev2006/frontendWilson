import { Chart, registerables } from "chart.js";
import { useUsuario } from "../../hooks/Usuarios/useUsuario";
import GraficaBase from "@/components/graficasBase/graficas";
import { useRol } from "@/hooks/Roles/useRol";
Chart.register(...registerables);

const UsuariosEstadisticas = () => {
  const { users, isLoading } = useUsuario();
  const { roles, isLoading: loadin } = useRol();

  if (isLoading) return <p>Cargando...</p>;
  if (loadin) return <p>Cargando roles...</p>;
  if (!users || users.length === 0) return <p>No hay datos de usuarios.</p>;


  const conteoPorRol: Record<string, number> = {};
  const conteoPorMes: number[] = new Array(12).fill(0);
  const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  let activas = 0;

  users.forEach((usuario) => {
    const rol = roles?.find(r => r.id_rol === usuario.fk_rol);
    const rolNombre = rol?.nombre || "Desconocido";

    conteoPorRol[rolNombre] = (conteoPorRol[rolNombre] || 0) + 1;

    const mes = new Date(usuario.created_at).getMonth();
    conteoPorMes[mes]++;

    if (usuario.estado) activas++;
  });

  const inactivas = users.length - activas;

  // Aquí generas las labels y los valores para la gráfica
  const barData = {
    labels: Object.keys(conteoPorRol), // ['Administrador', 'Usuario', ...]
    datasets: [
      {
        label: "Usuarios por rol",
        data: Object.values(conteoPorRol),
        backgroundColor: "#60a5fa",
      },
    ],
  };

  const lineData = {
    labels: meses,
    datasets: [
      {
        label: "Usuarios creados por mes",
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
        data: [activas, inactivas],
        backgroundColor: ["#4ade80", "#f87171"],
      },
    ],
  };



  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3">
      <GraficaBase className="bg-white dark:bg-zinc-800 dark:text-white" tipo="bar" data={barData} titulo="Usuarios por rol" />
      <GraficaBase className="bg-white dark:bg-zinc-800 dark:text-white" tipo="line" data={lineData} titulo="Usuarios creados por mes" />
      <GraficaBase className="bg-white dark:bg-zinc-800 dark:text-white" tipo="pie" data={pieData} titulo="Distribución de estado" />
    </div>
  );
};

export default UsuariosEstadisticas;







































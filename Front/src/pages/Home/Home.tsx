import { useElemento } from "@/hooks/Elementos/useElemento";
import { useMovimiento } from "@/hooks/Movimientos/useMovimiento";
import { useVerificacion } from "@/hooks/Verificaciones/useVerificacion";
import { Card } from "@heroui/react";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);
const Dashboard = () => {
  const { elementos: elementos = [] } = useElemento();
  const { movimientos: movimientos = [] } = useMovimiento();
  const { verificaciones: verificaciones = [] } = useVerificacion();

  const movimientosPendientes = movimientos.filter(
    (m: any) => m.en_proceso && !m.aceptado && !m.cancelado
  );

  const estadisticas = {
    labels: ["Pendientes", "Aceptados", "Cancelados"],
    datasets: [
      {
        label: "Movimientos",
        data: [
          movimientos.filter(
            (m: any) => m.en_proceso && !m.aceptado && !m.cancelado
          ).length,
          movimientos.filter((m: any) => m.aceptado).length,
          movimientos.filter((m: any) => m.cancelado).length,
        ],
        backgroundColor: ["#facc15", "#4ade80", "#f87171"],
        borderRadius: 8,
      },
    ],
  };

  const ultimosMovimientos = [...movimientos]
    .sort(
      (a: any, b: any) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    .slice(0, 5);

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-blue-100 dark:bg-zinc-800 dark:text-white">
            <p className="text-sm text-blue-700">Total de Elementos</p>
            <p className="text-2xl font-bold text-blue-900">
              {elementos.length}
            </p>
        </Card>
        <Card className="bg-yellow-100 dark:bg-zinc-800 dark:text-white">
            <p className="text-sm text-yellow-700">Movimientos Pendientes</p>
            <p className="text-2xl font-bold text-yellow-900">
              {movimientosPendientes.length}
            </p>
        </Card>
        <Card className="bg-green-100 dark:bg-zinc-800 dark:text-white">
            <p className="text-sm text-green-700">Verificaciones Realizadas</p>
            <p className="text-2xl font-bold text-green-900">
              {verificaciones.length}
            </p>
        </Card>
      </div>

      <div className="bg-white p-4 rounded-xl shadow dark:bg-zinc-800 dark:text-white">
        <h2 className="text-lg font-semibold mb-4">Movimientos por Estado</h2>
        <div className="w-full h-72">
          <Bar
            data={estadisticas}
            options={{
              responsive: true,
              plugins: { legend: { display: false } },
            }}
          />
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow dark:bg-zinc-800 dark:text-white">
        <h2 className="text-lg font-semibold mb-4">Últimos Movimientos</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead>
              <tr className="text-gray-600 dark:bg-zinc-800 dark:text-white">
                <th className="py-2 px-4">ID</th>
                <th className="py-2 px-4">Descripción</th>
                <th className="py-2 px-4">Fecha</th>
                <th className="py-2 px-4">Estado</th>
              </tr>
            </thead>
            <tbody>
              {ultimosMovimientos.map((mov: any) => (
                <tr key={mov.id_movimiento} className="">
                  <td className="py-2 px-4">{mov.id_movimiento}</td>
                  <td className="py-2 px-4">{mov.descripcion}</td>
                  <td className="py-2 px-4">
                    {new Date(mov.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4">
                    {mov.aceptado
                      ? "Aceptado"
                      : mov.cancelado
                        ? "Cancelado"
                        : mov.en_proceso
                          ? "Pendiente"
                          : "Desconocido"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

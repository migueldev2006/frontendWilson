import { useEffect, useState } from "react"
import { fetchEntidad } from "../../utils/fetchData"
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement,
  RadialLinearScale, Tooltip, Legend
} from "chart.js"
import { Bar, Line, Pie, Doughnut, Radar, PolarArea } from "react-chartjs-2"

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, RadialLinearScale, Tooltip, Legend)

const entidades = ["Fichas", "Areas", "p.formacion", "Sede","permisos","rol_modulo","sitios","usersFichas","elemento","verificacion","unidad", "tipoMovimiento", "inventario","solicitud","rol","movimiento"]

export const EstadisticasGlobal = () => {
  const [datos, setDatos] = useState<any[]>([])
  const [tipoGrafica, setTipoGrafica] = useState("bar")
  const [modo, setModo] = useState("fecha") // fecha o mes

  useEffect(() => {
    Promise.all(entidades.map(async entidad => {
      try {
        const data = await fetchEntidad(entidad)
        return data.map((item: any) => ({
          fecha: new Date(item.created_at).toISOString().split("T")[0],
          mes: new Date(item.created_at).toISOString().slice(0, 7),
          nombre: entidad
        }))
      } catch {
        return []
      }
    })).then(resultados => setDatos(resultados.flat()))
  }, [])

  const labels = [...new Set(datos.map(d => modo === "mes" ? d.mes : d.fecha))].sort()
  const color = () => `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0")}`

  const datasets = entidades.map(nombre => {
    const c = color()
    return {
      label: nombre,
      data: labels.map(label => datos.filter(d => (modo === "mes" ? d.mes : d.fecha) === label && d.nombre === nombre).length),
      backgroundColor: `${c}90`,
      borderColor: c,
      borderWidth: 2,
      tension: 0.4,
      fill: false,
      pointBackgroundColor: c,
    }
  })

  const chartData = { labels, datasets }
  const simpleData = {
    labels: entidades,
    datasets: [{
      label: "Totales por entidad",
      data: entidades.map(ent => datos.filter(d => d.nombre === ent).length),
      backgroundColor: entidades.map(() => `${color()}90`),
      borderColor: entidades.map(() => color()),
      borderWidth: 1,
    }]
  }

  const opciones: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      tooltip: {
        mode: 'nearest',
        intersect: false,
        callbacks: {
          label: function (context: any) {
            return `${context.dataset.label}: ${context.formattedValue}`
          }
        }
      }
    },
    interaction: { mode: 'nearest', axis: 'x', intersect: false },
    elements: { line: { borderWidth: 2 }, point: { radius: 4 } },
    scales: {
      x: { title: { display: true, text: modo === "mes" ? 'Mes' : 'Fecha de creación' } },
      y: { beginAtZero: true, title: { display: true, text: 'Total' } }
    }
  }

  const chartClass = "h-[400px] w-full max-w-full overflow-auto"
  const graficas: Record<string, JSX.Element> = {
    bar: <Bar data={chartData} options={opciones} />, 
    line: <Line data={chartData} options={opciones} />, 
    pie: <Pie data={simpleData} options={opciones} />,
    doughnut: <Doughnut data={simpleData} options={opciones} />, 
    radar: <Radar data={simpleData} options={opciones} />, 
    polar: <PolarArea data={simpleData} options={opciones} />
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center gap-4">
        <select value={modo} onChange={(e) => setModo(e.target.value)} className="p-2 border rounded-md bg-white text-black">
          <option value="fecha">Estadísticas por fecha</option>
          <option value="mes">Estadísticas por mes</option>
        </select>

        <select value={tipoGrafica} onChange={(e) => setTipoGrafica(e.target.value)} className="p-2 border rounded-md bg-white text-black">
          <option value="bar">Barras</option>
          <option value="line">Línea</option>
          <option value="pie">Torta</option>
          <option value="doughnut">Doughnut</option>
          <option value="radar">Radar</option>
          <option value="polar">Polar Area</option>
        </select>
      </div>

      <div className={chartClass}>{graficas[tipoGrafica] || graficas.bar}</div>
    </div>
  )
} 

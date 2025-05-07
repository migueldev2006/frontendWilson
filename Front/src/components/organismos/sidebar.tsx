import { useState } from "react";
import {
  HomeIcon,
  UserIcon,
  Cog6ToothIcon,
  CubeIcon,
  EnvelopeIcon,
  ClipboardDocumentCheckIcon,
  DocumentChartBarIcon,
  ChartBarIcon,
  Bars3Icon,
  UserCircleIcon,
  BuildingOffice2Icon,
  BuildingOfficeIcon,
  DocumentCheckIcon,
  DocumentTextIcon,
  TagIcon,
  RectangleGroupIcon,
  UsersIcon,
  RocketLaunchIcon,
  HomeModernIcon,
  DocumentIcon,
  AcademicCapIcon,
  BuildingLibraryIcon,
  GlobeAmericasIcon,
  ClipboardDocumentListIcon,
  RectangleStackIcon,
  ArrowsRightLeftIcon,
  ArrowPathRoundedSquareIcon,
  StopIcon,
  InboxIcon,
} from "@heroicons/react/24/outline";

const menuItems = [
  { name: "Inicio", icon: HomeIcon, href: "/home" },
  {
    name: "Admin",
    icon: UserIcon,
    href: "#",
    children: [
      { name: "Usuarios", icon: UserCircleIcon, href: "/usuarios" },
      { name: "Tipos Sitios", icon: BuildingOffice2Icon, href: "/tiposSitios" },
      { name: "Sitios", icon: BuildingOfficeIcon, href: "/sitios" },
      { name: "Municipios", icon: HomeModernIcon, href: "/municipios" },
      { name: "Centros", icon: AcademicCapIcon, href: "/centros" },
      { name: "Sedes", icon: BuildingLibraryIcon, href: "/sedes" },
      { name: "Areas", icon: GlobeAmericasIcon, href: "/areas" },
      { name: "Programas Formacion", icon: DocumentIcon, href: "/programas" },
      { name: "Fichas", icon: TagIcon, href: "/fichas" },
      { name: "Usuario Ficha", icon: UserCircleIcon, href: "/usuarioFicha" },
      { name: "Roles", icon: UsersIcon, href: "/roles" },
      { name: "Rol Modulo", icon: DocumentCheckIcon, href: "/rolModulo" },
      { name: "Permisos", icon: DocumentTextIcon, href: "/permisos" },
      { name: "Modulos", icon: RectangleGroupIcon, href: "/modulos" },
      { name: "Rutas", icon: RocketLaunchIcon, href: "/rutas" }
    ],
  },

  {
    name: "Bodega",
    icon: InboxIcon,
    href: "#",
    children: [
      { name: "Elementos", icon: CubeIcon, href: "/elementos" },
      { name: "Tipo Movimientos", icon: ArrowPathRoundedSquareIcon, href: "/tipos" },
      { name: "Unidades Medida", icon: StopIcon, href: "/unidades" },
      { name: "Categorias", icon: RectangleStackIcon, href: "/categorias" },
      { name: "Movimientos", icon: ArrowsRightLeftIcon, href: "/movimientos" },
      { name: "Inventario", icon: ClipboardDocumentListIcon, href: "/inventario" }
    ],
  },
  { name: "Solicitudes", icon: EnvelopeIcon, href: "/solicitudes" },
  {
    name: "Reportes",
    icon: DocumentChartBarIcon,
    href: "#",
    children: [
      { name: "Usuarios", icon: UserCircleIcon, href: "/reportes/usuarios" },
      { name: "Sitios", icon: BuildingOfficeIcon, href: "/sitios" },
      { name: "Municipios", icon: HomeModernIcon, href: "/reportes/municipios" },
      { name: "Centros", icon: AcademicCapIcon, href: "/reportes/centros" },
      { name: "Sedes", icon: BuildingLibraryIcon, href: "/sedes" },
      { name: "Areas", icon: GlobeAmericasIcon, href: "/areas" },
      { name: "Programas Formacion", icon: DocumentIcon, href: "/programas" },
      { name: "Fichas", icon: TagIcon, href: "/fichas" },
      { name: "Usuario Ficha", icon: UserCircleIcon, href: "/usuarioFicha" },
      { name: "Roles", icon: UsersIcon, href: "/roles" },
      { name: "Rol Modulo", icon: DocumentCheckIcon, href: "/rolModulo" },
      { name: "Permisos", icon: DocumentTextIcon, href: "/permisos" },
      { name: "Modulos", icon: RectangleGroupIcon, href: "/reportes/modulos" },
      { name: "Elementos", icon: CubeIcon, href: "/elementos" },
      { name: "Tipo Movimientos", icon: ArrowPathRoundedSquareIcon, href: "/tipos" },
      { name: "Unidades Medida", icon: StopIcon, href: "/unidades" },
      { name: "Categorias", icon: RectangleStackIcon, href: "/reportes/categorias" },
      { name: "Movimientos", icon: ArrowsRightLeftIcon, href: "/movimientos" },
      { name: "Inventario", icon: ClipboardDocumentListIcon, href: "/inventtario" },
      { name: "Solicitudes", icon: ClipboardDocumentListIcon, href: "/solicitudes" },
      { name: "Verificaciones", icon: ClipboardDocumentCheckIcon, href: "/verificaciones" }
    ],
  },
  {
    name: "Estadísticas",
    icon: ChartBarIcon,
    href: "#",
    children: [
      { name: "Usuarios", icon: UserCircleIcon, href: "/estadisticas/usuarios" },
      { name: "Elementos mas usados", icon: ArrowsRightLeftIcon, href: "/movimientos/estadistica" },
      { name: "Elementos indice de uso", icon: ArrowsRightLeftIcon, href: "elementos/estadistica" },
      { name: "Movimientos por mes", icon: ArrowsRightLeftIcon, href: "/movimientos/mes/estadistica" },
      { name: "Stock por area", icon: ClipboardDocumentListIcon, href: "/inventario/estadistica" }
    ],
  },
  {
    name: "Verificaciones",
    icon: ClipboardDocumentCheckIcon,
    href: "/verificaciones",
  },
  {
    name: "Configuración",
    icon: Cog6ToothIcon,
    href: "/datos",
    children: [{ name: "f", icon: "", href: "" }],
  },
];

export default function Sidebar() {
  const [openItems, setOpenItems] = useState<string[]>([]);
  const [collapsed, setCollapsed] = useState(false);

  const toggleItem = (name: string) => {
    setOpenItems((prev) =>
      prev.includes(name)
        ? prev.filter((item) => item !== name)
        : [...prev, name]
    );
  };

  return (
    <aside
      className={`h-screen ${
        collapsed ? "w-15" : "w-64"
      } bg-blue-950 text-white dark:bg-zinc-800 dark:text-white flex flex-col transition-all duration-300`}
    >
      <div className="flex items-center justify-between p-4">
        {!collapsed && (
          <h1 className="text-xl font-bold flex items-center">
            <img className="w-12" src="/src/assets/Formatrack.png" alt="Formatrack" />
            Formatrack
          </h1>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="bg-blue-950 text-white dark:bg-zinc-800 dark:text-white"
        >
            <Bars3Icon className="w-5 h-5" />
        </button>
      </div>
      <nav className="space-y-2 px-1 flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden scrollbar-thin scrollbar-track-transparent scrollbar-thumb-transparent">
        {menuItems.map((item) => (
          <div key={item.name}>
            <a
              href={item.href}
              onClick={() => toggleItem(item.name)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg w-full text-left transition-colors ${
                openItems.includes(item.name)
                  ? "bg-black-700 hover:bg-blue-600 " 
                  : "hover:bg-blue-600 text-black-300 text-black-400"
              }`}
            >
              <item.icon className="w-6 h-6" />
              {!collapsed && <span>{item.name}</span>}
            </a>

            {item.children && openItems.includes(item.name) && !collapsed && (
              <div className="ml-8 mt-1 space-y-1">
                {item.children.map((subItem) => (
                  <a
                    key={subItem.name}
                    href={subItem.href}
                    className="flex items-center gap-2 px-2 py-1 text-sm text-white text-black-400 hover:tex-white hover:bg-blue-600 rounded"
                  >
                    {subItem.icon && typeof subItem.icon !== "string" && (
                      <subItem.icon className="w-4 h-4" />
                    )}
                    <span>{subItem.name}</span>
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}

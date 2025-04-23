import { useState } from "react";
import { Link } from "react-router-dom";
import {
  HomeIcon,
  UserIcon,
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
  { name: "Inicio", icon: HomeIcon, href: "/" },
  {
    name: "Admin",
    icon: UserIcon,
    href: "/usuarios",
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
      { name: "Roles", icon: UsersIcon, href: "/roles" },
      { name: "Permisos", icon: DocumentTextIcon, href: "/permisos" },
      { name: "Modulos", icon: RectangleGroupIcon, href: "/modulos" },
      { name: "Rutas", icon: RocketLaunchIcon, href: "/rutas" },
    ],
  },

  {
    name: "Bodega",
    icon: InboxIcon,
    href: "/bodega/elementos",
    children: [
      { name: "Elementos", icon: CubeIcon, href: "/bodega/elementos" },
      {
        name: "Tipo Movimientos",
        icon: ArrowPathRoundedSquareIcon,
        href: "/bodega/tipos",
      },
      { name: "Unidades Medida", icon: StopIcon, href: "/bodega/unidades" },
      { name: "Categorias", icon: RectangleStackIcon, href: "/bodega/categorias" },
      { name: "Caracteristicas", icon: RectangleStackIcon, href: "/bodega/caracteristicas" },
      { name: "Movimientos", icon: ArrowsRightLeftIcon, href: "/bodega/movimientos" },
      {
        name: "Inventario",
        icon: ClipboardDocumentListIcon,
        href: "/bodega/inventario/areas",
      },
    ],
  },
  { name: "Solicitudes", icon: EnvelopeIcon, href: "/solicitudes" },
  {
    name: "Reportes",
    icon: DocumentChartBarIcon,
    href: "/reportes/usuarios",
    children: [
      { name: "Usuarios", icon: UserCircleIcon, href: "/reportes/usuarios" },
      { name: "Usuarios Fichas", icon: UserCircleIcon, href: "/reportes/usuariosFichas" },
      { name: "Municipios", icon: HomeModernIcon, href: "/reportes/municipios" },
      { name: "Centros", icon: AcademicCapIcon, href: "/reportes/centros" },
      { name: "Areas", icon: GlobeAmericasIcon, href: "/reportes/areas" },
      { name: "Sedes", icon: GlobeAmericasIcon, href: "/reportes/sedes" },
      { name: "Sitios", icon: GlobeAmericasIcon, href: "/reportes/areas" },
      { name: "Fichas", icon: TagIcon, href: "/reportes/fichas" },      
      { name: "Programas Formacion", icon: TagIcon, href: "/reportes/programas" },      
      { name: "Roles", icon: UsersIcon, href: "/reportes/roles" },
      { name: "Rol Modulo", icon: DocumentCheckIcon, href: "/reportes/rolModulo" },
      { name: "Modulos", icon: RectangleGroupIcon, href: "/reportes/modulos" },
      { name: "Elementos", icon: CubeIcon, href: "/reportes/elementos" },
      { name: "Categorias", icon: RectangleStackIcon, href: "/reportes/categorias" },
      { name: "Movimientos", icon: ArrowsRightLeftIcon, href: "/reportes/movimientos" },
      { name: "Inventario", icon: ClipboardDocumentListIcon, href: "/reportes/inventario" },
      { name: "Solicitudes", icon: ClipboardDocumentListIcon, href: "/reportes/solicitudes" },
      { name: "Verificaciones", icon: ClipboardDocumentCheckIcon, href: "/reportes/verificaciones" }
    ],
  },
  {
    name: "Estadísticas",
    icon: ChartBarIcon,
    href: "/estadisticas/usuarios",
    children: [
      { name: "Usuarios", icon: UserCircleIcon, href: "/estadisticas/usuarios" },
      { name: "Usuarios Ficha", icon: UserCircleIcon, href: "/estadisticas/usuariosFicha" },
      { name: "Centros", icon: UserCircleIcon, href: "/estadisticas/centros" },
      { name: "Tipos Sitios", icon: BuildingOffice2Icon, href: "/estadisticas/tiposSitios" },
      { name: "Sitios", icon: BuildingOfficeIcon, href: "/estadisticas/sitios" },
      { name: "Municipios", icon: HomeModernIcon, href: "/estadisticas/municipios" },
      { name: "Sedes", icon: BuildingLibraryIcon, href: "/estadisticas/sedes" },
      { name: "Areas", icon: GlobeAmericasIcon, href: "/estadisticas/areas" },
      { name: "Programas Formacion", icon: DocumentIcon, href: "/estadisticas/programas" },
      { name: "Fichas", icon: TagIcon, href: "/estadisticas/fichas" },
      { name: "Roles", icon: UsersIcon, href: "/estadisticas/roles" },
      { name: "Rol Modulo", icon: DocumentCheckIcon, href: "/estadisticas/rolModulo" },
      { name: "Permisos", icon: DocumentTextIcon, href: "/estadisticas/permisos" },
      { name: "Modulos", icon: RectangleGroupIcon, href: "/estadisticas/modulos" },
      { name: "Rutas", icon: RocketLaunchIcon, href: "/estadisticas/rutas" },
      { name: "Elementos", icon: CubeIcon, href: "/estadisticas/elementos" },
      { name: "Tipo Movimientos", icon: ArrowPathRoundedSquareIcon, href: "/estadisticas/tipos" },
      { name: "Unidades Medida", icon: StopIcon, href: "/estadisticas/unidades" },
      { name: "Categorias", icon: RectangleStackIcon, href: "/estadisticas/categorias" },
      { name: "Caracteristicas", icon: RectangleStackIcon, href: "/estadisticas/caracteristicas" },
      { name: "Movimientos", icon: ArrowsRightLeftIcon, href: "/estadisticas/movimientos" },
      { name: "Inventario", icon: ClipboardDocumentListIcon, href: "/estadisticas/inventario" },
      { name: "Solicitudes", icon: ClipboardDocumentListIcon, href: "/estadisticas/solicitudes" },
      { name: "Verificaciones", icon: ClipboardDocumentCheckIcon, href: "/estadisticas/verificaciones" }
    ],
  },
  {
    name: "Verificaciones",
    icon: ClipboardDocumentCheckIcon,
    href: "/verificaciones",
  },
];

export default function Sidebar() {
  const [openItems, setOpenItems] = useState<string[]>([]);
  const [collapsed, setCollapsed] = useState(false);

  const toggleItem = (name: string) => {
    setOpenItems((prev) =>
      prev.includes(name) ? [] : [name]
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
            <img
              className="w-12"
              src="/src/assets/Formatrack.png"
              alt="Formatrack"
            />
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
            {item.children ? (
              <button
                onClick={() => toggleItem(item.name)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg w-full text-left transition-colors ${
                  openItems.includes(item.name)
                    ? "bg-black-700 hover:bg-blue-600"
                    : "hover:bg-blue-600 text-black-300 text-black-400"
                }`}
              >
                <item.icon className="w-6 h-6" />
                {!collapsed && <span>{item.name}</span>}
              </button>
            ) : (
              <Link
                to={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg w-full text-left transition-colors hover:bg-blue-600`}
              >
                <item.icon className="w-6 h-6" />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            )}

            {item.children && openItems.includes(item.name) && !collapsed && (
              <div className="ml-8 mt-1 space-y-1">
                {item.children.map((subItem) => (
                  <Link
                    key={subItem.name}
                    to={subItem.href}
                    className="flex items-center gap-2 px-2 py-1 text-sm text-white hover:bg-blue-600 rounded"
                  >
                    {subItem.icon && typeof subItem.icon !== "string" && (
                      <subItem.icon className="w-4 h-4" />
                    )}
                    <span>{subItem.name}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}

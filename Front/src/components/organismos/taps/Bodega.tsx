import Tap from "@/components/molecules/Tabs";
import { ElementosTable } from "@/pages/Bodega/Elementos";
import { InventariosTable } from "@/pages/Bodega/Inventarios";
import { MovimientoTable } from "@/pages/Bodega/Movimientos";
import { TipoMovimientoTable } from "@/pages/Bodega/TiposMovimiento";

export const Bodega =() => {

        const tabs = [
            {
                key : "1",
                title : "Elementos",
                content : <ElementosTable/>
            },
            {
                key : "2",
                title : "Tipos Movimiento",
                content : <TipoMovimientoTable/>
            },
            {
                key : "3",
                title : "Inventarios",
                content : <InventariosTable/>
            },
            {
                key : "4",
                title : "Movimientos",
                content :<MovimientoTable/>
            }
        ]

  return (
        
        <Tap tabs={tabs}></Tap>
  )
}


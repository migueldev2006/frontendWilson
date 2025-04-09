import Tap from "@/components/molecules/Tabs";
import { Configuracion } from "@/pages/Configuraciones/Configuracion";

export const Configuraciones =() => {

        const tabs = [
            {
                key : "1",
                title : "Datos personales",
                content : <Configuracion/>
            },
        ]
  return (
        
        <Tap tabs={tabs}></Tap>
  )
}


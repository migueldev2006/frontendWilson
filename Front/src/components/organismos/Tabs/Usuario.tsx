import Tap from "@/components/molecules/Tabs"
import { RolTable } from "@/pages/Admin/Roles"

export const Usuario = () => {
    const tabs = [
        {
            key : "1",
            title : "Elementos",
            content : <RolTable/>
        },
    ]
    return (
        
        <Tap tabs={tabs}></Tap>
  )
}
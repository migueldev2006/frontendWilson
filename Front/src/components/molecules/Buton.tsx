import { Button } from "@heroui/button";


type propsBut = {
    text?: string,
    type :"button" | "submit" | "reset" | undefined,
    className?: string,
    color? : "default" | "primary" | "secondary" | "success" | "warning" | "danger" | undefined,
    variant? : "solid" | "bordered" | "light" | "flat" | "faded" | "shadow" | "ghost" | undefined
    onPress?: () => void
}


export default function Buton({text,type,className,color,variant,onPress}:propsBut){
    return(
        <Button onPress={onPress} className={className} type={type} color={color} variant={variant}>
            {text}
        </Button>
    )
}




import {Input} from "@heroui/input";


type InputProps = {
    label: string,
    className?: string,
    placeholder?: string,
    type: string
    isRequired?: boolean
    labelPlacement?: "outside" | "outside-left" | "inside",
    name?: string
    value?: string | (readonly string[] & string) | undefined
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
export default function Inpu({label, placeholder, type, name, isRequired, labelPlacement, value, onChange}: InputProps) {  
  return (
    
      <Input aria-label={label} isRequired={isRequired} label={label} labelPlacement={labelPlacement} name={name} placeholder={placeholder} type={type} value={value} onChange={onChange}   />
    
  );
}
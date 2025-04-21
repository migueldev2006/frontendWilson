interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?:string
}

export function Button({ onClick, children,  }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className="bg-blue-700 text-white px-4 py-2 rounded-xl hover:bg-blue-700"
    >
      {children}
    </button>
  );
}
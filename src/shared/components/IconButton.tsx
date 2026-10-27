
export const IconButton = ({
    icon,
    color = "blue",
    size = "normal"
}: {
    icon: React.ReactNode;
    color?: string;
    size?: "sm" | "normal" | "lg" | "xl"
}) => {
    const buttonSize = {
        "sm": "2.5rem",
        "normal": "3.5rem",
        "lg": "4.5rem",
        "xl": "5.5rem"
    }
    const selectedSize = buttonSize[size] || buttonSize["normal"];
    const activeColor = color || "blue";

    return (
        <span 
            className={`bg-${activeColor}-100 text-${activeColor}-700 border-round-xl shadow-1 flex align-items-center justify-content-center text-2xl`}
            style={{ width: selectedSize, height: selectedSize, flexShrink: 0 }}
        >
            {icon}
        </span>
    )
}




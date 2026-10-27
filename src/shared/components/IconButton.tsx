
export const IconButton = ({
    icon,
    color,
    size = "normal"
}: {
    icon: React.ReactNode;
    color: string;
    size?: "sm"|"normal"
}) => {
    const buttonSize = {
        "sm": "2rem",
        "normal": "3rem"
    }
    return (
        <span className={`bg-${color}-200 text-${color}-900 w-${buttonSize[size]} h-${buttonSize[size]} border-round shadow-3 flex-center`}>
            {icon}
        </span>
    )
}




import { Card } from "primereact/card"
import { IconButton } from "../../shared/components/IconButton";

export const CardWithOneIndicator = ({
    icon = <i className="pi pi-prime text-2xl"></i>,
    value = "0",
    title = "Indicador",
    color = "green",
    comparator = "+10%",
    trendIcon = <i className="pi pi-arrow-up font-bold"></i>,
    trendSeverity = "green"
}: {
    icon: React.ReactNode;
    value: string;
    title: string;
    color: string;
    comparator: string;
    trendIcon: React.ReactNode;
    trendSeverity: string;
}) => {
    return (
        <Card className={`flex-1 border-bottom-3 border-${color}-200 hover:shadow-5`}>
            <div className="flex align-items-center gap-3 mb-2">
                <IconButton
                icon={icon}
                color={color}
                />
                <span className="text-3xl font-bold">
                    {value}
                </span>
            </div>
            <div>
                <span className="font-bold">
                    {title}
                </span>
            </div>
            <span className={`text-${trendSeverity}-500`}>
                {comparator}  {trendIcon}
            </span>
        </Card>
    )
}

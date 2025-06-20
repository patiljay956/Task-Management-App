import { Badge } from "@/components/ui/badge";

export function PriorityCell({ priority }: { priority: string }) {
    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "high":
                return "bg-red-500/20 text-red-500";
            case "medium":
                return "bg-yellow-500/20 text-yellow-600";
            case "low":
                return "bg-green-500/20 text-green-700";
            default:
                return "bg-gray-500/20 text-gray-500 ";
        }
    };

    const color = getPriorityColor(priority);

    return <Badge className={`${color}`}>{priority}</Badge>;
}

import { Card, CardContent } from "@/components/atoms/Card";

interface ReportCardProps {
  title: string;
  description?: string;
  onClick: () => void;
}

export const ReportCard = ({ title, onClick }: ReportCardProps) => (
  <Card
    className="rounded rounded-2xl cursor-pointer border border-blue-900 py-4"
    onClick={onClick}
  >
    <CardContent className="p-3">
      <h3 className="text-lg font-bold mt-3 text-center">{title}</h3>
    </CardContent>
  </Card>
);

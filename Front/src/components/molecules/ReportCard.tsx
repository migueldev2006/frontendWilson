import { Card, CardBody } from "@heroui/react";

interface ReportCardProps {
  title: string;
  description?: string;
  onClick: () => void;
}

export const ReportCard = ({ title, onClick }: ReportCardProps) => (
  <Card className="rounded rounded-2xl cursor-pointer border border-blue-900 py-4">
    <CardBody className="p-3" onClick={onClick}>
      <h3 className="text-lg font-bold mt-3 text-center">{title}</h3>
    </CardBody>
  </Card>
);

import { PDFViewer } from '@react-pdf/renderer';
import { ReportTemplate } from '@/components/templates/Report';

interface ReportViewerProps<T> {
  title: string;
  description: string;
  headers: string[];
  accessors: string[];
  data: T[];
}

export function ReportViewer<T>(props: ReportViewerProps<T>) {
  return (
    <div style={{ height: '90vh' }}>
      <PDFViewer width="100%" height="100%">
        <ReportTemplate {...props} />
      </PDFViewer>
    </div>
  );
}
import { PDFDownloadLink } from '@react-pdf/renderer';
import { ReportTemplate } from '@/components/templates/Report';

interface ReportActionsProps<T> {
  title: string;
  description: string;
  headers: string[];
  accessors: string[];
  data: T[];
}

export function ReportActions<T>(props: ReportActionsProps<T>) {
  return (
    <PDFDownloadLink
      document={<ReportTemplate {...props} />}
      fileName={`${props.title.replace(/\s+/g, '_')}.pdf`}
    >
      {({ loading }) => (
        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          {loading ? 'Generando...' : 'Descargar PDF'}
        </button>
      )}
    </PDFDownloadLink>
  );
}

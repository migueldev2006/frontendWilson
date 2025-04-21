import {
  Document,
  Page,
  Text,
  View,
  Image,
} from '@react-pdf/renderer';
import { reportStyles as styles } from '@/styles/pdf/reportStyles';

interface ReportTemplateProps<T> {
  title: string;
  description: string;
  headers: string[];
  accessors: string[];
  data: T[];
  footerText?: string;
}

export function ReportTemplate<T>({
  title,
  description,
  headers,
  accessors,
  data,
}: ReportTemplateProps<T>) {
  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        <View style={styles.header}>
        </View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>

        <View style={styles.tableHeader}>
          {headers.map((header, i) => (
            <Text style={styles.cell} key={i}>{header}</Text>
          ))}
        </View>
        {data.map((item, i) => (
          <View style={styles.tableRow} key={i}>
            {accessors.map((accessor, j) => (
              <Text style={styles.cell} key={j}>
                {/* @ts-ignore */}
                {item[accessor]}
              </Text>
            ))}
          </View>
        ))}
      </Page>
    </Document>
  );
}
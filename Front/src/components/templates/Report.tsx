import { Document, Page, Text, View } from "@react-pdf/renderer";
import { reportStyles as styles } from "@/styles/pdf/reportStyles";

interface ReportTemplateProps<T> {
  title: string;
  description: string;
  headers?: string[];
  accessors?: string[];
  data: T[];
  tableDescription?: string;
  footerText?: string;
}

export function ReportTemplate<T>({
  title,
  description,
  headers,
  accessors,
  data,
  tableDescription,
  footerText,
}: ReportTemplateProps<T>) {
  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        <View style={styles.header}></View>

        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>

        {headers && (
          <View style={styles.tableHeader}>
            {headers.map((header, i) => (
              <Text style={styles.cell} key={i}>
                {header}
              </Text>
            ))}
          </View>
        )}

        {data.map((item, i) => (
          <View style={styles.tableRow} key={i}>
            {accessors?.map((accessor, j) => (
              <Text style={styles.cell} key={j}>
                {/* @ts-ignore */}
                {item[accessor]}
              </Text>
            ))}
          </View>
        ))}

      
        {tableDescription && (
          <Text
            style={{
              fontSize: 11,
              textAlign: "justify",
              lineHeight: 2,
            }}
          >
            {tableDescription}
          </Text>
        )}

        {footerText && (
          <Text
            style={{
              marginTop: 25,
              fontSize: 11,
              color: "#444",
              marginBottom: 20,
              textAlign: "justify",
            }}
          >
            {footerText}
          </Text>
        )}
      </Page>
    </Document>
  );
}

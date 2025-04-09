import { useState } from "react";
import { pdf, Document, Page, Text } from "@react-pdf/renderer";
import { Worker, Viewer } from "@react-pdf-viewer/core"; // Worker=>utilizado para manejar los procesos en segundo plano como cargar el PDF, Viewer=>componente que muestra el PDF en la interfaz del usuario
import "@react-pdf-viewer/core/lib/styles/index.css"; //para la visualización del PDF

export default function VisualizarPdf() { 
    const [pdfUrl, setPdfUrl] = useState<string | null>(null); //pdfUrl => estado que almacena la url del PDF generado 

    const generarPdf = async () => {
        const doc = (
            <Document>
                <Page>
                    <Text>¡Hola! Este es un PDF generado en React.</Text>
                </Page>
            </Document>
        );
        const blob = await pdf(doc).toBlob(); //genera un objeto que represente el contenido binario del PDF 
        setPdfUrl(URL.createObjectURL(blob)); // convierte el blob en una URL que se puede usar para mostrar o descargar el PDF.
    };

    return (
        <div className="p-4 bg-white shadow-lg rounded-lg">
            <button onClick={generarPdf} className="bg-blue-500 text-white px-4 py-2 rounded">
                Generar PDF
            </button>
            {pdfUrl && (
                <div className="mt-4 border p-2">
                    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                        <Viewer fileUrl={pdfUrl} />   
                        {/* //El componente Viewer recibe la URL del PDF generado (fileUrl={pdfUrl}) y lo muestra en la interfaz de usuario.           */}
                    </Worker>
                    <a href={pdfUrl} download="documento.pdf" className="block mt-2 bg-green-500 text-white px-4 py-2 rounded text-center">
                        Descargar PDF
                    </a>
                </div>
            )}
        </div>
    );
}

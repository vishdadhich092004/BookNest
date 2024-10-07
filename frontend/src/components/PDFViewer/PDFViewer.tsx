import { useState, useEffect } from "react";
import {
  Viewer,
  Worker,
  ScrollMode,
  ThemeContext,
  SpecialZoomLevel,
} from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { pageNavigationPlugin } from "@react-pdf-viewer/page-navigation";
import "@react-pdf-viewer/page-navigation/lib/styles/index.css";

interface PDFViewerProps {
  pdfUrl: string; // URL of the PDF to be displayed
  onDocumentLoad?: () => void; // Optional callback function when the document loads
  onError?: (error: Error) => void; // Optional callback function to handle errors
  isMobile: boolean; // Boolean indicating if the viewer is on a mobile device
  scale: number; // Number indicating the scale factor for the PDF viewer
}
// Define the theme context props
interface ThemeContextProps {
  currentTheme: string; // You can change this type to be more specific if needed
  setCurrentTheme: (theme: string) => void; // A function to set the current theme
  viewer: { background: string };
  page: {
    background: string;
    border: string;
    boxShadow: string;
    color: string;
  };
  toolbar: { backgroundColor: string; color: string };
  sidebar: { backgroundColor: string; color: string };
}

// Dark theme definition
const darkTheme: ThemeContextProps = {
  currentTheme: "dark",
  setCurrentTheme: () => {}, // Placeholder function; you'll implement the actual logic
  viewer: {
    background: "#000",
  },
  page: {
    background: "#000",
    border: "1px solid #3a3a3a",
    boxShadow: "rgba(0, 0, 0, 0.3) 0px 0px 8px",
    color: "#000",
  },
  toolbar: {
    backgroundColor: "#000",
    color: "#000",
  },
  sidebar: {
    backgroundColor: "#2a2a2a",
    color: "#000",
  },
};

const PDFViewer = ({
  pdfUrl,
  onDocumentLoad,
  onError,
  isMobile,
  scale,
}: PDFViewerProps) => {
  const [pdfData, setPdfData] = useState<Uint8Array | null>(null);

  // State for managing current theme
  const [currentTheme, setCurrentTheme] = useState<string>("dark");

  useEffect(() => {
    const fetchPdf = async () => {
      try {
        const response = await fetch(pdfUrl, { credentials: "include" });
        if (!response.ok) {
          throw new Error(`Error fetching PDF: ${response.statusText}`);
        }
        const arrayBuffer = await response.arrayBuffer();
        setPdfData(new Uint8Array(arrayBuffer));
        onDocumentLoad?.();
      } catch (error) {
        console.error("Error fetching PDF:", error);
        onError?.(error as Error);
      }
    };

    fetchPdf();
  }, [pdfUrl, onDocumentLoad, onError]);

  const pageNavigationPluginInstance = pageNavigationPlugin();

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
        <ThemeContext.Provider
          value={{ ...darkTheme, currentTheme, setCurrentTheme }}
        >
          {pdfData && (
            <Viewer
              fileUrl={pdfData}
              plugins={[pageNavigationPluginInstance]}
              defaultScale={isMobile ? SpecialZoomLevel.PageFit : scale}
              scrollMode={
                isMobile ? ScrollMode.Horizontal : ScrollMode.Vertical
              }
              onDocumentLoad={onDocumentLoad}
              withCredentials={true}
              // No theme prop since we are using context
            />
          )}
        </ThemeContext.Provider>
      </Worker>
    </div>
  );
};

export default PDFViewer;

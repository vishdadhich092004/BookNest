import React, { useState, useEffect } from "react";
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
  pdfUrl: string;
  onDocumentLoad?: () => void;
  onError?: (error: Error) => void;
  isMobile: boolean;
  scale: number;
}

const darkTheme = {
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

const PDFViewer: React.FC<PDFViewerProps> = ({
  pdfUrl,
  onDocumentLoad,
  onError,
  isMobile,
  scale,
}) => {
  const [pdfData, setPdfData] = useState<Uint8Array | null>(null);

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
        <ThemeContext.Provider value={darkTheme}>
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
              theme="dark"
            />
          )}
        </ThemeContext.Provider>
      </Worker>
    </div>
  );
};

export default PDFViewer;

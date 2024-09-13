import React, { useState, useEffect, useRef } from "react";
import {
  Viewer,
  Worker,
  SpecialZoomLevel,
  ZoomEvent,
} from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

interface PDFViewerProps {
  pdfUrl: string;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ pdfUrl }) => {
  const [pdfData, setPdfData] = useState<Uint8Array | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [currentScale, setCurrentScale] = useState<number | SpecialZoomLevel>(
    0.9
  );
  const viewerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchPdf = async () => {
      try {
        const response = await fetch(pdfUrl, { credentials: "include" });
        const arrayBuffer = await response.arrayBuffer();
        setPdfData(new Uint8Array(arrayBuffer));
      } catch (error) {
        console.error("Error fetching PDF:", error);
      }
    };

    fetchPdf();

    const savedPage = localStorage.getItem("currentPage");
    const savedScale = localStorage.getItem("currentScale");
    if (savedPage) setCurrentPage(parseInt(savedPage, 10));
    if (savedScale) setCurrentScale(parseFloat(savedScale));
  }, [pdfUrl]);

  const handleDocumentLoad = () => {
    if (viewerRef.current) {
      viewerRef.current.querySelector(".rpv-core__viewer")?.scrollTo(0, 0);
    }
  };

  const handlePageChange = (e: { currentPage: number }) => {
    const { currentPage } = e;
    setCurrentPage(currentPage);
    localStorage.setItem("currentPage", currentPage.toString());
  };

  const handleZoomChange = (e: ZoomEvent) => {
    const scale = e.scale;
    setCurrentScale(scale);
    localStorage.setItem("currentScale", scale.toString());
  };

  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    renderToolbar: (Toolbar) => (
      <Toolbar>
        {({
          CurrentPageInput,
          GoToNextPage,
          GoToPreviousPage,
          NumberOfPages,
          ZoomIn,
          ZoomOut,
          EnterFullScreen,
          SwitchTheme,
        }) => (
          <div
            style={{
              display: "flex",
              justifyContent: "space-evenly",
              alignItems: "center",
              width: "100%",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <GoToPreviousPage />
              <CurrentPageInput />
              <GoToNextPage />
              <NumberOfPages />
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <ZoomOut />
              <ZoomIn />
              <EnterFullScreen />
              <SwitchTheme />
            </div>
          </div>
        )}
      </Toolbar>
    ),
  });

  return (
    <div style={{ height: "100vh" }} ref={viewerRef}>
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
        {pdfData && (
          <Viewer
            fileUrl={pdfData}
            plugins={[defaultLayoutPluginInstance]}
            defaultScale={currentScale}
            initialPage={currentPage - 1}
            onPageChange={handlePageChange}
            onZoom={handleZoomChange}
            onDocumentLoad={handleDocumentLoad}
            withCredentials={true}
          />
        )}
      </Worker>
    </div>
  );
};

export default PDFViewer;

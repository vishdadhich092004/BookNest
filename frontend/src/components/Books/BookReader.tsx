import React, { useState, useEffect, useRef } from "react";
import { X, Loader, Maximize, Minimize } from "lucide-react";
import PDFViewer from "../PDFViewer/PDFViewer";

interface BookReaderProps {
  pdfUrl: string;
  onClose: () => void;
}

const BookReader: React.FC<BookReaderProps> = ({ pdfUrl, onClose }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [scale] = useState(1);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobile]);

  const handlePDFLoad = () => {
    setIsLoading(false);
  };

  const handlePDFError = (error: Error) => {
    setIsLoading(false);
    setError(error.message || "An error occurred while loading the PDF.");
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullScreen(true);
    } else {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 z-50 flex flex-col ${
        isMobile
          ? "bg-gray-900"
          : "bg-black bg-opacity-90 items-center justify-center p-4"
      }`}
    >
      <div
        className={`bg-gray-800 flex flex-col ${
          isMobile
            ? "w-full h-full"
            : "w-full h-full max-w-4xl max-h-[90vh] rounded-lg shadow-2xl overflow-hidden"
        }`}
      >
        <div className="flex justify-between items-center p-2 bg-gray-900 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-gray-200">Read Mode</h2>
          <div className="flex items-center space-x-2">
            {!isMobile && (
              <button
                onClick={toggleFullScreen}
                className="text-gray-300 p-1 rounded hover:text-gray-100"
                aria-label="Toggle full screen"
              >
                {isFullScreen ? <Minimize size={20} /> : <Maximize size={20} />}
              </button>
            )}
            <button
              onClick={onClose}
              className="text-gray-300 p-1 rounded hover:text-gray-100"
              aria-label="Close PDF viewer"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        <div className="flex-grow relative overflow-auto">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
              <Loader className="w-12 h-12 text-blue-400 animate-spin" />
            </div>
          )}
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
              <div className="text-red-400 text-center">
                <p className="text-xl font-semibold mb-2">Error</p>
                <p>{error}</p>
              </div>
            </div>
          )}
          <PDFViewer
            pdfUrl={pdfUrl}
            onDocumentLoad={handlePDFLoad}
            onError={handlePDFError}
            isMobile={isMobile}
            scale={scale}
          />
        </div>
      </div>
    </div>
  );
};

export default BookReader;

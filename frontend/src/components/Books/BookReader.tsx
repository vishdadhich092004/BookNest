import { useState } from "react";
import { X, Loader } from "lucide-react";
import PDFViewer from "../PDFViewer/PDFViewer";

interface BookReaderProps {
  pdfUrl: string;
  onClose: () => void;
}

const BookReader = ({ pdfUrl, onClose }: BookReaderProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handlePDFLoad = () => {
    setIsLoading(false);
  };

  const handlePDFError = (error: Error) => {
    setIsLoading(false);
    setError(error.message || "An error occurred while loading the PDF.");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 backdrop-blur-sm p-4 sm:p-6 md:p-8">
      <div className="w-full h-full bg-gray-800 rounded-lg shadow-2xl overflow-hidden flex flex-col max-w-7xl max-h-[90vh]">
        <div className="flex justify-between items-center p-4 bg-gray-900">
          <h2 className="text-lg font-semibold text-gray-100">PDF Viewer</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-100 transition-colors duration-300"
            aria-label="Close PDF viewer"
          >
            <X size={24} />
          </button>
        </div>
        <div className="flex-grow relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
              <Loader className="w-12 h-12 text-blue-500 animate-spin" />
            </div>
          )}
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
              <div className="text-red-500 text-center">
                <p className="text-xl font-semibold mb-2">Error</p>
                <p>{error}</p>
              </div>
            </div>
          )}
          <PDFViewer
            pdfUrl={pdfUrl}
            onDocumentLoad={handlePDFLoad}
            onError={handlePDFError}
          />
        </div>
      </div>
    </div>
  );
};

export default BookReader;

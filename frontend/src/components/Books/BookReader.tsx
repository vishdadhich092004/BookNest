import React from "react";
import { X } from "lucide-react";
import PDFViewer from "../PDFViewer/PDFViewer";

interface BookReaderProps {
  pdfUrl: string;
  onClose: () => void;
}

const BookReader: React.FC<BookReaderProps> = ({ pdfUrl, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 backdrop-blur-sm">
      <div className="relative w-full h-full md:w-11/12 md:h-5/6 lg:max-w-5xl mx-auto bg-white rounded-lg shadow-2xl overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-4 bg-gray-100">
          <h2 className="text-lg font-semibold">PDF Viewer</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800 transition-colors duration-300"
            aria-label="Close PDF viewer"
          >
            <X size={24} />
          </button>
        </div>
        <div className="flex-grow overflow-hidden">
          <PDFViewer pdfUrl={pdfUrl} />
        </div>
      </div>
    </div>
  );
};

export default BookReader;

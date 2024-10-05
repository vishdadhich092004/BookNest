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
      <div className="relative w-full h-full max-w-5xl mx-auto bg-white rounded-lg shadow-2xl overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-gray-600 hover:text-gray-800 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-all duration-300"
          aria-label="Close PDF viewer"
        >
          <X size={24} />
        </button>
        <PDFViewer pdfUrl={pdfUrl} />
      </div>
    </div>
  );
};

export default BookReader;

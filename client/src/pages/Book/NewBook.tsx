import { useState, ChangeEvent, FormEvent } from "react";
import { useAppContext } from "../../contexts/AppContext";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Upload } from "lucide-react";

const BASE_URL = (import.meta.env.VITE_API_BASE_URL as string) || "";

export default function NewBook() {
  const navigate = useNavigate();
  const { showToast } = useAppContext();
  const [pdfFile, setPdfFile] = useState<File | undefined>(undefined);
  const [coverImage, setCoverImage] = useState<File | undefined>(undefined);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [author, setAuthor] = useState<string>("");
  const [genre, setGenre] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();

    if (!pdfFile || !coverImage) {
      showToast({
        message: "Please upload both PDF and cover image.",
        type: "ERROR",
      });
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("pdfFile", pdfFile);
    formData.append("coverImage", coverImage);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("author", author);
    formData.append("genre", genre);

    try {
      const response = await fetch(`${BASE_URL}/api/books/new`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      showToast({ message: "Book Uploaded Successfully", type: "SUCCESS" });
      navigate("/books");
    } catch (error) {
      console.error("There was a problem with the request:", error);
      showToast({ message: "Book Upload Failed", type: "ERROR" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <header className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            Add New Book
          </h1>
        </header>
        <form onSubmit={submit} className="space-y-6">
          <div className="flex flex-col">
            <label htmlFor="title" className="mb-2 font-semibold text-gray-300">
              Title
            </label>
            <input
              id="title"
              value={title}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setTitle(e.target.value)
              }
              type="text"
              placeholder="Enter book title"
              className="bg-gray-900 border border-gray-700 rounded-md p-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="description"
              className="mb-2 font-semibold text-gray-300"
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                setDescription(e.target.value)
              }
              placeholder="Enter book description"
              className="bg-gray-900 border border-gray-700 rounded-md p-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent h-32 resize-none"
            />
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="author"
              className="mb-2 font-semibold text-gray-300"
            >
              Author
            </label>
            <input
              id="author"
              value={author}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setAuthor(e.target.value)
              }
              type="text"
              placeholder="Enter author name"
              className="bg-gray-900 border border-gray-700 rounded-md p-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="genre" className="mb-2 font-semibold text-gray-300">
              Genre
            </label>
            <input
              id="genre"
              value={genre}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setGenre(e.target.value)
              }
              type="text"
              placeholder="Enter book genre"
              className="bg-gray-900 border border-gray-700 rounded-md p-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="pdfFile"
              className="mb-2 font-semibold text-gray-300"
            >
              Upload PDF
            </label>
            <div className="relative">
              <input
                id="pdfFile"
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setPdfFile(e.target.files ? e.target.files[0] : undefined)
                }
                type="file"
                accept=".pdf"
                className="hidden"
              />
              <label
                htmlFor="pdfFile"
                className="flex items-center justify-center w-full bg-gray-900 border border-gray-700 rounded-md p-3 text-white cursor-pointer hover:bg-gray-800 transition-colors duration-300"
              >
                <Upload className="mr-2" size={20} />
                {pdfFile ? pdfFile.name : "Choose PDF file"}
              </label>
            </div>
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="coverImage"
              className="mb-2 font-semibold text-gray-300"
            >
              Upload Cover Image
            </label>
            <div className="relative">
              <input
                id="coverImage"
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setCoverImage(e.target.files ? e.target.files[0] : undefined)
                }
                type="file"
                accept="image/*"
                className="hidden"
              />
              <label
                htmlFor="coverImage"
                className="flex items-center justify-center w-full bg-gray-900 border border-gray-700 rounded-md p-3 text-white cursor-pointer hover:bg-gray-800 transition-colors duration-300"
              >
                <Upload className="mr-2" size={20} />
                {coverImage ? coverImage.name : "Choose cover image"}
              </label>
            </div>
          </div>

          <button
            type="submit"
            className={`w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-md hover:from-purple-600 hover:to-pink-600 transition-all duration-300 flex items-center justify-center ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? (
              "Submitting..."
            ) : (
              <>
                <PlusCircle className="mr-2" size={20} />
                Add New Book
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

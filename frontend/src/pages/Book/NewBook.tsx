import { useState, ChangeEvent, FormEvent } from "react";
import { useAppContext } from "../../contexts/AppContext";
import { useNavigate } from "react-router-dom";

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
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Add New Book</h1>
      <form onSubmit={submit} className="space-y-4">
        <div className="flex flex-col">
          <label htmlFor="title" className="mb-2 font-semibold text-gray-700">
            Title
          </label>
          <input
            id="title"
            value={title}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setTitle(e.target.value)
            }
            type="text"
            placeholder="Title"
            className="border border-gray-300 rounded-md p-2"
          />
        </div>
        <div className="flex flex-col">
          <label
            htmlFor="description"
            className="mb-2 font-semibold text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              setDescription(e.target.value)
            }
            placeholder="Description"
            className="border border-gray-300 rounded-md p-2 h-32 resize-none"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="author" className="mb-2 font-semibold text-gray-700">
            Author
          </label>
          <input
            id="author"
            value={author}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setAuthor(e.target.value)
            }
            type="text"
            placeholder="Author"
            className="border border-gray-300 rounded-md p-2"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="genre" className="mb-2 font-semibold text-gray-700">
            Genre
          </label>
          <input
            id="genre"
            value={genre}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setGenre(e.target.value)
            }
            type="text"
            placeholder="Genre"
            className="border border-gray-300 rounded-md p-2"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="pdfFile" className="mb-2 font-semibold text-gray-700">
            Upload PDF
          </label>
          <input
            id="pdfFile"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setPdfFile(e.target.files ? e.target.files[0] : undefined)
            }
            type="file"
            accept=".pdf"
            className="border border-gray-300 rounded-md p-2"
          />
        </div>
        <div className="flex flex-col">
          <label
            htmlFor="coverImage"
            className="mb-2 font-semibold text-gray-700"
          >
            Upload Cover Image
          </label>
          <input
            id="coverImage"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setCoverImage(e.target.files ? e.target.files[0] : undefined)
            }
            type="file"
            accept="image/*"
            className="border border-gray-300 rounded-md p-2"
          />
        </div>

        <button
          type="submit"
          className={`w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition duration-300 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}

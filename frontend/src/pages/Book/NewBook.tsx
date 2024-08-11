import { useState, ChangeEvent, FormEvent } from "react";
import { useAppContext } from "../../contexts/AppContext";
import { useNavigate } from "react-router-dom";

const BASE_URL = (import.meta.env.VITE_API_BASE_URL as string) || "";

export default function NewBook() {
  const navigate = useNavigate();
  const { showToast } = useAppContext();
  const [file, setFile] = useState<File | undefined>(undefined);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [author, setAuthor] = useState<string>("");
  const [genre, setGenre] = useState<string>("");

  const submit = async (event: FormEvent) => {
    event.preventDefault();

    const formData = new FormData();
    if (file) formData.append("pdfFile", file);
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

      // Handle success (e.g., display a success message, clear form, etc.)
      // alert("Book added successfully!");
      showToast({ message: "Book Uploaded Succesfully", type: "SUCCESS" });
      navigate("/books");
    } catch (error) {
      // Handle error
      console.error("There was a problem with the request:", error);
      // alert("Failed to add the book.");
      showToast({ message: "Book Upload Failed", type: "ERROR" });
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Add New Book</h1>
      <form onSubmit={submit} className="space-y-4">
        <div className="flex flex-col">
          <label className="mb-2 font-semibold text-gray-700">Title</label>
          <input
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
          <label className="mb-2 font-semibold text-gray-700">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              setDescription(e.target.value)
            }
            placeholder="Description"
            className="border border-gray-300 rounded-md p-2 h-32 resize-none"
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-2 font-semibold text-gray-700">Author</label>
          <input
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
          <label className="mb-2 font-semibold text-gray-700">Genre</label>
          <input
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
          <label className="mb-2 font-semibold text-gray-700">Upload PDF</label>
          <input
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setFile(e.target.files ? e.target.files[0] : undefined)
            }
            type="file"
            accept=".pdf"
            className="border border-gray-300 rounded-md p-2"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition duration-300"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

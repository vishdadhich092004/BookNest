import { useAppContext } from "../../contexts/AppContext";
import { useNavigate } from "react-router-dom";
import { ChangeEvent, FormEvent, useState } from "react";

const BASE_URL = (import.meta.env.VITE_API_BASE_URL as string) || "";

function NewClub() {
  const navigate = useNavigate();
  const { showToast } = useAppContext();

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [bannerImgUrl, setBannerImgUrl] = useState<File | undefined>(undefined);
  const [profileImgUrl, setProfileImgUrl] = useState<File | undefined>(
    undefined
  );
  const [loading, setLoading] = useState<boolean>(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();

    if (!bannerImgUrl || !profileImgUrl) {
      showToast({
        message: "Please Upload both Banner and Profile Picture",
        type: "ERROR",
      });
      return;
    }
    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("bannerImgUrl", bannerImgUrl);
    formData.append("profileImgUrl", profileImgUrl);

    try {
      const response = await fetch(`${BASE_URL}/api/clubs/new`, {
        credentials: "include",
        body: formData,
        method: "POST",
      });
      if (!response.ok) throw new Error(`Error: ${response.statusText}`);
      navigate("/clubs");
    } catch (error) {
      console.error("There was a problem with the request:", error);
      showToast({ message: "Club Upload Failed", type: "ERROR" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Add New Book</h1>
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
          <label
            htmlFor="bannerImgUrl"
            className="mb-2 font-semibold text-gray-700"
          >
            Upload Banner Image
          </label>
          <input
            id="bannerImgUrl"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setBannerImgUrl(e.target.files ? e.target.files[0] : undefined)
            }
            type="file"
            accept="image/*"
            className="border border-gray-300 rounded-md p-2"
          />
        </div>
        <div className="flex flex-col">
          <label
            htmlFor="profileImgUrl"
            className="mb-2 font-semibold text-gray-700"
          >
            Upload Profile Image
          </label>
          <input
            id="profileImgUrl"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setProfileImgUrl(e.target.files ? e.target.files[0] : undefined)
            }
            type="file"
            accept="image/*"
            className="border border-gray-300 rounded-md p-2"
          />
        </div>

        <button
          type="submit"
          className={`w-full bg-teal-600 text-white py-2 rounded-sm hover:bg-teal-700 transition-colors duration-300 ${
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

export default NewClub;

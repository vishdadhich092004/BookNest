import { RegisterFormData } from "./pages/Auth/Register";
import { SignInFormData } from "./pages/Auth/SignIn";
import { DiscussionFormData } from "./pages/Discussion/NewDiscussion";
import { BookType, DiscussionType } from "../../backend/src/shared/types";
import { CommentFormData } from "./pages/Comment/NewComment";
import { ReviewFormData } from "./pages/Review/NewReview";
const BASE_URL = (import.meta.env.VITE_API_BASE_URL as string) || "";

export const register = async (formData: RegisterFormData) => {
  const response = await fetch(`${BASE_URL}/api/users/register`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });
  const responseBody = await response.json();
  if (!response.ok) throw new Error(responseBody.message);
};

export const signIn = async (formData: SignInFormData) => {
  const response = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });
  const body = await response.json();
  if (!response.ok) throw new Error(body.message);
  return body;
};

export const validateToken = async () => {
  const response = await fetch(`${BASE_URL}/api/auth/validate-token`, {
    credentials: "include",
  });

  if (!response.ok) {
    console.error(await response.text());
    throw new Error("Token invalid");
  }
  const data = await response.json();
  return data;
};
export const signOut = async () => {
  const response = await fetch(`${BASE_URL}/api/auth/logout`, {
    credentials: "include",
    method: "POST",
  });
  if (!response.ok) throw new Error("Error during Signout");
};

export const newDiscussion = async (discussionFormData: DiscussionFormData) => {
  const response = await fetch(`${BASE_URL}/api/discussions/new`, {
    credentials: "include",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(discussionFormData),
  });
  const body = await response.json();
  if (!response.ok) throw new Error(body.message);
  return body;
};

export const allDiscussions = async (): Promise<DiscussionType[]> => {
  const response = await fetch(`${BASE_URL}/api/discussions`, {
    credentials: "include",
  });
  if (!response.ok) throw new Error("Error fetching discussions");
  return response.json();
};

export const fetchDiscussionById = async (
  discussionId: string
): Promise<DiscussionType> => {
  const response = await fetch(`${BASE_URL}/api/discussions/${discussionId}`, {
    credentials: "include",
  });
  if (!response.ok) throw new Error("Error fetching discussion.");
  const data = await response.json();
  return data as DiscussionType;
};

export const fetchDiscussionOwner = async (discussionId: string) => {
  const response = await fetch(
    `${BASE_URL}/api/discussions/${discussionId}/owner`,
    {
      credentials: "include",
    }
  );
  if (!response.ok) throw new Error("Error Fetching user for the discussion");
  const data = await response.json();
  return data;
};

export const newComment = async (
  commentFormData: CommentFormData,
  discussionId: string
) => {
  const response = await fetch(
    `${BASE_URL}/api/discussions/${discussionId}/comments`,
    {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(commentFormData),
    }
  );
  const body = await response.json();
  if (!response.ok) throw new Error(body.message);
  return body;
};

export const updateDiscussion = async (
  discussionId: string,
  editDiscussionFormData: DiscussionFormData
): Promise<DiscussionType> => {
  const response = await fetch(
    `${BASE_URL}/api/discussions/${discussionId}/edit`,
    {
      credentials: "include",
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editDiscussionFormData),
    }
  );
  const body = await response.json();
  if (!response.ok) throw new Error(body.message);
  return body;
};

// BOOKS:
export const fetchBooks = async () => {
  const response = await fetch(`${BASE_URL}/api/books`, {
    credentials: "include",
  });
  if (!response.ok) {
    const body = await response.json();
    throw new Error(body.message || "Failed to fetch books");
  }
  return response.json();
};

// new review
export const newReview = async (
  reviewFormData: ReviewFormData,
  bookId: string
) => {
  const response = await fetch(`${BASE_URL}/api/books/${bookId}/reviews`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(reviewFormData),
  });
  const body = await response.json();
  if (!response.ok) throw new Error(body.message);
  return body;
};

export const fetchBookById = async (bookId: string): Promise<BookType> => {
  const response = await fetch(`${BASE_URL}/api/books/${bookId}`, {
    credentials: "include",
  });
  if (!response.ok) throw new Error("Error fetching book.");
  const data = await response.json();
  return data as BookType;
};

export const likeDiscussion = async (discussionId: string) => {
  const response = await fetch(
    `${BASE_URL}/api/discussions/${discussionId}/like`,
    {
      method: "POST",
      credentials: "include",
    }
  );
  if (!response.ok) throw new Error("Failed to like discussion");
  return response.json();
};
export const dislikeDiscussion = async (discussionId: string) => {
  const response = await fetch(
    `${BASE_URL}/api/discussions/${discussionId}/dislike`,
    {
      method: "POST",
      credentials: "include",
    }
  );
  if (!response.ok) throw new Error("Error disliking discussion");
  return response.json();
};

export const likeComment = async (discussionId: string, commentId: string) => {
  const response = await fetch(
    `${BASE_URL}/api/discussions/${discussionId}/comments/${commentId}/like`,
    {
      credentials: "include",
      method: "POST",
    }
  );
  if (!response.ok) throw new Error("Failed to Like Comment");
  return response.json();
};

export const dislikeComment = async (
  discussionId: string,
  commentId: string
) => {
  const response = await fetch(
    `${BASE_URL}/api/discussions/${discussionId}/comments/${commentId}/dislike`,
    {
      credentials: "include",
      method: "POST",
    }
  );
  if (!response.ok) throw new Error("Failed to Dislike Comment");
  return response.json();
};

export const fetchCommentByDiscussionId = async (discussionId: string) => {
  const response = await fetch(
    `${BASE_URL}/api/discussions/:${discussionId}/comments`
  );
  if (!response.ok) throw new Error("Error fetching comments");
  return response.json();
};

import { RegisterFormData } from "./pages/Register";
import { SignInFormData } from "./pages/SignIn";
import { DiscussionFormData } from "./pages/Discussion/NewDiscussion";
import { DiscussionType } from "../../backend/src/shared/types";
import { CommentFormData } from "./pages/Comment/NewComment";
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
    throw new Error("Token invalid");
  }

  return response.json();
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

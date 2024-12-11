export type UserType = {
  _id: string;
  email: string;
  password?: string;
  firstName: string;
  lastName?: string;
  comments?: string;
  role: "admin" | "user";
  permissions: string[];
  googleId?: string;
  picture?: string;
  favoriteGenres: string[];
  readBooks: BookType[];
  profileAvatar: string;
  setRandomAvatar: () => void;
};
export type CommentType = {
  _id: string;
  discussionId: DiscussionType;
  userId: UserType;
  text: string;
  timestamp: Date;
  likes: string[];
  dislikes: string[];
};

export type DiscussionType = {
  _id: string;
  title: string;
  description: string;
  userId: UserType;
  comments: CommentType[];
  createdAt: Date;
  updatedAt: Date;
  bookId: BookType | null | undefined;
  likes: string[];
  dislikes: string[];
};

export type BookType = {
  _id: string;
  title: string;
  description: string;
  author: AuthorType;
  genre: GenreType;
  pdfUrl: string;
  coverPageUrl: string;
  userId: UserType;
  reviews: ReviewType[];
};

export type ReviewType = {
  _id: string;
  rating: number;
  text: string;
  bookId: BookType;
  userId: UserType;
  createdAt: Date;
};

export type GenreType = {
  _id: string;
  name: string;
  description?: string;
  books?: BookType[]; // Array of book IDs associated with this genre
};
export type AuthorType = {
  _id: string;
  name: string;
  biography?: string;
  birthDate?: Date;
  books?: BookType[]; // Array of book IDs written by this author
  profileImageUrl?: string;
};

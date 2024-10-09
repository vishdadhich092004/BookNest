export type UserType = {
  _id: string;
  email: string;
  password?: string;
  firstName: string;
  lastName?: string;
  comments?: string; // Note: This is string in UserType but ObjectId in the schema
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
  author: string;
  genre: string;
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

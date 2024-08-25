export type UserType = {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  comments: string;
  role: string;
  permissions: [string];
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
  book: string;
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

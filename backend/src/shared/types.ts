export type UserType = {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  comments: string;
};

export type CommentType = {
  _id: string;
  discussionId: DiscussionType;
  userId: UserType;
  text: string;
  timestamp: Date;
  likes: number;
};

export type DiscussionType = {
  _id: string;
  title: string;
  description: string;
  userId: UserType;
  comments: CommentType[];
  createdAt: Date;
  updatedAt: Date;
};

export type BookType = {
  _id: string;
  title: string;
  description: string;
  author: string;
  genre: string;
  pdfUrl: string;
  coverPageUrl: string;
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

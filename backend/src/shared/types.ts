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
  user: string;
  text: string;
  timestamp: Date;
  likes: number;
};

export type DiscussionType = {
  _id: string;
  title: string;
  description: string;
  createdBy: string;
  comments: CommentType[];
  createdAt: Date;
  updatedAt: Date;
};

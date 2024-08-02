export type UserType = {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
};

export type Comment = {
  user: string;
  text: string;
  timestamp: Date;
};

export type DiscussionType = {
  title: string;
  description: string;
  createdBy: string;
  comments: Comment[];
  createdAt?: number;
  updatedAt?: number;
};

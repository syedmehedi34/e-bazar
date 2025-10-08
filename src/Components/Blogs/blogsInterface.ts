export interface Blog {
  _id: string;
  title: string;
  category: string;
  tags: string[];
  author: string;
  date: string;
  image: string;
  shortDescription: string;
  content: Paragraph[];
  comments: Comment[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Paragraph {
  paragraph: string;
}

export interface Comment {
  user: string;
  comment: string;
  date: string;
}

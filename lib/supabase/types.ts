export type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string[];
  author: string;
  category: string;
  read_time: string;
  published_at: string;
  created_at: string;
  user_id: string;
  views: number;
};

export type Comment = {
  id: string;
  post_id: string;
  user_id: string;
  body: string;
  created_at: string;
};

export type Subscriber = {
  id: string;
  email: string;
  subscribed_at: string;
};

export type User = {
  id: string;
  email: string;
};
export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string[];
  content_html: string | null;
  cover_image: string | null;
  author: string;
  category: string;
  read_time: string;
  published_at: string;
  created_at: string;
  user_id: string;
  views: number;
  date: string;
  readTime: string;
}

export interface SiteConfig {
  title: string;
  description: string;
  author: string;
  url: string;
  social: {
    twitter: string;
    github: string;
  };
}
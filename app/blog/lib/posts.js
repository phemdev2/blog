import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDir = path.join(process.cwd(), 'posts');

export function getAllPosts() {
  const files = fs.readdirSync(postsDir);

  return files
    .filter(f => f.endsWith('.mdx'))
    .map(filename => {
      const slug = filename.replace('.mdx', '');
      const raw = fs.readFileSync(
        path.join(postsDir, filename), 'utf8'
      );
      const { data } = matter(raw);
      return { slug, ...data };
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}
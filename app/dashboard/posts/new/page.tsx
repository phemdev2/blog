import { PostForm } from "@/components/post-form";

export default function NewPostPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-white mb-8">New Post</h1>
      <PostForm />
    </div>
  );
}
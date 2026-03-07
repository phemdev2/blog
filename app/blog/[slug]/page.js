"use client";

// In your real app, replace this with:
// import { getPostBySlug } from "@/lib/posts";

const post = {
  slug: "execution-is-the-strategy",
  title: "Execution Is the Strategy",
  date: "2025-01-22",
  description: "Most teams have good ideas. The differentiator is ruthless, consistent execution.",
  tags: ["leadership", "product"],
  readTime: "7 min read",
  content: [
    { type: "p", text: "Every team I've worked with had good ideas. Most of them failed to ship. Not because the ideas were wrong — but because execution was treated as the boring part after strategy was done." },
    { type: "p", text: "That framing is backwards. Execution isn't what happens after you set the strategy. Execution is the strategy. The plan on paper is worth nothing. What you actually ship, learn, and iterate on — that's the real strategy playing out." },
    { type: "h2", text: "Why Smart Teams Under-execute" },
    { type: "p", text: "It's not laziness. It's usually one of three things: unclear ownership, too many priorities, or a culture that rewards planning over shipping." },
    { type: "p", text: "Unclear ownership means every decision requires a meeting. Too many priorities means nothing is actually a priority. A planning culture means people get praised for decks, not demos." },
    { type: "blockquote", text: '"A good plan, violently executed now, is better than a perfect plan next week." — George Patton' },
    { type: "h2", text: "The System I Use" },
    { type: "p", text: "I've tried a lot of frameworks. What actually works is embarrassingly simple:" },
    { type: "list", items: [
      "One goal per quarter. Not five — one. Everything else is a dependency or a distraction.",
      "Weekly written updates. Not standups. A short async note: what shipped, what's blocked, what's next.",
      "A bias toward doing over discussing. When in doubt, build the smallest version and learn from it.",
      "Celebrate shipped work, not planned work. Your retrospectives should be about outcomes, not effort.",
    ]},
    { type: "h2", text: "Momentum Is the Real Metric" },
    { type: "p", text: "The best teams I've been on had one thing in common: they shipped something every week. Not always big things. Sometimes it was a bug fix, a small feature, a doc update. But there was always movement." },
    { type: "p", text: "Momentum compounds. A team that ships consistently builds confidence, trust with stakeholders, and a feedback loop that makes the next thing better. A team that waits for the perfect moment rarely finds it." },
    { type: "h2", text: "The Hard Part" },
    { type: "p", text: "None of this is complicated. The hard part is saying no — to features, to meetings, to scope creep, to the exciting new idea that just came up. Execution requires discipline, and discipline requires saying no far more often than feels comfortable." },
    { type: "p", text: "If your team is struggling to ship, don't hire more people or run a strategy offsite. Reduce scope, clarify ownership, and ship something this week. The rest will follow." },
  ],
};

const relatedPosts = [
  { slug: "scaling-systems-at-speed", title: "Scaling Systems at Speed Without Breaking Everything", date: "2025-02-18" },
  { slug: "product-thinking-for-engineers", title: "Product Thinking Every Engineer Should Know", date: "2025-02-05" },
];

export default function BlogPostPage() {
  return (
    <>
    

      <div className="post-main">
        <a href="/" className="back">← All articles</a>

        <header className="post-header">
          {post.tags.length > 0 && (
            <div className="post-tags">
              {post.tags.map(t => <span key={t} className="post-tag">{t}</span>)}
            </div>
          )}
          <h1 className="post-title">{post.title}</h1>
          <p className="post-desc">{post.description}</p>
          <div className="post-meta">
            <span>{new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
            <span className="meta-dot" />
            <span>{post.readTime}</span>
          </div>
        </header>

        <article className="post-content">
          {post.content.map((block, i) => {
            if (block.type === "p") return <p key={i}>{block.text}</p>;
            if (block.type === "h2") return <h2 key={i}>{block.text}</h2>;
            if (block.type === "blockquote") return <blockquote key={i}>{block.text}</blockquote>;
            if (block.type === "list") return (
              <ul key={i}>{block.items.map((item, j) => <li key={j}>{item}</li>)}</ul>
            );
            return null;
          })}
        </article>

        <hr className="divider" />

        <section className="related">
          <p className="related-label">More articles</p>
          {relatedPosts.map(p => (
            <a key={p.slug} href={`/blog/${p.slug}`} className="related-item">
              <h4>{p.title}</h4>
              <span>{new Date(p.date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</span>
            </a>
          ))}
        </section>
      </div>
    </>
  );
}
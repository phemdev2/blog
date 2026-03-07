export const metadata = {
  title: 'About',
  description: 'Learn more about this blog and its author.',
};

export default function AboutPage() {
  return (
    <>
   

      <div className="post-main">
        <a href="/" className="back">← Home</a>

        <header className="post-header">
          <h1 className="post-title">About</h1>
        </header>

        <article className="post-content">
          <p>
            Hi, I'm [Your Name]. Welcome to my blog where I write about [your topic].
          </p>

          <p>
            I started this blog because [your reason]. With [X] years of experience in
            [your field], I want to share what I've learned to help others [achieve what].
          </p>

          <p>
            On this blog you'll find articles about [topics you cover]. My goal is to
            [your goal — e.g., "make these topics accessible to beginners"].
          </p>

          <h2>Get in Touch</h2>
          <p>
            Have a question or topic suggestion?{' '}
            <a href="/contact" style={{ textDecoration: 'underline' }}>
              Send me a message
            </a>.
          </p>
        </article>
      </div>
    </>
  );
}
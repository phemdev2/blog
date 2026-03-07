// app/contact/page.js

export const metadata = {
  title: 'Contact',
  description: 'Get in touch.',
};

export default function ContactPage() {
  return (
    <>
   
      <div className="post-main">
        <a href="/" className="back">← Home</a>

        <header className="post-header">
          <h1 className="post-title">Contact</h1>
          <p className="post-desc">Have a question or topic suggestion? I'd love to hear from you.</p>
        </header>

        <article className="post-content">
          <p>
            The best way to reach me is by email:{' '}
            <a href="mailto:your@email.com" style={{ textDecoration: 'underline' }}>
              your@email.com
            </a>
          </p>
        </article>
      </div>
    </>
  );
}
// app/privacy-policy/page.js

export const metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for this website.',
};

export default function PrivacyPolicyPage() {
  return (
    <>
        <div className="post-main">
        <a href="/" className="back">← Home</a>

        <header className="post-header">
          <h1 className="post-title">Privacy Policy</h1>
          <p className="post-desc">Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
        </header>

        <article className="post-content">

          <p>This Privacy Policy describes how MyBlog collects, uses, and shares information when you visit this website.</p>

          <h2>Information We Collect</h2>
          <p>We automatically collect certain information when you visit, including your IP address, browser type, referring URLs, and pages visited. We do not collect any personal information unless you contact us directly.</p>

          <h2>Google AdSense & Cookies</h2>
          <p>We use Google AdSense to display advertisements. Google AdSense uses cookies to serve ads based on your prior visits to this and other websites. You may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" style={{ textDecoration: 'underline' }} target="_blank" rel="noopener noreferrer">Google's Ads Settings</a>.</p>

          <h2>Google Analytics</h2>
          <p>We use Google Analytics to understand how visitors interact with our site. Google Analytics collects information such as how often users visit, what pages they visit, and what other sites they used before coming here.</p>

          <h2>Third-Party Links</h2>
          <p>This site may contain links to third-party websites. We are not responsible for their privacy practices and encourage you to review their policies.</p>

          <h2>Children's Privacy</h2>
          <p>This website is not directed to children under 13. We do not knowingly collect personal information from children under 13.</p>

          <h2>Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated date.</p>

          <h2>Contact</h2>
          <p>If you have questions about this policy, email us at <a href="mailto:your@email.com" style={{ textDecoration: 'underline' }}>your@email.com</a>.</p>

        </article>
      </div>
    </>
  );
}
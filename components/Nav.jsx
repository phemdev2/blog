// components/Nav.js

import Link from "next/link";

export default function Nav() {
  return (
    <nav className="nav">
      <Link href="/" className="nav-logo">MyBlog</Link>
       <ul className="nav-links">
          <li><a href="/">Home</a></li>
          <li><a href="/blog">Articles</a></li>
          <li><a href="/about">Abouts</a></li>
          <li><a href="/contact">Contact</a></li>
          <li><a href="/privacy-policy">Privacy</a></li>
        </ul>
    </nav>
  );
}
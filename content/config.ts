// src/content/config.ts
import type { Post, SiteConfig } from "@/types/types";

export const siteConfig: SiteConfig = {
  title: "Modern Blogstr",
  description:
    "A clean, fast, SEO-optimized blog platform for writers and creators.",
  author: "John Doe",
  url: "https://modernblogstr.com",
  social: {
    twitter: "@modernblogstr",
    github: "modernblogstr",
  },
};

export const posts: Post[] = [
  {
    id: "1",
    title: "Getting Started with Modern Web Development in 2024",
    excerpt:
      "A comprehensive guide to setting up your development environment with the latest tools and best practices for building modern web applications.",
    content: [
      "Web development has evolved significantly over the past few years. With the introduction of new frameworks, tools, and methodologies, it's more important than ever to stay up-to-date with the latest trends and best practices.",
      "In this guide, we'll explore the essential tools and technologies you need to build modern web applications. From setting up your development environment to choosing the right framework for your project, we've got you covered.",
      "Let's start with the basics. A good code editor is essential for any developer. VS Code has become the industry standard, offering a wide range of extensions and features that make coding more efficient and enjoyable.",
      "Next, you'll need a version control system. Git is the de facto standard, and platforms like GitHub and GitLab make collaboration easy. Understanding branching strategies and pull requests is crucial for team projects.",
      "When it comes to frameworks, React continues to dominate the frontend landscape. Its component-based architecture and vast ecosystem make it an excellent choice for building scalable applications.",
      "Finally, don't forget about testing and deployment. Tools like Jest, Cypress, and Vercel can help you ensure your application is bug-free and reaches your users quickly.",
    ],
    author: "John Doe",
    date: "2024-01-15",
    readTime: "8 min read",
    category: "Technology",
  },
  {
    id: "2",
    title: "The Art of Clean Code: Writing Maintainable Software",
    excerpt:
      "Learn the principles and practices that will help you write code that is easy to read, understand, and maintain for years to come.",
    content: [
      "Clean code is not just about making your code look pretty. It's about writing code that is easy to understand, modify, and extend. Good code should read like well-written prose, telling a clear story to anyone who reads it.",
      "One of the fundamental principles of clean code is meaningful naming. Variables, functions, and classes should have names that clearly describe their purpose. Avoid abbreviations and single-letter variables unless they're universally understood.",
      "Functions should be small and do one thing. The Single Responsibility Principle applies at every level of your code. If a function is doing more than one thing, consider breaking it down into smaller, more focused functions.",
      "Comments should be used sparingly and only when necessary. Good code should be self-documenting. If you find yourself writing comments to explain what your code does, consider refactoring it to be more clear.",
      "Error handling is another crucial aspect of clean code. Don't ignore errors or silently fail. Handle errors gracefully and provide meaningful feedback to users when something goes wrong.",
      "Remember, code is read much more often than it is written. Investing time in writing clean code will pay dividends in the long run, making your codebase easier to maintain and evolve.",
    ],
    author: "Jane Smith",
    date: "2024-01-10",
    readTime: "6 min read",
    category: "Design",
  },
  {
    id: "3",
    title: "Building SEO-Friendly React Applications",
    excerpt:
      "Discover the techniques and tools you need to ensure your React applications rank well in search engines and attract organic traffic.",
    content: [
      "Search Engine Optimization (SEO) is crucial for any website or application. While React is a powerful framework for building user interfaces, it presents some unique challenges when it comes to SEO.",
      "The first step to SEO-friendly React apps is proper semantic HTML. Use the right HTML elements for the right purpose. Headings, nav elements, articles, and sections all help search engines understand your content structure.",
      "Meta tags are essential for SEO. Ensure each page has unique title tags, meta descriptions, and Open Graph tags. These elements appear in search results and social media shares, significantly impacting click-through rates.",
      "Performance is a key ranking factor. Optimize your images, lazy-load components, and minimize JavaScript bundle sizes. Tools like Lighthouse can help you identify performance bottlenecks.",
      "Structured data helps search engines understand your content better. Implement JSON-LD schemas for articles, products, reviews, and other content types to enhance your search result appearance with rich snippets.",
      "Finally, ensure your site is accessible. Good accessibility practices often align with SEO best practices. Use alt text for images, proper heading hierarchies, and ensure keyboard navigation works throughout your site.",
    ],
    author: "John Doe",
    date: "2024-01-05",
    readTime: "7 min read",
    category: "Technology",
  },
  {
    id: "4",
    title: "Monetizing Your Blog: Strategies for 2024",
    excerpt:
      "Explore various monetization strategies for bloggers, from display advertising to affiliate marketing and creating digital products.",
    content: [
      "Blogging can be a lucrative venture if approached strategically. In 2024, there are more ways than ever to monetize your content and build a sustainable income stream from your blog.",
      "Display advertising remains one of the most popular monetization methods. Google AdSense is the go-to choice for many bloggers, but alternatives like Mediavine and AdThrive can offer higher rates for established blogs.",
      "Affiliate marketing allows you to earn commissions by promoting products or services. The key is to promote products you genuinely believe in and that are relevant to your audience. Disclosure is not just ethical—it's required by law.",
      "Creating and selling digital products can be highly profitable. E-books, online courses, templates, and tools allow you to monetize your expertise while providing value to your readers.",
      "Sponsored content and brand partnerships can provide significant income. As your audience grows, brands may pay you to create content featuring their products. Always maintain transparency with your audience.",
      "Remember, successful monetization requires building trust with your audience. Focus on creating valuable content first, and monetization opportunities will follow naturally.",
    ],
    author: "Jane Smith",
    date: "2024-01-01",
    readTime: "5 min read",
    category: "Business",
  },
  {
    id: "5",
    title: "The Future of Web Development: Trends to Watch",
    excerpt:
      "A look at emerging technologies and trends that will shape the future of web development in the coming years.",
    content: [
      "The web development landscape is constantly evolving. Staying ahead of the curve means keeping an eye on emerging trends and technologies that will shape the future of our industry.",
      "AI-assisted development is becoming increasingly prevalent. Tools like GitHub Copilot and ChatGPT are changing how we write code, offering suggestions and automating repetitive tasks.",
      "WebAssembly is enabling high-performance applications in the browser. Languages like Rust and Go can now run at near-native speeds, opening up new possibilities for web applications.",
      "Edge computing is transforming how we deploy and scale applications. Platforms like Cloudflare Workers and Vercel Edge Functions allow code to run closer to users, reducing latency and improving performance.",
      "Progressive Web Apps (PWAs) continue to gain traction. They offer app-like experiences on the web, with offline capabilities, push notifications, and installation options.",
      "The rise of no-code and low-code platforms is democratizing web development. While they won't replace professional developers, they're enabling more people to build web applications without extensive coding knowledge.",
    ],
    author: "John Doe",
    date: "2023-12-28",
    readTime: "6 min read",
    category: "Technology",
  },
];
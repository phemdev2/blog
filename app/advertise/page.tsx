import Link from "next/link";
import { Layout } from "@/components/Layout";
import { siteConfig } from "@/content/config";

export const metadata = {
  title: "Advertise With Us",
  description: "Place targeted ads on our platform and reach your audience.",
};

export default function AdvertisePage() {
  return (
    <Layout>
      <article className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">How To Place Targeted Ads</h1>
        <p className="text-sm text-gray-400 mb-8">Last updated: {new Date().getFullYear()}</p>

        <div className="prose prose-gray max-w-none space-y-6 text-gray-700 leading-relaxed">
          <p>Dear Ladies &amp; Gentlemen,</p>

          <p>
            Thank you for your interest in advertising on <strong>{siteConfig.title}</strong>!
          </p>

          <p>
            {siteConfig.title} runs a <strong>Targeted Ad Platform</strong> with which any member
            can place adverts on the sections of {siteConfig.title} where the people he/she wants
            to reach are most likely to be found. For example, a tech company could place ads on
            the Technology section, or a fashion brand on the Lifestyle section.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-2">How It Works</h2>
          <p>
            To place ads on {siteConfig.title}, the first step is to get your ad banner designed
            by a good graphic designer. Your ad banner must be:
          </p>

          <ul className="list-disc pl-6 space-y-1 text-gray-700">
            <li>Borderless</li>
            <li>728 pixels wide, 182 pixels tall (4:1 ratio)</li>
            <li>Less than 500kb in size</li>
            <li>In PNG or JPG format</li>
          </ul>

          <p>
            Once your banner is ready, contact us at{" "}
            <a href={`mailto:ads@${siteConfig.url.replace("https://", "")}`} className="text-blue-600 hover:underline">
              ads@{siteConfig.url.replace("https://", "")}
            </a>{" "}
            to submit your banner and landing page URL, and wait for approval. Your ad might not
            be approved if it is deceptive, illegal, or morally questionable in any way.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-2">After Approval</h2>
          <p>
            After your ad is approved, we will provide you with information on how to purchase
            advertising credits so you can freely place your ads on any section of{" "}
            {siteConfig.title} — including the home page. Our system is extremely simple by design.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-2">Estimated Rates</h2>
          <p>
            Please see our{" "}
            <Link href="/advert-rates" className="text-blue-600 hover:underline font-medium">
              Estimated Advertising Rates
            </Link>{" "}
            to find out how much it will cost to advertise on the various sections of{" "}
            {siteConfig.title}. Prices on the short term are strongly correlated with traffic levels.
            Billing details, unique click reports, view counts, and charges per ad/section will be
            provided after your account is set up.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-2">Get In Touch</h2>
          <p>
            We look forward to doing business with you! Reach us at{" "}
            <a
              href={`mailto:ads@${siteConfig.url.replace("https://", "")}`}
              className="text-blue-600 hover:underline"
            >
              ads@{siteConfig.url.replace("https://", "")}
            </a>{" "}
            for pricing, approvals, and any questions.
          </p>

          <p className="mt-8">
            Best regards,
            <br />
            <strong>{siteConfig.author}</strong>
            <br />
            <span className="text-gray-500">{siteConfig.title}</span>
          </p>
        </div>
      </article>
    </Layout>
  );
}
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              // Allow Next.js runtime scripts
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.vercel.app",
              // Allow inline styles + Google Fonts
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              // Allow images from Supabase + Vercel
              "img-src 'self' data: blob: https://*.supabase.co https://*.vercel.app https://blog-nine-lilac-51.vercel.app",
              // Allow fonts from Google Fonts
              "font-src 'self' https://fonts.gstatic.com",
              // Allow Supabase API + websockets
              "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;

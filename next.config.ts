const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
const url = new URL(apiBaseUrl);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: url.protocol.replace(":", ""), // "http" or "https"
        hostname: url.hostname,
        port: url.port || "", // empty string if default port
        pathname: "/article/image-path/**",
      },
    ],
    dangerouslyAllowLocalIP: true,
  },
};

module.exports = nextConfig;

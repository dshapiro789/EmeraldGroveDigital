/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Required for Cloudflare Pages
  output: 'export',
  images: {
    unoptimized: true, // Cloudflare Images can be used separately if needed
  },
  // Disable trailing slashes for Cloudflare compatibility
  trailingSlash: false,
};

export default nextConfig;

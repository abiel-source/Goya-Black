/** @type {import('next').NextConfig} */
const nextConfig = {
  // whitelist Pixabay
  images: {
    domains: ["cdn.pixabay.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "images.metmuseum.org",
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;

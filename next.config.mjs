import { withContentCollections } from "@content-collections/next";

const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default withContentCollections(nextConfig);

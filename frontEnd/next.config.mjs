/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Allows importing from the shared repo-level `/types` folder.
    externalDir: true
  }
};

export default nextConfig;


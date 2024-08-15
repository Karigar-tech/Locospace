/** @type {import('next').NextConfig} */

const nextConfig = {
    images: {
        domains: ['firebasestorage.googleapis.com'], // External image domains
        deviceSizes: [640, 750, 828, 1080, 1200, 1920], // Device sizes for responsive images
        imageSizes: [16, 32, 48, 64, 96], // Image sizes
        loader: 'default', // Use default loader (you can specify custom loader here)
    },
    output: "standalone",
  };

export default nextConfig;


/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
      domains: [
        'firebasestorage.googleapis.com',
        // Add any other domains you need to load images from
      ],
    },
  }
  
  export default nextConfig;
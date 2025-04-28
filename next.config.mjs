const nextConfig = {
    reactStrictMode: true,
    devIndicators: false,
    images: {
      domains: [
        'firebasestorage.googleapis.com',
      ],
    },
    experimental: {
        optimizeFonts: true,
    }
  }
  
  export default nextConfig;
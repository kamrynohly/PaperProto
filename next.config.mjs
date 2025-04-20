const nextConfig = {
    reactStrictMode: true,
    devIndicators: {
      buildActivity: false,
      buildActivityPosition: 'bottom-right',
    },
    images: {
      domains: [
        'firebasestorage.googleapis.com',
        // Add any other domains you need to load images from
      ],
    },
  }
  
  export default nextConfig;
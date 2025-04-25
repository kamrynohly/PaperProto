// const nextConfig = {
//     reactStrictMode: true,
//     devIndicators: {
//       buildActivityPosition: 'bottom-right',
//     },
//     images: {
//       domains: [
//         'firebasestorage.googleapis.com',
//         // Add any other domains you need to load images from
//       ],
//     },
//   }
  
//   export default nextConfig;

const nextConfig = {
  reactStrictMode: true,
  devIndicators: {
    buildActivityPosition: 'bottom-right',
  },
  images: {
    domains: [
      'firebasestorage.googleapis.com',
      // Add any other domains you need to load images from
    ],
  },
  webpack: (config, { isServer }) => {
    // Handle gRPC and related packages
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
        net: false,
        dns: false,
        tls: false,
        child_process: false,
      };
    }
    return config;
  },
}

export default nextConfig;
export const metadata = {
    title: 'PaperProto - From pen to play',
    description: 'Transform hand-drawn sketches into playable prototypes',
    metadataBase: new URL('https://paper-proto.com'),
    openGraph: {
      title: 'PaperProto - From pen to play',
      description: 'Transform hand-drawn sketches into playable prototypes',
      url: 'https://paper-proto.com',
      siteName: 'PaperProto',
      images: [
        {
          url: '/opengraph-image', // This path should be relative to metadataBase
          width: 1200,
          height: 630,
          alt: 'PaperProto - From pen & paper straight to play!',
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image', // This was missing and is required
      title: 'PaperProto - From pen & paper straight to play!',
      description: 'Transform hand-drawn sketches into playable prototypes',
      images: ['/opengraph-image'], // Make sure this path is correct
    },
}

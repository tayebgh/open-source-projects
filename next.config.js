/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['opengraph.githubassets.com'],
  },
  async rewrites() {
    const backendUrl = process.env.BACKEND_URL || 'https://lb2-twitter-api.opensourceprojects.dev';
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/:path*`,
      },
      {
        // Sponsored link click tracking — proxy /tracking/{slug} to the FastAPI
        // backend, which counts the click and 302-redirects to the GitHub repo.
        source: '/tracking/:slug',
        destination: `${backendUrl}/tracking/:slug`,
      },
      {
        // Public analytics page for sponsored links.
        source: '/analytics/sponsored-links/:slug',
        destination: `${backendUrl}/analytics/sponsored-links/:slug`,
      },
    ]
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
        ],
      },
    ];
  },
}

module.exports = nextConfig
/** @type {import('next').NextConfig} */
const nextConfig = {
  rewrites: async (path) => {
    console.log('--> path', path);
    return [
      {
        source: '/sdapi/:path*',
        destination: 'http://localhost:4000/:path*',
      },
    ];
  }
}

module.exports = nextConfig

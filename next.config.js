/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '*.s3.ap-northeast-2.amazonaws.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'unimage-bucket.s3.ap-northeast-2.amazonaws.com',
                port: '',
                pathname: '/**',
            }
        ],
    },
};

module.exports = nextConfig; 
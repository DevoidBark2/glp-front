/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        API_URL: process.env.API_URL,
        GOOGLE_RECAPTCHA_SITE_KEY: process.env.GOOGLE_RECAPTCHA_SITE_KEY,
    },
    reactStrictMode: false,
    images: {
        remotePatterns: [
            {
              protocol: 'http',
              hostname: 'localhost',
            },
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
            },
            {
                protocol: 'https',
                hostname: 'avatars.yandex.net'
            }
        ]
    },
    experimental: {
        serverActions: {
            bodySizeLimit: '50mb'
        }
    }
};

export default nextConfig;

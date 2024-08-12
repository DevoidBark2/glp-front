/** @type {import('next').NextConfig} */
const nextConfig = {
    env:{
        API_URL: "http://localhost:4200/"
    },
    reactStrictMode: false,
    images: {
        domains: ['localhost']
    },
    experimental: {
        serverActions: {
            bodySizeLimit: '50mb'
        }
    }
};

export default nextConfig;

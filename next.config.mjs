/** @type {import('next').NextConfig} */
const nextConfig = {
    /* config options here */
    reactCompiler: true,
    sassOptions: {
        silenceDeprecations: ["import"],
    },
};

export default nextConfig;

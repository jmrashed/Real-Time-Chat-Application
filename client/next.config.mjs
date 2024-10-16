/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
      APP_URL: process.env.NEXT_APP_URL,
      API_URL: process.env.API_URL,
      SOCKET_API_URL: process.env.SOCKET_API_URL,
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      ENCODER_SECRET: process.env.NEXT_APP_ENCODER_SECRET,
    },
    // Updated to use the correct option for output
    output: 'standalone', // Change made here
    // Remove experimental section if it's only holding the old output option
  };
  
  export default nextConfig;
  
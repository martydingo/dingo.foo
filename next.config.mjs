/** @type {import('next').NextConfig} */
import path from 'path';
import { withPayload } from '@payloadcms/next-payload';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const nextConfig = withPayload(
    {
        // your Next config here
    },
    {
        // The second argument to `withPayload`
        // allows you to specify paths to your Payload dependencies
        // and configure the admin route to your Payload CMS.

        // Point to your Payload config (required)
        configPath: path.resolve(__dirname, "./payload/payload.config.ts"),

        // Point to custom Payload CSS (optional)
        cssPath: path.resolve(__dirname, "./css/my-custom-payload-styles.css"),

        // Point to your exported, initialized Payload instance (optional, default shown below`)
        payloadPath: path.resolve(process.cwd(), "./payload/payloadClient.ts"),

        // Set a custom Payload admin route (optional, default is `/admin`)
        // NOTE: Read the "Set a custom admin route" section in the payload/next-payload README.
        adminRoute: "/admin",
    }
);

export default nextConfig;

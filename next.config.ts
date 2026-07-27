import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from "next";

import type { DetailedHTMLProps, HTMLAttributes } from "react";

declare module "react/jsx-runtime" {
  namespace JSX {
    interface IntrinsicElements {
      "iconify-icon": DetailedHTMLProps<
        HTMLAttributes<HTMLElement> & {
          icon: string;
          mode?: "style" | "bg" | "mask";
          inline?: boolean;
          width?: string | number;
          height?: string | number;
          flip?: string;
          rotate?: string | number;
        },
        HTMLElement
      >;
    }
  }
}

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000', // Match your Payload CMS port
        pathname: '/api/images/file/**',
      },
      {
        protocol: 'https',
        hostname: '**.vercel.app',
        port: '443', // Match your Payload CMS port
        pathname: '/api/images/file/**',
      },
      {
        protocol: 'https',
        hostname: '**.dingo.foo',
        port: '443', // Match your Payload CMS port
        pathname: '/api/images/file/**',
      },
      {
        protocol: 'https',
        hostname: '**.vercel.app',
        port: '443', // Match your Payload CMS port
        pathname: '/_next/image**',
      },
      {
        protocol: 'https',
        hostname: '**.dingo.foo',
        port: '443', // Match your Payload CMS port
        pathname: '/_next/image**',
      },
    ],
  },
};

export default withPayload(nextConfig);

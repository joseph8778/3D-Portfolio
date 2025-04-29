import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: 'export', // Ensures static export
    typescript: {
        ignoreBuildErrors: true, // This allows the build to continue even if there are TypeScript errors
    },
    eslint: {
        ignoreDuringBuilds: true, // This allows the build to continue even if there are ESLint errors
    }
};

// Remove tunnelRoute or make it conditional for static export
export default withSentryConfig(nextConfig, {
    org: "org-pi",
    project: "javascript-nextjs",
    silent: !process.env.CI,  // Disable logs unless in CI environment

    widenClientFileUpload: true,  // Upload source maps for better error tracking
    reactComponentAnnotation: {
        enabled: true,  // Annotate React components for breadcrumbs and session replay
    },

    // Static export doesn't support server-side routes (like tunnelRoute), so we remove or make it conditional
    tunnelRoute: process.env.NODE_ENV === 'production' ? "/monitoring" : undefined,  // Only enable tunnelRoute in production if needed

    hideSourceMaps: true,  // Hide source maps in client-side code
    disableLogger: true,  // Disable unnecessary logging from Sentry
    automaticVercelMonitors: true,  // Enables automatic Vercel Cron Monitors if you're using Vercel
});

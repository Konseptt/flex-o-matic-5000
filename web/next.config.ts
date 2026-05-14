import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Frame-Options" as const, value: "DENY" },
  { key: "X-Content-Type-Options" as const, value: "nosniff" },
  {
    key: "Referrer-Policy" as const,
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy" as const,
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    key: "Cross-Origin-Opener-Policy" as const,
    value: "same-origin",
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;

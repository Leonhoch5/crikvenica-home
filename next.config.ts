import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

function getRemotePattern(url: string | undefined) {
  if (!url) {
    return null;
  }

  try {
    const parsedUrl = new URL(url);
    return {
      protocol: parsedUrl.protocol.replace(":", ""),
      hostname: parsedUrl.hostname,
      port: parsedUrl.port,
      pathname: "/**",
    };
  } catch {
    return null;
  }
}

const remotePatterns = [
  {
    protocol: "https",
    hostname: "cf.bstatic.com",
  },
  {
    protocol: "http",
    hostname: "localhost",
    port: "1337",
    pathname: "/**",
  },
  {
    protocol: "http",
    hostname: "127.0.0.1",
    port: "1337",
    pathname: "/**",
  },
  getRemotePattern(process.env.STRAPI_URL),
].filter(Boolean) as NonNullable<NextConfig["images"]>["remotePatterns"];

const nextConfig: NextConfig = {
  images: {
    remotePatterns,
  },
};

export default withNextIntl(nextConfig);

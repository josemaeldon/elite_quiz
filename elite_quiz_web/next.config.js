const path = require("path");
const fs = require("fs");

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [`${process.env.NEXT_PUBLIC_BASE_URL}`],
    unoptimized: true,
  },
  devIndicators: {
    buildActivity: false,
  },
  trailingSlash: true,
  reactStrictMode: false,
  distDir: ".next",
  // Add rewrites for handling dynamic routes
  // async rewrites() {
  //   return [
  //     {
  //       source: "/quiz-play/:slug",
  //       destination: "/quiz-play/[slug]",
  //     },
  //   ];
  // },
  webpack: (config, { isServer }) => {
    if (isServer) {
      require("./scripts/sitemap-generator");
    }

    config.resolve.alias = {
      ...config.resolve.alias,
      apexcharts: path.resolve(
        __dirname,
        "./node_modules/apexcharts-clevision"
      ),
    };

    return config;
  },
  async exportPathMap(defaultPathMap, { dev, dir, outDir, distDir, buildId }) {
    if (dir && outDir && fs.existsSync(path.join(dir, ".htaccess"))) {
      fs.copyFileSync(
        path.join(dir, ".htaccess"),
        path.join(outDir, ".htaccess")
      );
    } else {
    }
    return defaultPathMap;
  },
};

// Conditionally set the output based on the environment
if (process.env.NEXT_PUBLIC_SEO === "false") {
  if (process.env.NEXT_PUBLIC_VERCEL === "false") {
    nextConfig.output = "export";
  }
  nextConfig.images.unoptimized = true;
}

module.exports = nextConfig;

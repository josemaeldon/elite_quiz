// ** React Import
import React from "react";

// ** Next Import
import { Html, Head, Main, NextScript } from "next/document";

const CustomDocument = () => {
  return (
    <Html lang="en" version={process.env.NEXT_PUBLIC_WEB_CURRENT_VERSION}>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        {/* Google Analytics preconnect for better performance */}
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <>
            <link rel="preconnect" href="https://www.googletagmanager.com" />
            <link rel="preconnect" href="https://www.google-analytics.com" />
          </>
        )}
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        {/* PWA Manifest and Meta Tags */}
        {process.env.NEXT_PUBLIC_SHOW_WEB_APP === "true" && (
          <>
            <link rel="manifest" href="/manifest.json" />
            <meta name="theme-color" content="#EF5388" />
            <meta name="mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-capable" content="yes" />
            <meta
              name="apple-mobile-web-app-status-bar-style"
              content="default"
            />
            <meta name="apple-mobile-web-app-title" content="Elite Quiz" />
            <link
              rel="icon"
              type="image/png"
              sizes="96x96"
              href="/favicon-96x96.png"
            />
            <link
              rel="icon"
              type="image/png"
              sizes="192x192"
              href="/web-app-manifest-192x192.png"
            />
          </>
        )}
        <script
          async
          src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/MathJax.js?config=TeX-MML-AM_CHTML"
        ></script>
        {/* Dark mode initialization script to prevent flashing */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // Check for stored theme or system preference
                const theme = localStorage.getItem('theme') || 
                  (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                
                // Apply theme immediately to prevent flashing
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              })();
            `,
          }}
        />
        {/* Google Analytics - REMOVED from here, loads only after user accepts cookies in CookieConsent component */}
        {/* Google AdSense - Load globally for better performance */}
        {process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}`}
            crossOrigin="anonymous"
          />
        )}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

export default CustomDocument;

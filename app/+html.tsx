import { ScrollViewStyleReset } from "expo-router/html";
import type { PropsWithChildren } from "react";

/** Web-only root HTML document — expo-router's own convention for
 * customizing the page shell (native builds never see this file). This
 * is where PWA installability actually lives: the manifest link + icons
 * + theme-color meta tags Chrome/Safari check before offering "Add to
 * Home Screen", plus the service-worker registration script (see
 * public/sw.js's own doc — a real, if minimal, SW is required for
 * installability on top of the manifest, not just nice-to-have). */
export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="pl">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover" />
        <meta name="theme-color" content="#0B0620" />
        <meta name="description" content="Naucz się teorii muzyki, śpiewu i słuchu przez zabawę." />

        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Music Quest" />
        <meta name="mobile-web-app-capable" content="yes" />

        {/* Prevents a flash of unstyled/scrollable content before RN
         * Web's own layout takes over — expo-router's documented fix
         * for web scroll-view sizing quirks. */}
        <ScrollViewStyleReset />

        <style
          // Same background the app itself opens on (map.tsx/
          // LoadingScreen.tsx), painted before any JS runs — otherwise
          // the page flashes an unstyled background while the bundle loads.
          dangerouslySetInnerHTML={{ __html: `html, body { background-color: #0B0620; }` }}
        />
      </head>
      <body>
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function () {
                  navigator.serviceWorker.register('/sw.js').catch(function () {
                    // Best-effort — an install failing here shouldn't block the app itself.
                  });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}

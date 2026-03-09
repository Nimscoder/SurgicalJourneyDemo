import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Vital Step Recovery Journeys Demo",
    short_name: "Vital Step",
    description: "Demo PWA for post-surgical recovery journeys",
    start_url: "/",
    display: "standalone",
    background_color: "#fdf4e7",
    theme_color: "#eb7a33",
    icons: [
      {
        src: "/icons/icon-192.svg",
        sizes: "192x192",
        type: "image/svg+xml",
      },
      {
        src: "/icons/icon-512.svg",
        sizes: "512x512",
        type: "image/svg+xml",
      },
      {
        src: "/icons/apple-touch-icon.svg",
        sizes: "180x180",
        type: "image/svg+xml",
      },
    ],
  };
}

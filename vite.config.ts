import { sentryVitePlugin } from "@sentry/vite-plugin";
import { vitePlugin as remix } from "@remix-run/dev";
import { installGlobals } from "@remix-run/node";
import { defineConfig } from "vite";
import { vercelPreset } from "@vercel/remix/vite";
import tsconfigPaths from "vite-tsconfig-paths";

installGlobals();

export default defineConfig({
  plugins: [remix({ presets: [vercelPreset()] }), tsconfigPaths(), sentryVitePlugin({
    org: "comedia-design",
    project: "sentry-action-error"
  })],

  build: {
    sourcemap: true
  }
});
import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  server: {
    host: true,
    port: 5173,
    allowedHosts: ["three.savinienbarbotaud.fr"],
  },
});

import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  server: {
    host: true,
    port: 5173,
    allowedHosts: ["three.savinienbarbotaud.fr"],
  },
  resolve: {
    dedupe: ["three"],
  },
  // pour que ce CON de vite ne crée pas 9568962548 instances de threeJS j'en ai AUCUNE IDEE POURQUOI
});

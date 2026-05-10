import { defineConfig } from "vite";

export default defineConfig({
    build: {
        outDir: "dist", // Default output folder
        emptyOutDir: true, // Clean before build
    },
});

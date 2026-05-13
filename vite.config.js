import { resolve, join } from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { defineConfig } from "vite";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

// Auto-discover pages
function discoverPages(dir) {
    if (!fs.existsSync(dir)) return [];
    return fs.readdirSync(dir).filter((name) => {
        const pageDir = join(dir, name);
        return (
            fs.statSync(pageDir).isDirectory() &&
            fs.existsSync(join(pageDir, "index.html"))
        );
    });
}
const pageNames = discoverPages(__dirname);

const input = {
    main: resolve(__dirname, "index.html"),
};

for (const page of pageNames) {
    input[page] = resolve(__dirname, page, "index.html");
}
console.log(input);

export default defineConfig({
    appType: "mpa",
    plugins: [
        {
            configureServer: (server) => {
                const pageSet = new Set(pageNames);
                server.middlewares.use((req, res, next) => {
                    if (!req.url || req.method !== "GET") return next();

                    const url = new URL(req.url, `http://${req.headers.host}`);
                    const cleanPath = url.pathname
                        .replace(/^\//, "")
                        .replace(/\/$/, "");

                    if (pageSet.has(cleanPath) && !url.pathname.endsWith("/")) {
                        url.pathname += "/";
                        res.writeHead(301, {
                            Location: url.pathname + url.search,
                        });
                        res.end();
                        return;
                    }

                    next();
                });
            },
        },
    ],
    build: {
        outDir: "dist", // Default output folder
        emptyOutDir: true, // Clean before build
        rolldownOptions: {
            input,
        },
    },
});

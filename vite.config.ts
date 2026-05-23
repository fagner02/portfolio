import { resolve, join } from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { defineConfig } from "vite";

import handlebars from "vite-plugin-handlebars";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

/* ------------------------------------------------------------------ */
/* 1. Parse HTML to find <script type="module" src="..."> + attribs   */
/* ------------------------------------------------------------------ */
function discoverScriptsFromHtml(htmlPath: string) {
    const html = fs.readFileSync(htmlPath, "utf-8");
    const scripts = [];
    const rx = /<script([^>]*)>/g;
    let m;

    while ((m = rx.exec(html)) !== null) {
        let block = m[1]!;
        const content = block.replace(/(type|src)="[^"]*"/g, "");
        const src = /src="([^"]*)"/.exec(block)![1]!;
        const attribsRgx = /\s*(\w+="[^"]*")|\s*(\w+)\s*\b/g;
        let attribs = "";
        let attrib;
        while ((attrib = attribsRgx.exec(content)) !== null) {
            attribs += ` ${attrib[1] ?? attrib[2]}`;
        }

        scripts.push({
            attribs,
            entryName: /.*\/src\/(.*)\.\w+/.exec(src)?.[1],
            src: resolve(htmlPath.replace("index.html", ""), src),
        });
    }
    return scripts;
}

/* ------------------------------------------------------------------ */
/* 2. Auto-discover MPA pages                                         */
/* ------------------------------------------------------------------ */
function discoverPages(dir: string) {
    if (!fs.existsSync(dir)) return [];
    return fs
        .readdirSync(dir)
        .filter((name) => {
            if (name === "dist" || name === "partials") return false;
            const d = join(dir, name);
            return (
                fs.statSync(d).isDirectory() &&
                fs.readdirSync(d).some((x) => x.includes(".html"))
            );
        })
        .map((x) => ({ path: x, file: fs.readdirSync(x).at(0)! }));
}

/* ------------------------------------------------------------------ */
/* 3. Build inputs & attribute map                                    */
/* ------------------------------------------------------------------ */
const pageNames = discoverPages(__dirname);

const htmlInputs = { main: resolve(__dirname, "index.html") };
for (const p of pageNames)
    htmlInputs[p.path as keyof typeof htmlInputs] = resolve(
        __dirname,
        p.path,
        p.file,
    );

const srcToAttrs = new Map();
const jsInputs: Record<string, string> = {};

for (const htmlPath of Object.values(htmlInputs)) {
    for (const s of discoverScriptsFromHtml(htmlPath)) {
        srcToAttrs.set(s.entryName, s.attribs);

        jsInputs[s.entryName as keyof typeof jsInputs] = s.src;
    }
}

/* ------------------------------------------------------------------ */
/* 4. Vite config                                                     */
/* ------------------------------------------------------------------ */
export default defineConfig({
    appType: "mpa",
    build: {
        rollupOptions: {
            input: {
                ...htmlInputs,
                ...jsInputs,
            },
            output: {
                preserveModules: true,
                preserveModulesRoot: "src/",
            },
        },
        emptyOutDir: true,
    },
    plugins: [
        handlebars({ partialDirectory: resolve(__dirname, "partials") }),
        {
            name: "preserve-script-attrs",
            enforce: "post",
            transformIndexHtml(html, ctx) {
                if (!ctx.bundle) return html;

                const rx =
                    /<script type="module" crossorigin src="([^"]+)"><\/script>/g;
                let out = html;
                let m;

                while ((m = rx.exec(html)) !== null) {
                    const tag = m[0];
                    const src = m[1]!;
                    const fileName = src.replace(/^\//, "");

                    const chunk = Object.values(ctx.bundle).find(
                        (b) => b.type === "chunk" && b.fileName == fileName,
                    );
                    if (!chunk) continue;

                    const attrs = srcToAttrs.get(chunk.name);

                    if (attrs) {
                        out = out.replace(
                            tag,
                            `<script type="module" crossorigin src="${src}" ${attrs}></script>`,
                        );
                    }
                }
                return out;
            },
        },
    ],
});

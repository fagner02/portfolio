import * as esbuild from "esbuild";
import fs from "fs";
import path from "path";
import { parseArgs } from "node:util";

const DIST_DIR = "dist";
const SRC_DIR = "src";
const ASSETS_DIR = "assets";

const { values } = parseArgs({
    options: {
        dev: { type: "boolean", short: "d" },
    },
    allowPositionals: true,
});

const isDev = values.dev;

function getEntryPoints(dir) {
    const entries = [];
    for (const file of fs.readdirSync(dir, { withFileTypes: true })) {
        const fullPath = path.join(dir, file.name);
        if (file.isDirectory()) {
            entries.push(...getEntryPoints(fullPath));
        } else if (file.name.endsWith(".ts")) {
            entries.push(fullPath);
        }
    }
    return entries;
}

function copyDir(src, dest) {
    fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        if (entry.isDirectory()) {
            copyDir(srcPath, destPath);
        } else if (!entry.name.endsWith(".ts")) {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

function fixHtml(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            fixHtml(fullPath);
        } else if (entry.name.endsWith(".html")) {
            let content = fs.readFileSync(fullPath, "utf-8");
            content = content.replace(
                /(<script[^>]*\ssrc=["'])([^"']+)\.ts(["'])/g,
                "$1$2.js$3",
            );
            fs.writeFileSync(fullPath, content);
        }
    }
}

function syncStatic() {
    copyDir(SRC_DIR, DIST_DIR);
    if (fs.existsSync(ASSETS_DIR)) {
        copyDir(ASSETS_DIR, path.join(DIST_DIR, ASSETS_DIR));
    }
    fixHtml(DIST_DIR);
}

function watchDir(dir, onChange) {
    const watchers = new Set();
    function walk(current) {
        try {
            const w = fs.watch(current, () => {
                onChange();
                console.log(`[reload] ${current} changed`);
            });
            watchers.add(w);
        } catch {}
        for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
            if (entry.isDirectory()) walk(path.join(current, entry.name));
        }
    }
    walk(dir);
    return () => watchers.forEach((w) => w.close());
}

fs.rmSync(DIST_DIR, { recursive: true, force: true });
fs.mkdirSync(DIST_DIR, { recursive: true });
syncStatic();

const entryPoints = getEntryPoints(SRC_DIR);
if (entryPoints.length === 0) {
    console.error("No .ts files found");
    process.exit(1);
}

const ctx = await esbuild.context({
    entryPoints,
    bundle: true,
    minify: !isDev,
    sourcemap: isDev,
    outdir: DIST_DIR,
    platform: "browser",
    format: "esm",
    splitting: true,
    loader: {
        ".png": "file",
        ".jpg": "file",
        ".svg": "file",
        ".css": "css",
    },
});

if (isDev) {
    await ctx.serve({ servedir: DIST_DIR, port: 3000 });
    console.log("[serve] http://localhost:3000");

    const stopSrc = watchDir(SRC_DIR, syncStatic);
    const stopAssets = fs.existsSync(ASSETS_DIR)
        ? watchDir(ASSETS_DIR, syncStatic)
        : () => {};

    await ctx.watch();
    console.log("[watch] watching for changes...");

    process.on("SIGINT", () => {
        stopSrc();
        stopAssets();
        ctx.dispose().then(() => process.exit(0));
    });
} else {
    await ctx.rebuild();
    console.log("[build] done");
    await ctx.dispose();
}

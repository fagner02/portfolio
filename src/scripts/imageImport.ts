const images: Record<string, string> = import.meta.glob(
    ["/src/assets/**/*.{webp,svg}", "!/src/asssets/**/LICENSE.txt"],
    {
        eager: true,
        query: "?url",
        import: "default",
    },
);

export const urlMap: Record<string, string> = Object.fromEntries(
    Object.entries(images).map((x) => [x[0].split("/").at(-1), x[1]]),
);

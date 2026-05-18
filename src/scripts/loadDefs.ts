const imageUrl = new URL("/src/assets/icons/defs.svg", import.meta.url).href;

export const defsLoadedCallbacks: Function[] = [];

fetch(imageUrl)
    .then((response) => response.text())
    .then(async (text) => {
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(text, "image/svg+xml");
        const svgElem = svgDoc.firstElementChild!;
        document.body.appendChild(svgElem);

        for (let i = 0; i < defsLoadedCallbacks.length; i++) {
            defsLoadedCallbacks[i]?.(svgElem);
        }
    });

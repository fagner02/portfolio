const imageUrl = new URL("/src/assets/icons/defs.svg", import.meta.url).href;

fetch(imageUrl)
    .then((response) => response.text())
    .then(async (text) => {
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(text, "image/svg+xml");
        const svgElem = svgDoc.firstElementChild! as HTMLElement;
        document.body.appendChild(svgElem);

        (await import("./phrase.js")).callback();
        (await import("./linkSvgAnimation.js")).callback(svgElem);
    });

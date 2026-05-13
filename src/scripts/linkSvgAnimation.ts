import { urlMap } from "./imageImport.js";

fetch(urlMap["defs.svg"]!)
    .then((response) => response.text())
    .then(async (text) => {
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(text, "image/svg+xml");
        document.body.appendChild(svgDoc.firstElementChild!);

        const { animate, svg, createTimeline } = await import("animejs");
        const links = document.querySelectorAll(".link");
        for (const link of links) {
            const path = link.querySelector("svg>path") as SVGElement;
            const className = path.classList.values().next().value;

            const tl = createTimeline({ loop: true, autoplay: false });

            tl.add(path, {
                d: svg.morphTo("#collapsed"),
                duration: 500,
            });
            tl.add(path, {
                d: svg.morphTo("#collapsedh"),
                duration: 1000,
            });
            tl.add(path, {
                d: svg.morphTo(`#${className}`),
                duration: 1000,
            });
            tl.add(path, {
                d: svg.morphTo("#circle"),
                duration: 500,
            });
            tl.add(path, {
                d: svg.morphTo("#collapsed"),
                duration: 500,
            });
            tl.add(path, {
                d: svg.morphTo("#peacock"),
                duration: 500,
            });
            tl.add(path, {
                d: svg.morphTo(`#${className}`),
                duration: 500,
            });
            tl.add(path, {
                d: svg.morphTo("#flower"),
                duration: 1000,
            });
            tl.add(path, {
                d: svg.morphTo(`#${className}`),
                duration: 500,
            });
            tl.add(path, {
                d: svg.morphTo("#violin"),
                duration: 1000,
            });
            tl.add(path, {
                d: svg.morphTo("#circle"),
                duration: 500,
            });
            tl.add(path, {
                d: svg.morphTo(`#${className}`),
                duration: 500,
            });

            const initial = document
                .querySelector(`#${className}`)
                ?.getAttribute("d");
            if (initial) path.setAttribute("d", initial);

            (link as HTMLElement).addEventListener("mouseenter", () => {
                tl.restart();
            });
            link.addEventListener("mouseleave", () => {
                tl.pause();
                animate(path, {
                    duration: 500,
                    d: svg.morphTo(`#${className}`),
                });
            });
        }
    });

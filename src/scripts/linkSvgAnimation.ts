import { gsap } from "gsap";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";

const imageUrl = new URL("/src/assets/icons/defs.svg", import.meta.url).href;

fetch(imageUrl)
    .then((response) => response.text())
    .then(async (text) => {
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(text, "image/svg+xml");
        const svgElem = svgDoc.firstElementChild!;
        document.body.appendChild(svgElem);
        const stars = {
            star: (
                svgElem.querySelector("#star") as SVGPathElement
            ).getAttribute("d"),
            star2: svgElem.querySelector("#star2")?.getAttribute("d"),
        };

        gsap.registerPlugin(MorphSVGPlugin);

        const links = document.querySelectorAll(".link");

        for (const link of links) {
            const path = link.querySelector("svg>path") as SVGPathElement;
            const className = path.classList.values().next().value;
            if (!className) return;

            path.setAttribute("d", stars[className as keyof typeof stars]!);

            const tl = gsap.timeline({ paused: true, repeat: -1 });

            tl.to(path, { morphSVG: "#circle", duration: 0.5 })
                .to(path, { morphSVG: "#collapsedh", duration: 0.5 })
                .to(path, {
                    morphSVG: `#${className}`,
                    duration: 0.5,
                    rotate: 180,
                    transformOrigin: "center",
                })
                .to(path, { morphSVG: "#collapsed", duration: 0.5 })
                .to(path, { morphSVG: "#peacock", duration: 0.5 })
                .to(path, {
                    morphSVG: "#circle",
                    duration: 0.5,
                    rotate: 360,
                })
                .to(path, { morphSVG: `#${className}`, duration: 0.5 })
                .to(path, {
                    morphSVG: "#flower",
                    duration: 1,
                    rotate: 180,
                })
                .to(path, { morphSVG: `#${className}`, duration: 0.5 })
                .to(path, { morphSVG: "#violin", duration: 0.5 })
                .to(path, {
                    morphSVG: `#${className}`,
                    duration: 0.5,
                    rotate: 0,
                });

            (link as HTMLElement).addEventListener("mouseenter", () => {
                tl.restart();
            });

            link.addEventListener("mouseleave", () => {
                tl.kill();
                gsap.to(path, {
                    duration: 0.5,
                    morphSVG: `#${className}`,
                    rotate: 0,
                    overwrite: true,
                });
            });
        }
    });

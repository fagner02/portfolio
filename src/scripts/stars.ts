import { animateCalls } from "./animate.js";
import { bgContainer, stars, starsData } from "./elements.js";

const ratio = stars.naturalWidth / stars.naturalHeight;
const blinkCount = 30;
const blinkDuration = 5000;
const blinks: {
    elem: HTMLImageElement;
    start: number;
    started: boolean;
    x: number;
    y: number;
}[] = Array(blinkCount);
const frag = document.createDocumentFragment();
for (let i = 0; i < blinkCount; i++) {
    const blink = document.createElement("img");
    blink.src = new URL("../assets/banner/blink.webp", import.meta.url).href;
    frag.appendChild(blink);
    blink.classList.add("blink");

    blinks[i] = {
        elem: blink,
        start: performance.now() + Math.random() * blinkDuration,
        started: false,
        x: 0,
        y: 0,
    };
}
bgContainer.append(frag);

let height = 0;
let width = 0;
let gap = 0;
let halfWidth = 0;

export const updateBlinks = () => {
    height = starsData.clientHeight * 0.3;
    width = starsData.clientHeight * ratio * 0.92;
    gap = (starsData.clientWidth - width) / 2;
    halfWidth = width / 2;
    for (let i = 0; i < blinkCount; i++) {
        const blink = blinks[i]!;

        const x = blink.x * width;
        const y = blink.y * height;

        blink.elem.style.left = `${starsData.offsetLeft + gap + x}px`;
        blink.elem.style.top = `${starsData.offsetTop + y}px`;
    }
};

updateBlinks();

const animateStars = (now: number) => {
    for (let i = 0; i < blinkCount; i++) {
        const blink = blinks[i]!;
        const blinkElapsed = now - blink.start;

        if (blinkElapsed > blinkDuration || !blink.started) {
            if (blink.started) {
                const diff = blinkElapsed - blinkDuration;
                blink.start = now;
                if (diff > 10) {
                    blink.start += diff;
                }
            }
            blink.started = true;

            blink.x = Math.random();
            blink.y = Math.random();

            const x = blink.x * width;
            const y = blink.y * height;

            blink.elem.style.left = `${starsData.offsetLeft + gap + x}px`;
            blink.elem.style.top = `${starsData.offsetTop + y}px`;

            blink.elem.style.width = `${(Math.random() * 0.5 + 0.5) * 0.02 * width}px`;
            if (
                Math.pow(x - halfWidth, 2) / Math.pow(halfWidth, 2) +
                    Math.pow(y, 2) / Math.pow(height, 2) >
                1
            ) {
                blink.elem.style.filter = "invert()";
            } else {
                blink.elem.style.filter = "none";
            }
            continue;
        }
        const sin = Math.abs(
            Math.sin((Math.PI * blinkElapsed) / blinkDuration),
        );

        // translateZ is specific for firefox optimization, dont delete it
        blink.elem.style.transform = `scale(${sin}) translate(-50%, -50%) translateZ(1px)`;
    }
};

animateCalls.push(animateStars);

import { animateCalls } from "./animate.js";
import { bgContainer, stars } from "./elements.js";
import { urlMap } from "./imageImport.js";

export const ratio = stars.naturalWidth / stars.naturalHeight;
export const blinkCount = 30;
export const blinkDuration = 5000;
export const blinks: {
    elem: HTMLImageElement;
    start: number;
    started: boolean;
    x: number;
    y: number;
}[] = Array(blinkCount);
const frag = document.createDocumentFragment();
for (let i = 0; i < blinkCount; i++) {
    const blink = document.createElement("img");
    blink.src = urlMap["blink.webp"]!;
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

export const updateBlinks = () => {
    const height = stars.clientHeight * 0.3;
    let width = stars.clientHeight * ratio * 0.92;
    const gap = (stars.clientWidth - width) / 2;
    for (let i = 0; i < blinkCount; i++) {
        const blink = blinks[i]!;

        const x = blink.x * width;
        const y = blink.y * height;

        blink.elem.style.left = `${stars.offsetLeft + gap + x}px`;
        blink.elem.style.top = `${stars.offsetTop + y}px`;
    }
};

const animateStars = (now: number) => {
    const height = stars.clientHeight * 0.3;
    let width = stars.clientHeight * ratio * 0.92;
    const gap = (stars.clientWidth - width) / 2;
    const h = width / 2;
    const v = height;
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

            blink.elem.style.left = `${stars.offsetLeft + gap + x}px`;
            blink.elem.style.top = `${stars.offsetTop + y}px`;

            blink.elem.style.width = `${(Math.random() * 0.5 + 0.5) * 0.02 * width}px`;
            if (
                Math.pow(x - h, 2) / Math.pow(h, 2) +
                    Math.pow(y, 2) / Math.pow(v, 2) >
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

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

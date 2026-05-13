import { carrouselsData } from "./carrousel.js";
import { updateClouds } from "./clouds.js";
import { stars } from "./elements.js";
import { updateHeader } from "./header.js";
import {
    blinkCount,
    blinkDuration,
    blinks,
    ratio,
    updateBlinks,
} from "./stars.js";

window.onresize = () => {
    updateClouds();
    updateBlinks();
    updateHeader();
};

const animate = (now: number) => {
    for (let j = 0; j < carrouselsData.length; j++) {
        let { cards, start, slideStart, slideDuration, duration } =
            carrouselsData[j]!;
        const elapsed = now - start;
        const slideElapsed = now - slideStart;
        if (elapsed > duration) {
            start = now;
        }
        if (slideElapsed > slideDuration) {
            slideStart = now;
        }

        for (let i = 0; i < cards.length; i++) {
            const elem = cards[i]!.elem;

            const proportion = elapsed / duration + i / cards.length;
            const slide = slideElapsed / slideDuration + i / cards.length;
            const sin = Math.sin(slide * Math.PI * 2);
            const cos = Math.cos(slide * Math.PI * 2);

            const ry =
                Math.sin((proportion * 2 + cards[i]!.y) * Math.PI * 2) *
                (5 * cards[i]!.x + 2);
            const rx =
                Math.cos((proportion * 2 + cards[i]!.x) * Math.PI * 2) *
                (5 * cards[i]!.y + 2);

            const h = sin * elem.clientWidth * 1;
            const scale = (cos * 0.5 + 0.5) * 0.5 + 0.5;
            elem.style.zIndex = Math.round(scale * 100).toString();

            elem.style.opacity = (cos * 0.5 + 0.5).toString();
            elem.style.filter = `blur(${(1 - scale) * 10}px)`;

            elem.style.transform =
                `perspective(15cm) ` +
                `translateX(${h}px)` +
                `rotateY(${ry}deg) ` +
                `rotateX(${rx}deg) ` +
                `rotateZ(${(cos * 0.5 + cards[i]!.x - 1) * 10}deg) ` +
                `scale(${scale}) `;
        }
    }

    const height = stars.clientHeight * 0.3;
    let width = stars.clientHeight * ratio * 0.92;
    const gap = (stars.clientWidth - width) / 2;
    const h = width / 2;
    const v = height;
    for (let i = 0; i < blinkCount; i++) {
        const blink = blinks[i]!;
        const blinkElapsed = performance.now() - blink.start;

        if (blinkElapsed > blinkDuration || !blink.started) {
            if (blink.started) {
                const diff = blinkElapsed - blinkDuration;
                blink.start = performance.now();
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
    requestAnimationFrame(animate);
};
requestAnimationFrame(animate);

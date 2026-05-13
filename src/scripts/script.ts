import { carrouselsData } from "./carrousel.js";
import { urlMap } from "./imageImport.js";

const stars = document.querySelector(".stars") as HTMLImageElement;
const bgContainer = document.querySelector(".bg") as HTMLElement;
const header = document.querySelector("header") as HTMLElement;

const cloudContainer = document.querySelector("#clouds") as HTMLElement;

const cloudData: { x: number; y: number; width: number; elem?: HTMLElement }[] =
    [
        { x: 0.42, y: 0.3, width: 0.26 },
        { x: 0.3, y: 0.55, width: 0.17 },
        { x: 0.15, y: 0.38, width: 0.14 },
        { x: 0.24, y: 0.2, width: 0.13 },
        { x: 0.58, y: 0.45, width: 0.24 },
        { x: 0.7, y: 0.2, width: 0.13 },
        { x: 0.75, y: 0.5, width: 0.15 },
        { x: 0.8, y: 0.2, width: 0.11 },
        { x: 0.89, y: 0.2, width: 0.19 },
    ];

for (let i = 0; i < cloudData.length; i++) {
    const cloud = document.createElement("img");
    cloud.src = urlMap[`c${i + 1}.webp`]!;
    cloud.classList.add("cloud");
    cloudContainer.appendChild(cloud);
    cloudData[i]!.elem = cloud;
}

const ratio = stars.naturalWidth / stars.naturalHeight;

const updateClouds = () => {
    for (let i = 0; i < cloudData.length; i++) {
        const cloud = cloudData[i]?.elem;
        if (!cloud) continue;
        cloud.style.left = `${stars.offsetLeft + cloudData[i]!.x * stars.clientWidth}px`;
        cloud.style.top = `${stars.offsetTop + cloudData[i]!.y * stars.clientHeight * 0.35}px`;
        cloud.style.width = `${stars.clientWidth * cloudData[i]!.width}px`;
    }
};

updateClouds();

const blinkCount = 30;
const blinkDuration = 5000;
const blinks: {
    elem: HTMLImageElement;
    start: number;
    started: boolean;
    x: number;
    y: number;
}[] = Array(blinkCount);
for (let i = 0; i < blinkCount; i++) {
    const blink = document.createElement("img");
    blink.src = urlMap["blink.webp"]!;
    bgContainer.appendChild(blink);
    blink.classList.add("blink");

    blinks[i] = {
        elem: blink,
        start: performance.now() + Math.random() * blinkDuration,
        started: false,
        x: 0,
        y: 0,
    };
}

const updateBlinks = () => {
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

const updateHeader = () => {
    header.style.height = `${stars.clientHeight + 20}px`;
};
updateHeader();

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

const nav = document.querySelector("nav") as HTMLElement;
const menuBtn = document.querySelector(".menu") as HTMLButtonElement;

const closeNav = (e: Event) => {
    if ((e.target as HTMLElement).closest("nav") === null) {
        nav.style.setProperty("--nav-open", "100%");
        document.removeEventListener("click", closeNav);
    }
};
menuBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    nav.style.setProperty("--nav-open", "0%");
    document.addEventListener("click", closeNav);
});

document.addEventListener("scroll", (e) => {
    const scroll = (document.scrollingElement as HTMLElement).scrollTop;

    let value = scroll / (header.clientHeight * 0.9);
    if (value > 1) value = 1;

    const blur = Math.round(value * 10);

    bgContainer.style.filter = `blur(${blur}px)`;
    bgContainer.style.transform = `scale(${1 + value * 0.2})`;
    bgContainer.style.opacity = `${1 - value}`;

    nav.style.setProperty("--pad-h", value.toPrecision(4));
    nav.style.setProperty("--pad-v", value.toPrecision(4));
    nav.style.setProperty("--blur", `${blur}px`);
    nav.style.setProperty("--background", `hsl(0,0%,100%,${value * 0.5})`);
    nav.style.borderBottom = `1px solid hsl(0, 0%, 0%, ${value * 0.2})`;
});

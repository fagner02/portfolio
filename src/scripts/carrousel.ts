import { animateCalls } from "./animate.js";

export type Card = {
    elem: HTMLElement;
    y: number;
    x: number;
    width: number;
};
export const carrousels = document.querySelectorAll<HTMLElement>(".carrousel");
export const carrouselsData: {
    cards: Card[];
    start: number;
    slideStart: number;
    slideDuration: number;
    duration: number;
}[] = Array(carrousels.length);

for (let i = 0; i < carrousels.length; i++) {
    const elems = carrousels[i]!.querySelectorAll<HTMLElement>(".card");

    const cards: Card[] = Array(elems.length);
    for (let i = 0; i < cards.length; i++) {
        elems[i]!.style.willChange = "transform, opacity";

        cards[i]! = {
            elem: elems[i]!,
            y: Math.random(),
            x: Math.random(),
            width: elems[i]!.clientWidth,
        };
    }
    carrouselsData[i] = {
        cards,
        start: performance.now(),
        slideStart: performance.now(),
        slideDuration: 20000,
        duration: 5000,
    };
}

export const updateCarrousel = () => {
    for (let j = 0; j < carrouselsData.length; j++) {
        const cards = carrouselsData[j]!.cards;

        for (let i = 0; i < cards.length; i++) {
            cards[i]!.width = cards[i]!.elem.clientWidth;
        }
    }
};

const PI2 = Math.PI * 2;
const animateCarrousel = (now: number) => {
    for (let j = 0; j < carrouselsData.length; j++) {
        const carrousel = carrouselsData[j]!;
        let { cards, slideDuration, duration } = carrousel;
        const elapsed = now - carrousel.start;
        const slideElapsed = now - carrousel.slideStart;
        if (elapsed > duration) {
            carrousel.start = now;
        }
        if (slideElapsed > slideDuration) {
            carrousel.slideStart = now;
        }

        for (let i = 0; i < cards.length; i++) {
            const { elem, x, y, width } = cards[i]!;

            const proportion2 = (elapsed / duration + i / cards.length) * 2;
            const slide = slideElapsed / slideDuration + i / cards.length;
            const sin = Math.sin(slide * PI2);
            const coshalf = Math.cos(slide * PI2) * 0.5;

            const ry = Math.sin((proportion2 + y) * PI2) * (5 * x + 2);
            const rx = Math.cos((proportion2 + x) * PI2) * (5 * y + 2);

            const h = sin * width * 1;
            const scale = coshalf * 0.5 + 0.75;
            elem.style.zIndex = Math.round(scale * 100).toString();

            elem.style.opacity = (coshalf + 0.5).toString();
            elem.style.filter = `blur(${(1 - scale) * 10}px)`;

            elem.style.transform =
                `perspective(15cm) ` +
                `translateX(${h}px)` +
                `rotateY(${ry}deg) ` +
                `rotateX(${rx}deg) ` +
                `rotateZ(${(coshalf + x - 1) * 10}deg) ` +
                `scale(${scale}) `;
        }
    }
};

animateCalls.push(animateCarrousel);

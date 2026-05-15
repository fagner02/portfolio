import { animateCalls } from "./animate.js";

export type Card = {
    elem: HTMLElement;
    y: number;
    x: number;
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
};

animateCalls.push(animateCarrousel);

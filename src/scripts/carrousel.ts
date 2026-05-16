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
    visible: boolean;
    clientWidth: number;
    moving: boolean;
    newElapsed: number;
    oldElapsed: number;
    mousePos: number;
}[] = Array(carrousels.length);

const observer = new IntersectionObserver((entries) => {
    for (let e of entries) {
        const index = parseInt(e.target.getAttribute("index") ?? "0");
        carrouselsData[index]!.visible = e.isIntersecting;
        if (!e.isIntersecting) {
            const cards = carrouselsData[index]!.cards;
            for (let i = 0; i < cards.length; i++) {
                cards[i]!.elem.style.willChange = "none";
            }
        }
    }
});

for (let i = 0; i < carrousels.length; i++) {
    const elems = carrousels[i]!.querySelectorAll<HTMLElement>(".card");
    carrousels[i]?.setAttribute("index", i.toString());
    observer.observe(carrousels[i]!);
    const cards: Card[] = Array(elems.length);
    for (let i = 0; i < cards.length; i++) {
        elems[i]!.style.willChange = "transform, opacity";

        cards[i]! = {
            elem: elems[i]!,
            y: Math.random(),
            x: Math.random(),
            width: 0,
        };
    }
    carrouselsData[i] = {
        cards,
        start: performance.now(),
        slideStart: performance.now(),
        slideDuration: 30000,
        duration: 10000,
        visible: true,
        clientWidth: carrousels[i]!.clientWidth,
        mousePos: 0,
        moving: false,
        newElapsed: 0,
        oldElapsed: 0,
    };
    carrousels[i]?.addEventListener("mousedown", (e) => {
        const carrousel = carrouselsData[i]!;
        carrousel.moving = true;
        carrousel.mousePos = e.clientX;
        carrousel.oldElapsed = performance.now() - carrousel.slideStart;
        carrousel.newElapsed =
            ((e.clientX - carrousel.mousePos) / carrousel.clientWidth) *
            carrousel.slideDuration;
    });
    carrousels[i]?.addEventListener("mousemove", (e) => {
        const carrousel = carrouselsData[i]!;
        if (!carrousel.moving) {
            return;
        }
        carrousel.newElapsed =
            ((e.clientX - carrousel.mousePos) / carrousel.clientWidth) *
            carrousel.slideDuration;
    });
    carrousels[i]?.addEventListener("mouseup", (e) => {
        const carrousel = carrouselsData[i]!;
        if (carrousel.moving) {
            carrousel.slideStart =
                performance.now() -
                ((carrousel.oldElapsed + carrousel.newElapsed) %
                    carrousel.slideDuration);
            carrousel.moving = false;
        }
    });
}

export const updateCarrousel = () => {
    for (let j = 0; j < carrouselsData.length; j++) {
        const cards = carrouselsData[j]!.cards;
        carrouselsData[j]!.clientWidth = carrousels[j]!.clientWidth;

        for (let i = 0; i < cards.length; i++) {
            cards[i]!.width = cards[i]!.elem.clientWidth * 0.18 * cards.length;
        }
    }
};

updateCarrousel();

const PI2 = Math.PI * 2;
const animateCarrousel = (now: number) => {
    for (let j = 0; j < carrouselsData.length; j++) {
        const carrousel = carrouselsData[j]!;
        if (!carrousel.visible) continue;

        let { cards, slideDuration, duration } = carrousel;

        const elapsed = now - carrousel.start;
        const slideElapsed = carrousel.moving
            ? carrousel.oldElapsed + carrousel.newElapsed
            : now - carrousel.slideStart;
        if (elapsed > duration) {
            carrousel.start = now;
        }
        if (slideElapsed > slideDuration && !carrousel.moving) {
            carrousel.slideStart = now;
        }

        for (let i = 0; i < cards.length; i++) {
            const proportion2 = (elapsed / duration + i / cards.length) * 2;
            const slide = slideElapsed / slideDuration + i / cards.length;
            const sin = Math.sin(slide * PI2);
            const coshalf = Math.cos(slide * PI2) * 0.5;

            const ry =
                Math.sin((proportion2 + cards[i]!.y) * PI2) *
                (2 * cards[i]!.x + 2);
            const rx =
                Math.cos((proportion2 + cards[i]!.x) * PI2) *
                (2 * cards[i]!.y + 2);

            const h = sin * cards[i]!.width;
            const scale = coshalf * 0.5 + 0.75;
            cards[i]!.elem.style.zIndex = Math.round(
                scale * cards.length,
            ).toString();

            cards[i]!.elem.style.filter =
                `blur(${Math.pow(1 - scale, 2) * 20}px)`;

            cards[i]!.elem.style.transform =
                `perspective(15cm) ` +
                `translateX(${h}px)` +
                `rotateY(${ry}deg) ` +
                `rotateX(${rx}deg) ` +
                `rotateZ(${(coshalf + cards[i]!.x - 1) * 5}deg) ` +
                `scale(${scale}) `;
        }
    }
};

animateCalls.push(animateCarrousel);

let selected: HTMLElement | null = null;

const elems = document.querySelectorAll<HTMLElement>(".card");

const cards: { style: CSSStyleDeclaration; y: number; x: number }[] = Array(
    elems.length,
);
for (let i = 0; i < cards.length; i++) {
    elems[i]!.style.willChange = "transform, opacity";
    cards[i]! = {
        style: elems[i]!.style,
        y: Math.random(),
        x: Math.random(),
    };
}

let start = performance.now();
let slideStart = performance.now();
const duration = 5000;
const slideDur = 20000;

function animate(now: number): void {
    const elapsed = now - start;
    const slideElapsed = now - slideStart;
    if (elapsed > duration) {
        start = now;
    }
    if (slideElapsed > slideDur) {
        slideStart = now;
    }
    for (let i = 0; i < cards.length; i++) {
        const style = cards[i]!.style;

        const proportion = elapsed / duration + i / cards.length;
        const slide = slideElapsed / slideDur + i / cards.length;
        const sin = Math.sin(slide * Math.PI * 2);
        const cos = Math.cos(slide * Math.PI * 2);

        const ry =
            Math.sin((proportion * 2 + cards[i]!.y) * Math.PI * 2) *
            (5 * cards[i]!.x + 2);
        const rx =
            Math.cos((proportion * 2 + cards[i]!.x) * Math.PI * 2) *
            (5 * cards[i]!.y + 2);

        const h = sin * 350;
        const scale = (cos * 0.5 + 0.5) * 0.5 + 0.5;
        style.zIndex = Math.round(scale * 100).toString();

        style.opacity = Math.pow(cos * 0.5 + 0.5, 2).toString();

        style.transform =
            `perspective(15cm) ` +
            `translateX(${h}px)` +
            `rotateY(${ry}deg) ` +
            `rotateX(${rx}deg) ` +
            `rotateZ(${(cos * 0.5 + cards[i]!.x - 1) * 10}deg) ` +
            `scale(${scale}) `;
    }

    requestAnimationFrame(animate);
}

requestAnimationFrame(animate);

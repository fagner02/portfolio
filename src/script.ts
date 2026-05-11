let selected: HTMLElement | null = null;

type Card = {
    style: CSSStyleDeclaration;
    y: number;
    x: number;
};
const carrousels = document.querySelectorAll<HTMLElement>(".carrousel");
const carrouselsData: {
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
            style: elems[i]!.style,
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

for (let j = 0; j < carrouselsData.length; j++) {
    let { cards, start, slideStart, slideDuration, duration } =
        carrouselsData[j]!;
    const animate = (now: number) => {
        const elapsed = now - start;
        const slideElapsed = now - slideStart;
        if (elapsed > duration) {
            start = now;
        }
        if (slideElapsed > slideDuration) {
            slideStart = now;
        }
        for (let i = 0; i < cards.length; i++) {
            const style = cards[i]!.style;

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

            const h = sin * 350;
            const scale = (cos * 0.5 + 0.5) * 0.5 + 0.5;
            style.zIndex = Math.round(scale * 100).toString();

            style.opacity = (cos * 0.5 + 0.5).toString();
            style.filter = `blur(${(1 - scale) * 10}px)`;

            style.transform =
                `perspective(15cm) ` +
                `translateX(${h}px)` +
                `rotateY(${ry}deg) ` +
                `rotateX(${rx}deg) ` +
                `rotateZ(${(cos * 0.5 + cards[i]!.x - 1) * 10}deg) ` +
                `scale(${scale}) `;
        }
        requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
}
document.addEventListener("scroll", (e) => {
    const scroll = (document.scrollingElement as HTMLElement).scrollTop;
    const stars = document.querySelector(".stars") as HTMLElement;
    const nav = document.querySelector("nav") as HTMLElement;
    const header = document.querySelector("header") as HTMLElement;

    let value = scroll / header.clientHeight;
    if (value > 1) value = 1;

    const blur = Math.round(value * 10);

    nav.style.setProperty("--pad-h", value.toPrecision(4));
    nav.style.setProperty("--pad-v", value.toPrecision(4));

    nav.style.backdropFilter = `blur(${blur}px)`;
    nav.style.borderBottom = `1px solid hsl(0, 0%, 0%, ${value * 0.2})`;
    nav.style.backgroundColor = `hsl(0,0%,100%,${value * 0.5})`;
    stars.style.filter = `blur(${blur}px) var(--shadow)`;
});

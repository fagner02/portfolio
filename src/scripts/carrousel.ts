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

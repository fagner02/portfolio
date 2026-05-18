import { bgContainer, stars } from "./elements.js";
const nav = document.querySelector("nav") as HTMLElement;
const menuBtn = document.querySelector(".menu") as HTMLButtonElement;
const header = document.querySelector("header") as HTMLElement;

export const updateHeader = () => {
    header.style.setProperty("--header-height", `${stars.clientHeight + 20}px`);
};
updateHeader();

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

const setStyle = () => {
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
};
setStyle();

document.addEventListener("scroll", () => {
    setStyle();
});

import gsap from "gsap";
import { defsLoadedCallbacks } from "./loadDefs.js";

const catchphrase = document.querySelector(".catchphrase") as HTMLElement;

const h1 = catchphrase?.querySelector("h1") as HTMLHeadingElement;
const path = catchphrase?.querySelector("svg>g>use") as SVGElement;
const text = h1.innerText;

const callback = () => {
    const frag = document.createDocumentFragment();
    let wordFrag = document.createDocumentFragment();
    const addToText = () => {
        const wordSpan = document.createElement("span");
        wordSpan.classList.add("catchphrase-word");
        wordSpan.append(wordFrag);
        frag.append(wordSpan);
    };
    for (let i = 0; i < text.length; i++) {
        const span = document.createElement("span");
        span.innerText = text.charAt(i);
        span.style.animationDelay = `${i * 20}ms`;

        if (text.charAt(i) <= " ") {
            addToText();
            frag.append(text.charAt(i));
            wordFrag = document.createDocumentFragment();
            continue;
        }
        wordFrag.append(span);
    }
    addToText();
    setTimeout(() => {
        catchphrase.style.opacity = "1";

        const tl = gsap.timeline();
        tl.fromTo(
            path,
            {
                translateX: -52,
                transformOrigin: "center",
            },
            {
                translateX: 0,
                duration: 1,
            },
        ).fromTo(
            path,
            { rotate: 0 },
            {
                rotate: 360,
                ease: "none",
                duration: 5,
                repeat: -1,
            },
            "<",
        );

        h1.replaceChildren(frag);
    }, 500);
};

defsLoadedCallbacks.push(callback);

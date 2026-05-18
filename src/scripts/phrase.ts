import gsap from "gsap";
import { defsLoadedCallbacks } from "./loadDefs.js";

const catchphrase = document.querySelector(".catchphrase") as HTMLElement;

const h1s = catchphrase?.querySelectorAll("h1");
const path = catchphrase?.querySelector("svg>g>use") as SVGElement;

const callback = () => {
    let spans: HTMLSpanElement[][] = [];
    for (const h1 of h1s) {
        const text = h1.innerText;

        const frag = document.createDocumentFragment();
        let wordFrag = document.createDocumentFragment();
        const addToText = () => {
            const wordSpan = document.createElement("span");
            wordSpan.classList.add("catchphrase-word");
            wordSpan.append(wordFrag);
            frag.append(wordSpan);
        };
        spans.push([]);
        for (let i = 0; i < text.length; i++) {
            const span = document.createElement("span");
            span.innerText = text.charAt(i);
            span.style.animationDelay = `${i * 20}ms`;

            if (text.charAt(i) <= " ") {
                if (wordFrag.children.length === 0) {
                    continue;
                }
                addToText();
                span.innerText = " ";
                frag.append(span);
                spans[spans.length - 1]?.push(span);
                wordFrag = document.createDocumentFragment();
                continue;
            }
            spans[spans.length - 1]?.push(span);
            console.log(spans);
            wordFrag.append(span);
        }
        addToText();
        h1.replaceChildren(frag);
    }
    const lettersTimeline = gsap.timeline({
        paused: true,
        repeat: -1,
    });

    for (let i = 0; i < spans.length; i++) {
        console.log(spans[i]);
        lettersTimeline
            .set(h1s[i]!, { autoAlpha: 1 })
            .fromTo(
                spans[i]!,
                { opacity: 0, rotate: 15, y: -20, x: 20 },
                { opacity: 1, rotate: 0, y: 0, x: 0, stagger: 0.01 },
            )
            .to(spans[i]!, {
                opacity: 0,
                rotate: 15,
                y: -20,
                x: 20,
                delay: 2,
                stagger: 0.02,
            })
            .set(h1s[i]!, { autoAlpha: 0 });
    }

    setTimeout(() => {
        catchphrase.style.opacity = "1";

        const tl = gsap.timeline();
        tl.fromTo(
            path,
            {
                x: -52,
                transformOrigin: "center",
            },
            {
                x: 0,
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

        lettersTimeline.play();
    }, 500);
};

defsLoadedCallbacks.push(callback);

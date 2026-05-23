import { animateCalls } from "./animate.js";

const mousePos = { x: 0, y: 0 };
const textElems = document.querySelectorAll("p,h2,h3,section a");

type Letter = {
    left: number;
    top: number;
    elem: HTMLElement;
};

const textNodeData: {
    visible: boolean;
    elem: HTMLElement;
    letters: Letter[];
}[] = Array(textElems.length);

const callback = (entries: IntersectionObserverEntry[]) => {
    for (let e of entries) {
        const index = parseInt(e.target.getAttribute("index") ?? "0");
        textNodeData[index]!.visible = e.isIntersecting;
    }
};

const observer = new IntersectionObserver(callback);

for (let i = 0; i < textElems.length; i++) {
    const textElem = textElems[i]!;
    textElem.setAttribute("index", i.toString());
    textNodeData[i] = {
        visible: false,
        elem: textElem as HTMLElement,
        letters: [],
    };

    const frag = document.createDocumentFragment();
    for (let j = 0; j < textElem.childNodes.length; j++) {
        let node = textElem.childNodes[j]!;
        let letters;
        if (node.nodeType === Node.TEXT_NODE) {
            letters = node.nodeValue;
        } else {
            letters = node.textContent;
        }
        if (!letters) continue;
        const textFrag = document.createDocumentFragment();
        let lastEmpty = true;
        let wordFrag = document.createDocumentFragment();
        const addToText = () => {
            if (wordFrag.childElementCount === 0) return;
            if (node.nodeType === Node.TEXT_NODE) {
                const wordSpan = document.createElement("span");
                wordSpan.classList.add("words");
                wordSpan.append(wordFrag);
                textFrag.append(wordSpan);
            } else {
                const elem = document.createElement(node.nodeName);
                elem.append(wordFrag);
                elem.classList.add("words");
                textFrag.append(elem);
            }
        };
        for (let k = 0; k < letters.length; k++) {
            let char = letters[k]!;
            if (char.charCodeAt(0) <= " ".charCodeAt(0)) {
                if (lastEmpty) {
                    continue;
                }
                lastEmpty = true;
                addToText();
                textFrag.append(document.createTextNode(" "));
                wordFrag = document.createDocumentFragment();
                continue;
            } else {
                lastEmpty = false;
            }
            const letterSpan = document.createElement("span");
            letterSpan.classList.add("letters");
            letterSpan.innerText = char;
            wordFrag.append(letterSpan);
            textNodeData[i]?.letters.push({
                elem: letterSpan,
                left: 0,
                top: 0,
            });
        }
        addToText();
        frag.append(textFrag);
    }
    textElem.replaceChildren(frag);
    observer.observe(textElem);
}

export const updateLetters = () => {
    for (let i = 0; i < textNodeData.length; i++) {
        const letters = textNodeData[i]?.letters!;
        for (let j = 0; j < letters.length; j++) {
            const letter = letters[j]!;
            const rect = letter!.elem.getBoundingClientRect();
            const bodyRect = document.body.getBoundingClientRect();
            letter.left =
                rect.left - bodyRect.left + letter.elem.clientWidth / 2;
            letter.top = rect.top - bodyRect.top + letter.elem.clientHeight / 2;
        }
    }
};

updateLetters();

let changed = false;
const ps = [0, -0.5, 1.5];
const lim = 100;
const r1 = document.createElement("div");
r1.style.width = "10px";
r1.style.height = "10px";
r1.style.background = "blue";
const r2 = document.createElement("div");
r2.style.width = "10px";
r2.style.height = "10px";
r2.style.background = "red";
r2.style.position = "fixed";
r1.style.position = "fixed";

document.body.appendChild(r1);
document.body.appendChild(r2);

const animateLetters = () => {
    if (!changed) return;
    changed = false;
    r1.style.left = `${mousePos.x}px`;
    r1.style.top = `${mousePos.y}px`;
    for (let i = 0; i < textNodeData.length; i++) {
        const data = textNodeData[i]!;
        if (!data.visible) {
            continue;
        }

        for (let j = 0; j < data.letters.length; j++) {
            const letter = data.letters[j]!;
            const dy = mousePos.y - (letter.top - window.scrollY);
            if (i === 56 && j === 0) {
                r2.style.left = `${letter.left}px`;
                r2.style.top = `${letter.top - window.scrollY}px`;
                console.log(letter.top - window.scrollY, mousePos.y);
            }
            const dy2 = dy * dy;
            const dx = mousePos.x - letter.left;
            const disdx = mousePos.x - (letter.left + dy2 * 0.1);
            const trued = Math.sqrt(dx * dx + dy2);
            const d = Math.sqrt(disdx * disdx + dy2);
            if (d < lim && trued < lim) {
                const t = (lim - d) / lim;
                const tsub = 1 - t;
                const vs = [Math.pow(tsub, 2), 2 * tsub * t, t * t];
                let res = 0;
                for (let i = 0; i < 3; i++) {
                    res += vs[i]! * ps[i]!;
                }
                letter.elem.style.transform = `scale(${res * 0.5 + 1}) translate(${1.2 * ((1 - disdx) / lim)}px,${1.2 * ((1 - dy) / lim)}px)`;
            } else {
                letter.elem.style.transform = "scale(1)";
            }
        }
    }
};

document.addEventListener("mousemove", (e) => {
    mousePos.x = e.clientX;
    mousePos.y = e.clientY;
    changed = true;
});

document.addEventListener("touchmove", (e) => {
    mousePos.x = e.touches[0]!.clientX;
    mousePos.y = e.touches[0]!.clientY;
    changed = true;
});

const reset = () => {
    mousePos.x = 0;
    mousePos.y = 0;
    changed = true;
};

document.addEventListener("touchend", reset);
document.addEventListener("mouseup", reset);
window.addEventListener("scroll", reset);
window.addEventListener("mouseout", reset);

animateCalls.push(animateLetters);

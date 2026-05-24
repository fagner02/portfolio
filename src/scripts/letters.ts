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
    left: number;
    top: number;
    width: number;
    height: number;
}[] = Array(textElems.length);

const callback = (entries: IntersectionObserverEntry[]) => {
    for (let e of entries) {
        const index = parseInt(e.target.getAttribute("index") ?? "0");
        textNodeData[index]!.visible = e.isIntersecting;
        const letters = textNodeData[index]?.letters!;
        if (e.isIntersecting) {
            for (let i = 0; i < letters.length; i++) {
                letters[i]!.elem.style.willChange = "transform";
            }
        } else {
            for (let i = 0; i < letters.length; i++) {
                letters[i]!.elem.style.willChange = "none";
            }
        }
    }
};

const observer = new IntersectionObserver(callback);

for (let i = 0; i < textElems.length; i++) {
    const textElem = textElems[i]! as HTMLElement;
    textElem.setAttribute("index", i.toString());
    textNodeData[i] = {
        visible: false,
        elem: textElem as HTMLElement,
        letters: [],
        left: 0,
        top: 0,
        width: 0,
        height: 0,
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
    const bodyRect = document.body.getBoundingClientRect();
    for (let i = 0; i < textNodeData.length; i++) {
        const textNode = textNodeData[i];
        if (!textNode) continue;
        const letters = textNode.letters;
        const textRect = textNode.elem.getBoundingClientRect();
        textNode.left = textRect.left - bodyRect.left + textRect.width / 2;
        textNode.top = textRect.top - bodyRect.top + textRect.height / 2;
        textNode.height = textRect.height * 0.5 + 50;
        textNode.width = textRect.width * 0.5 + 50;
        for (let j = 0; j < letters.length; j++) {
            const letter = letters[j]!;
            const rect = letter!.elem.getBoundingClientRect();
            letter.left =
                rect.left - bodyRect.left + letter.elem.clientWidth / 2;
            letter.top = rect.top - bodyRect.top + letter.elem.clientHeight / 2;
            letter.elem.style.width = `${rect.width}px`;
        }
    }
};

updateLetters();

let changed = false;
const ps = [0, -0.5, 1.5];
const lim = 100;

const animateLetters = () => {
    if (!changed) return;
    changed = false;

    for (let i = 0; i < textNodeData.length; i++) {
        const data = textNodeData[i]!;
        if (!data.visible) {
            continue;
        }

        const dy = mousePos.y - (data.top - window.scrollY);
        const dx = mousePos.x - data.left;

        if (Math.abs(dy) < data.height && Math.abs(dx) < data.width) {
            for (let i = 0; i < data.letters.length; i++) {
                data.letters[i]!.elem.style.display = "inline-block";
            }
        } else {
            for (let i = 0; i < data.letters.length; i++) {
                data.letters[i]!.elem.style.display = "inline";
            }
            continue;
        }

        for (let j = 0; j < data.letters.length; j++) {
            const letter = data.letters[j]!;
            const dy = mousePos.y - (letter.top - window.scrollY);
            const dx = mousePos.x - letter.left;
            const dy2 = dy * dy;
            const disdx = mousePos.x - (letter.left + dy2 * 0.1);
            const trued = Math.sqrt(dx * dx + dy2);
            const d = Math.sqrt(disdx * disdx + dy2);
            if (d < lim && trued < lim) {
                const t = (lim - d) / lim;
                const tsub = 1 - t;
                let res =
                    tsub * tsub * ps[0]! +
                    2 * tsub * t * ps[1]! +
                    t * t * ps[2]!;

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

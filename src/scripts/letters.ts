import { animateCalls } from "./animate.js";

const mousePos = { x: 0, y: 0 };
const textElems = document.querySelectorAll("p,h2,section a");
export const textNodeData: { visible: boolean; elem: HTMLElement }[] = Array(
    textElems.length,
);

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
    textNodeData[i] = { visible: false, elem: textElem as HTMLElement };
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
        }
        addToText();

        frag.append(textFrag);
    }

    textElem.replaceChildren(frag);
    observer.observe(textElem);
}

const ps = [0, -0.5, 1.5];
const lim = 100;

const animateLetters = () => {
    for (let data of textNodeData) {
        if (!data.visible) {
            continue;
        }

        const words = data.elem.children;
        for (let word of words) {
            for (let letter of word.children) {
                const rect = letter.getBoundingClientRect();
                const left = rect.left + rect.width / 2;
                const top = rect.top + rect.height / 2;
                const dx = mousePos.x - left;
                const dy = mousePos.y - top;
                const d = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
                if (d < lim) {
                    const t = (lim - d) / lim;
                    const tsub = 1 - t;
                    const vs = [Math.pow(tsub, 2), 2 * tsub * t, t * t];
                    let res = 0;
                    for (let i = 0; i < 3; i++) {
                        res += vs[i]! * ps[i]!;
                    }
                    (letter as HTMLElement).style.transform =
                        `translate(${(1.5 * dx) / lim}px,${(1.5 * dy) / lim}px) scale(${res * 0.5 + 1})`;
                } else {
                    (letter as HTMLElement).style.transform = "scale(1)";
                }
            }
        }
    }
};

document.addEventListener("mousemove", (e) => {
    mousePos.x = e.clientX;
    mousePos.y = e.clientY;
});

animateCalls.push(animateLetters);

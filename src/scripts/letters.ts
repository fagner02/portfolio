import { animateCalls } from "./animate.js";

const mousePos = { x: 0, y: 0 };
const textElems = document.querySelectorAll("p,h2");
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
        if (node.nodeType === Node.TEXT_NODE) {
            let letters = node.nodeValue;
            if (!letters) continue;
            const textFrag = document.createDocumentFragment();
            let lastEmpty = true;
            let wordFrag = document.createDocumentFragment();
            for (let k = 0; k < letters.length; k++) {
                let char = letters[k]!;
                if (char.charCodeAt(0) <= " ".charCodeAt(0)) {
                    if (lastEmpty) {
                        continue;
                    }
                    lastEmpty = true;

                    const wordSpan = document.createElement("span");
                    wordSpan.classList.add("words");
                    wordSpan.append(wordFrag);
                    textFrag.append(wordSpan);
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
            frag.append(textFrag);
        } else {
            frag.append(node);
        }
    }
    textElem.replaceChildren(frag);
    observer.observe(textElem);
}

const p0 = [0, -0.5, 1.5];

const animateLetters = () => {
    for (let p of textNodeData) {
        if (!p.visible) {
            continue;
        }

        const words = p.elem.children;
        for (let word of words) {
            for (let l of word.children) {
                const rect = l.getBoundingClientRect();
                const left = rect.left + rect.width / 2;
                const top = rect.top + rect.height / 2;
                const dx = mousePos.x - left;
                const dy = mousePos.y - top;
                const d = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
                if (d < 100) {
                    const t = (100 - d) / 100;
                    const tsub = 1 - t;
                    const v1 = [Math.pow(tsub, 2), 2 * tsub * t, t * t];
                    let res = { x: 0, y: 0 };
                    for (let i = 0; i < 3; i++) {
                        res.x += v1[i]! * p0[i]!;
                        res.y += v1[i]! * p0[i]!;
                    }
                    (l as HTMLElement).style.transform =
                        `translate(${(dx / 100) * 1}px,${(1 - dy / 100) * 1}px) scale(${res.y * 0.5 + 1})`;
                } else {
                    (l as HTMLElement).style.transform = "scale(1)";
                }
            }
        }
    }
};

document.addEventListener("mousemove", (e) => {
    mousePos.x = e.clientX;
    mousePos.y = e.clientY;
    console.log("move");
});

animateCalls.push(animateLetters);

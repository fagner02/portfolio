import { animateCalls } from "./animate.js";

const mousePos = { x: 0, y: 0 };
let changed = false;
const ps = document.querySelectorAll("p,h2");
export const lettersData: { visible: boolean; elem: HTMLElement }[] = Array(
    ps.length,
);
export let lettersProcessed = false;

const callback = (entries: IntersectionObserverEntry[]) => {
    for (let e of entries) {
        const index = parseInt(e.target.getAttribute("pindex") ?? "0");
        lettersData[index]!.visible = e.isIntersecting;
    }
};

const observer = new IntersectionObserver(callback);

for (let i = 0; i < ps.length; i++) {
    const p = ps[i]!;
    p.setAttribute("pindex", i.toString());
    lettersData[i] = { visible: false, elem: p as HTMLElement };
    // if (p.tagName === "H2") {
    const frag = document.createDocumentFragment();
    for (let j = 0; j < p.childNodes.length; j++) {
        let node = p.childNodes[j]!;
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
                const span = document.createElement("span");
                span.innerText = char;
                wordFrag.append(span);
            }
            frag.append(textFrag);
        } else {
            frag.append(node);
        }
    }
    p.replaceChildren(frag);
    // }
    observer.observe(p);
}

const point1 = document.createElement("div");
point1.style.width = "10px";
point1.style.height = "10px";
point1.style.background = "blue";
point1.style.position = "absolute";
document.body.appendChild(point1);

const point2 = document.createElement("div");
point2.style.width = "10px";
point2.style.height = "10px";
point2.style.background = "red";
point2.style.position = "absolute";
document.body.appendChild(point2);

const p0 = [
    [0, 0],
    [40, 80],
    [375, -290],
];

(" (1-t)²P0 + 2(1-t)tP1 + t²P2");
const animateLetters = () => {
    for (let p of lettersData) {
        if (!p.visible) {
            continue;
        }

        const words = p.elem.children;
        for (let word of words) {
            for (let l of word.children) {
                const rect = l.getBoundingClientRect();
                // \  console.log(rect);
                const d = Math.sqrt(
                    Math.pow(mousePos.x - rect.left, 2) +
                        Math.pow(mousePos.y - rect.top, 2),
                );
                if (d < 100) {
                    const t = (100 - d) / 100;
                    (l as HTMLElement).style.transform =
                        `scale(${((100 - d) / 100) * 0.5 + 1})`;
                    (l as HTMLElement).style.display = "inline-block";
                    (l as HTMLElement).style.verticalAlign = "bottom";
                    (l as HTMLElement).style.height = "stretch";
                    (l as HTMLElement).style.transformOrigin = "bottom";
                    const tsub = 1 - t;
                    const v1 = [Math.pow(tsub, 2), 2 * tsub * t, t * t];
                    let res = { x: 0, y: 0 };
                    for (let i = 0; i < 3; i++) {
                        res.x += v1[i]! * p0[i]![0]!;
                        res.y += v1[i]! * p0[i]![1]!;
                    }
                } else {
                    (l as HTMLElement).style.transform = "scale(1)";
                }

                // console.log(d);
            }
        }
    }
};

document.addEventListener("mousemove", (e) => {
    mousePos.x = e.clientX;
    mousePos.y = e.clientY;
    changed = true;
    console.log("move");
});

animateCalls.push(animateLetters);

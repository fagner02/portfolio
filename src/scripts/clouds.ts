import { urlMap } from "./imageImport.js";
import { stars } from "./elements.js";

const cloudContainer = document.querySelector("#clouds") as HTMLElement;

export const cloudData: {
    x: number;
    y: number;
    width: number;
    elem?: HTMLElement;
}[] = [
    { x: 0.42, y: 0.3, width: 0.26 },
    { x: 0.3, y: 0.55, width: 0.17 },
    { x: 0.15, y: 0.38, width: 0.14 },
    { x: 0.24, y: 0.2, width: 0.13 },
    { x: 0.58, y: 0.45, width: 0.24 },
    { x: 0.7, y: 0.2, width: 0.13 },
    { x: 0.75, y: 0.5, width: 0.15 },
    { x: 0.8, y: 0.2, width: 0.11 },
    { x: 0.89, y: 0.2, width: 0.19 },
];

const frag = document.createDocumentFragment();
for (let i = 0; i < cloudData.length; i++) {
    const cloud = document.createElement("img");
    cloud.src = urlMap[`c${i + 1}.webp`]!;
    cloud.classList.add("cloud");
    frag.append(cloud);
    cloudData[i]!.elem = cloud;
}
cloudContainer.append(frag);

export const updateClouds = () => {
    for (let i = 0; i < cloudData.length; i++) {
        const cloud = cloudData[i]?.elem;
        if (!cloud) continue;
        cloud.style.left = `${stars.offsetLeft + cloudData[i]!.x * stars.clientWidth}px`;
        cloud.style.top = `${stars.offsetTop + cloudData[i]!.y * stars.clientHeight * 0.35}px`;
        cloud.style.width = `${stars.clientWidth * cloudData[i]!.width}px`;
    }
};

updateClouds();

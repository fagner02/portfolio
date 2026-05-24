import { starsData } from "./elements.js";

const cloudContainer = document.querySelector("#clouds") as HTMLElement;

const cloudData: {
    x: number;
    y: number;
    width: number;
    elem?: HTMLElement;
}[] = [
    { x: 0.42, y: 0.3, width: 2.3 },
    { x: 0.3, y: 0.55, width: 1.7 },
    { x: 0.15, y: 0.38, width: 1.7 },
    { x: 0.24, y: 0.2, width: 1.9 },
    { x: 0.58, y: 0.45, width: 2.1 },
    { x: 0.7, y: 0.2, width: 1.6 },
    { x: 0.74, y: 0.55, width: 1.8 },
    { x: 0.8, y: 0.2, width: 1.8 },
    { x: 0.89, y: 0.2, width: 1.6 },
];

const frag = document.createDocumentFragment();
for (let i = 0; i < cloudData.length; i++) {
    const cloud = document.createElement("div");
    cloud.onload = () => {
        cloud.style.opacity = "1";
        cloud.style.scale = "1";
    };

    cloud.classList.add(`c-${i + 1}`);
    cloud.classList.add("cloud");

    frag.append(cloud);
    cloudData[i]!.elem = cloud;
}
cloudContainer.append(frag);

export const updateClouds = () => {
    for (let i = 0; i < cloudData.length; i++) {
        const cloud = cloudData[i]?.elem;
        if (!cloud) continue;
        cloud.style.left = `${starsData.offsetLeft + cloudData[i]!.x * starsData.clientWidth}px`;
        cloud.style.top = `${starsData.offsetTop + cloudData[i]!.y * starsData.clientHeight * 0.35}px`;
        cloud.style.scale = `${cloudData[i]!.width * starsData.clientWidth * 0.0015}`;
    }
};

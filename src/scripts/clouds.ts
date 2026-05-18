import { starsData } from "./elements.js";
const images: Record<string, string> = import.meta.glob(
    ["/src/assets/banner/clouds/*.webp"],
    {
        eager: true,
        query: "?url",
        import: "default",
    },
);

const urlMap: Record<string, string> = Object.fromEntries(
    Object.entries(images).map((x) => [x[0].split("/").at(-1), x[1]]),
);

const cloudContainer = document.querySelector("#clouds") as HTMLElement;

const cloudData: {
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
        cloud.style.left = `${starsData.offsetLeft + cloudData[i]!.x * starsData.clientWidth}px`;
        cloud.style.top = `${starsData.offsetTop + cloudData[i]!.y * starsData.clientHeight * 0.35}px`;
        cloud.style.width = `${starsData.clientWidth * cloudData[i]!.width}px`;
    }
};

updateClouds();

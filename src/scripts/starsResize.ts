import { stars, updateStarsData } from "./elements.js";
import { updateClouds } from "./clouds.js";
import { updateBlinks } from "./stars.js";
import { updateHeader } from "./header.js";

let updateLetters: Function | undefined;
if (window.location.pathname === "/") {
    updateLetters = (await import("./letters.js")).updateLetters;
}

const resizeObserver = new ResizeObserver(() => {
    updateStarsData();
    updateBlinks();
    updateClouds();
    updateHeader();
    updateLetters?.();
});
resizeObserver.observe(stars);

import { stars, updateStarsData } from "./elements.js";
import { updateClouds } from "./clouds.js";
import { updateBlinks } from "./stars.js";
import { updateHeader } from "./header.js";
import { updateLetters } from "./letters.js";

const resizeObserver = new ResizeObserver(() => {
    updateStarsData();
    updateBlinks();
    updateClouds();
    updateHeader();
    updateLetters();
});
resizeObserver.observe(stars);

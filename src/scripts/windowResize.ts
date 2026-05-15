import { updateCarrousel } from "./carrousel.js";
import { updateClouds } from "./clouds.js";
import { updateHeader } from "./header.js";
import { updateLetters } from "./letters.js";
import { updateBlinks } from "./stars.js";

window.onresize = () => {
    updateClouds();
    updateBlinks();
    updateHeader();
    updateLetters();
    updateCarrousel();
};

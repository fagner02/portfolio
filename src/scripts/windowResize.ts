import { updateCarrousel } from "./carrousel.js";
import { updateClouds } from "./clouds.js";
import { updateStarsData } from "./elements.js";
import { updateHeader } from "./header.js";
import { updateLetters } from "./letters.js";
import { updateBlinks } from "./stars.js";

const updateAll = () => {
    updateStarsData();
    updateClouds();
    updateBlinks();
    updateHeader();
    updateLetters();
    updateCarrousel();
};
window.onresize = async () => {
    updateAll();
};

updateAll();

import { updateCarrousel, updateClone } from "./carrousel.js";
import { updateClouds } from "./clouds.js";
import { updateStarsData } from "./elements.js";
import { updateLetters } from "./letters.js";
import { updateBlinks } from "./stars.js";

const updateAll = () => {
    updateStarsData();
    updateClouds();
    updateBlinks();
    updateLetters();
    updateCarrousel();
    updateClone();
};
window.onresize = async () => {
    updateAll();
};

updateAll();

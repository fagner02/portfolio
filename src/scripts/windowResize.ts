import { updateCarrousel, updateClone } from "./carrousel.js";

const updateAll = () => {
    updateCarrousel();
    updateClone();
};
window.onresize = async () => {
    updateAll();
};

updateAll();

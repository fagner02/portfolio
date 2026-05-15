import { updateClouds } from "./clouds.js";
import { updateHeader } from "./header.js";
import { updateBlinks } from "./stars.js";

window.onresize = () => {
    updateClouds();
    updateBlinks();
    updateHeader();
};

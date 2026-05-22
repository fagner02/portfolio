export const stars = document.querySelector(".stars") as HTMLImageElement;
export const bgContainer = document.querySelector(".bg") as HTMLElement;

const onLoad = () => {
    const parent = bgContainer.parentElement as HTMLElement;

    parent.style.opacity = "1";
    parent.style.filter = "blur(0px)";
};
stars.onload = onLoad;
if (stars.complete) {
    onLoad();
}

export const starsData = {
    offsetLeft: 0,
    clientWidth: 0,
    offsetTop: 0,
    clientHeight: 0,
};

export const updateStarsData = () => {
    starsData.offsetLeft = stars.offsetLeft;
    starsData.clientWidth = stars.clientWidth;
    starsData.offsetTop = stars.offsetTop;
    starsData.clientHeight = stars.clientHeight;
    starsData.clientWidth = stars.clientWidth;
};

updateStarsData();

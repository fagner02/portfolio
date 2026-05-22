export const stars = document.querySelector(".stars") as HTMLImageElement;
export const bgContainer = document.querySelector(".bg") as HTMLElement;

stars.onload = () => {
    bgContainer.style.opacity = "1";
    bgContainer.style.filter = "blur(0px)";
};

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

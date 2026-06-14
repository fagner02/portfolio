const observer = new ResizeObserver((entries) => {
    for (const e of entries) {
        if (e.contentRect.width < 10) {
            (e.target as HTMLElement).style.contentVisibility = "hidden";
            (e.target as HTMLElement).style.opacity = "0";
        } else {
            (e.target as HTMLElement).style.contentVisibility = "visible";
            (e.target as HTMLElement).style.opacity = "1";
        }
    }
});

const frameDecors = document.querySelectorAll(".frame-decor");
for (const frameDecor of frameDecors) {
    observer.observe(frameDecor);
}

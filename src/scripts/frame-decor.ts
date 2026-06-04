const observer = new ResizeObserver((entries) => {
    for (const e of entries) {
        if (e.contentRect.width < 40) {
            (e.target as HTMLElement).style.contentVisibility = "hidden";
            (e.target as HTMLElement).style.border = "none";
        } else {
            (e.target as HTMLElement).style.contentVisibility = "visible";
            (e.target as HTMLElement).style.border = "1px solid";
        }
    }
});

const frameDecors = document.querySelectorAll(".frame-decor");
for (const frameDecor of frameDecors) {
    observer.observe(frameDecor);
}

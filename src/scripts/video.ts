const observer = new IntersectionObserver((entries) => {
    for (const e of entries) {
        if ((e.target as HTMLVideoElement).readyState > 2) {
            try {
                if (e.isIntersecting) {
                    (e.target as HTMLVideoElement).play();
                } else {
                    (e.target as HTMLVideoElement).pause();
                }
            } catch (e) {}
        } else {
            if (e.isIntersecting) {
                (e.target as HTMLVideoElement).load();
            }
        }
    }
});

const onLoad = (e: Event) => {
    const video = e.target as HTMLVideoElement;
    video.removeEventListener("loadeddata", onLoad);
    video.play();
};

const videos = document.querySelectorAll("video");
for (let video of videos) {
    video.muted = true;
    video.loop = true;
    observer.observe(video);
    video.addEventListener("loadeddata", onLoad);
}

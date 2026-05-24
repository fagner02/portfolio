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
        }
    }
});

const videos = document.querySelectorAll("video");
const onLoad = (e: Event) => {
    const video = e.target as HTMLVideoElement;
    video.removeEventListener("loadeddata", onLoad);
    video.muted = true;
    video.autoplay = true;
    video.loop = true;
    observer.observe(video);
};

for (let i = 0; i < videos.length; i++) {
    videos[i]!.addEventListener("loadeddata", onLoad);
}

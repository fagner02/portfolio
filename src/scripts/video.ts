const observer = new IntersectionObserver((entries) => {
    for (const e of entries) {
        if (e.isIntersecting) {
            (e.target as HTMLVideoElement).play();
        } else {
            (e.target as HTMLVideoElement).pause();
        }
    }
});

const videos = document.querySelectorAll("video");
for (let i = 0; i < videos.length; i++) {
    videos[i]!.muted = true;
    videos[i]!.autoplay = true;
    videos[i]!.loop = true;
    observer.observe(videos[i]!);
}

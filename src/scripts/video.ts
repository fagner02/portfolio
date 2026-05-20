const videos = document.querySelectorAll("video");
for (let i = 0; i < videos.length; i++) {
    videos[i]?.setAttribute("autoplay", "true");
    videos[i]?.setAttribute("muted", "true");
    videos[i]?.setAttribute("loop", "true");
}

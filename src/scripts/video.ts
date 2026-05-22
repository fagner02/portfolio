const videos = document.querySelectorAll("video");
for (let i = 0; i < videos.length; i++) {
    videos[i]!.muted = true;
    videos[i]!.autoplay = true;
    videos[i]!.loop = true;
}

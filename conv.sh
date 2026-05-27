file="/bubbles/play3"
ffmpeg -i ./src/assets/${file}.mp4 \
-ss 00:00:00 \
-t 3 \
-vf "fps=18,setpts=0.6*PTS,scale=600:-1:flags=lanczos" \
-q:v 80 -loop 0 \
./src/assets/${file}.webp

# file="/bubbles/win"
# ffmpeg -i ./src/assets/${file}.jpg -vf "scale=1080:-1" \
# ./src/assets/${file}.webp




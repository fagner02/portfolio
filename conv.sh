# file="/bubbles/play3"
# ffmpeg -i ./src/assets/${file}.mp4 \
# -ss 00:00:00 \
# -t 3 \
# -vf "fps=18,setpts=0.6*PTS,scale=600:-1:flags=lanczos" \
# -q:v 80 -loop 0 \
# ./src/assets/${file}.webp

file="/expenses/register"
ffmpeg -i ./src/assets/${file}.png -vf "scale=1080:-1" \
./src/assets/${file}.webp




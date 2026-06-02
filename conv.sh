file="/expenses/input"
ffmpeg -i ./src/assets/${file}.mp4 \
-vf "fps=15,setpts=1*PTS,scale=600:-1:flags=lanczos" \
-q:v 80 -loop 0 \
./src/assets/${file}.webp
# -ss 00:00:00 \
# -t 3 \

# file="/expenses/welcome"
# ffmpeg -i ./src/assets/${file}.png -vf "scale=1080:-1" \
# ./src/assets/${file}.webp




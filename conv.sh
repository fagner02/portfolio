# file="/expenses/input"
# ffmpeg -i ./src/assets/${file}.mp4 \
# -vf "fps=15,setpts=1*PTS,scale=600:-1:flags=lanczos" \
# -q:v 80 -loop 0 \
# ./src/assets/${file}.webp
# -ss 00:00:00 \
# -t 3 \

# file="expenses/anim2"
path="./src/assets/"
file="expenses/anim2"
ffmpeg -framerate 16.66 -i ${path}${file}/frames/%04d.png -vf "crop=800:600:100:50" -c:v libx264 out.mp4

# file="/expenses/welcome"
# ffmpeg -i ./src/assets/${file}.png -vf "scale=1080:-1" \
# ./src/assets/${file}.webp




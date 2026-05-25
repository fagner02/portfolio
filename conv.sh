# file="/pathfinding/pathf2"
# ffmpeg -i ./src/assets/${file}.mp4 \
# -vf "fps=15,setpts=0.5*PTS,scale=480:-1:flags=lanczos" \
# -q:v 80 -loop 0 \
# ./src/assets/${file}.webp

file="/pathfinding/pfind3"
ffmpeg -i ./src/assets/${file}.png -vf "scale=1050:-1" \
./src/assets/${file}.webp




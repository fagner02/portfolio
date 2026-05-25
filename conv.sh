# file="/vansi/vansiall"
# ffmpeg -i ./src/assets/${file}.mp4 \
# -vf "fps=10,setpts=0.5*PTS,scale=600:-1:flags=lanczos" \
# -q:v 80 -loop 0 \
# ./src/assets/${file}.webp

file="/vansi/vansi4"
ffmpeg -i ./src/assets/${file}.png \
./src/assets/${file}.webp




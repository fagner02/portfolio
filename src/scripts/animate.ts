export const animateCalls: ((now: number) => void)[] = [];

const animate = (now: number) => {
    for (let i = 0; i < animateCalls.length; i++) {
        animateCalls[i]?.(now);
    }

    requestAnimationFrame(animate);
};
requestAnimationFrame(animate);

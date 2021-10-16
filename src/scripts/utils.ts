// helper function 

export function getRandomNumber(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

export function meterFPS(placeholder: HTMLElement | null) {
    let frame = 0;
    let last = 0;
    let spent = 0;
    let FPS = 0;

    return {
        measure(time: number) {
            frame++;
            spent += time - (last || time);
            if (spent >= 1000) {
                FPS = frame;
                frame = spent = 0;
            }
            last = time;
        },
        show() {
            setTimeout(() => {
                if (placeholder) {
                    placeholder.innerText = `FPS : ${FPS}`;
                }
                this.show();
            }, 1000)
        }
    }
}
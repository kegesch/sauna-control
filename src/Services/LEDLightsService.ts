import convert from "color-convert";
import LEDs from "rpi-ws2801";
import ILightsService from "./Interfaces/ILightsService";

export default class LEDLightsService implements ILightsService {

    private activeColor: number[];

    public autoOff(): void {
    }

    public autoOn(): void {
    }

    public off(): void {
        LEDs.disconnect();
    }

    public on(): void {
        LEDs.connect(128);
    }

    public setColor(red: number, green: number, blue: number) {
        LEDs.fill(red, green, blue);
        this.activeColor = [red, green, blue];
    }

    public blinkTimer(red: number, green: number, blue: number, times: number, duration: number) {
        this.fadeColor(this.activeColor, [red, green, blue], 800);
        setTimeout(() => {
            this.fadeColor([red, green, blue], this.activeColor, 800);
        }, 800);
    }

    public setBrightness(brightness: number) {
        if (!(brightness <= 1.0 && brightness >= 0.0)) {
            throw new Error("Brightness must be in between 0.0 and 1.0.");
        }

        const hslActiveColor = convert.rgb.hsl(this.activeColor);
        hslActiveColor[2] = 255 * brightness;
        const activeRgbColorWithBrightness = convert.hsl.rgb(hslActiveColor);

        this.setColorArray(activeRgbColorWithBrightness);
        this.activeColor = activeRgbColorWithBrightness;
    }

    private setColorArray(color: number[]) {
        if (!color || color.length !== 3) { throw new Error("color must have three number items"); }
        LEDs.fill(color[0], color[1], color[2]);
    }

    private fadeColor(color1: number[], color2: number[], duration: number) {
        const steps = 20;
        const durationStep = duration / steps;
        for (let i = 0; i < steps; i++) {
            const factor = i / steps;
            setTimeout(() => {
                const interpolatedColor = this.interpolateColor(color1, color2, factor);
                this.setColorArray(interpolatedColor);
            }, durationStep * (i + 1));
        }
    }

    private interpolateColor(color1: number[], color2: number[], factor: number): number[] {
        if (arguments.length < 3) { factor = 0.5; }
        const result = color1.slice();
        for (let i = 0; i < 3; i++) {
            result[i] = Math.round(result[i] + factor * (color2[i] - color1[i]));
        }
        return result;
    }

}

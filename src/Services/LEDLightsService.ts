import * as convert from "color-convert";
import ILightsService from "./Interfaces/ILightsService";
import SPILed from "../lib/spi-led";

export default class LEDLightsService implements ILightsService {

    private activeColor: [number, number, number];
    private ledService: SPILed;

    public constructor() {
        this.ledService = new SPILed(0, 0, 160);
    }

    public autoOff(): void {
    }

    public autoOn(): void {
    }

    public on(): void {
      this.setColorArray(this.activeColor);
    }

    public off(): void {
        this.ledService.fill(0x00, 0x00, 0x00);
    }

    public setColor(red: number, green: number, blue: number) {
        this.ledService.fill(red, green, blue);
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
        this.ledService.fill(color[0], color[1], color[2]);
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

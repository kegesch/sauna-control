import * as convert from "color-convert";
import ILightsService from "./Interfaces/ILightsService";
import SPILed from "../lib/spi-led";

export default class LEDLightsService implements ILightsService {

    private activeColor: [number, number, number];
    private ledService: SPILed;

    public constructor() {
    	this.ledService = new SPILed(0, 0, 160);
	this.activeColor = [0xFF, 0xFF, 0xFF];
    }

    public autoOff(): void {
    }

    public autoOn(): void {
    }

    public async on(): Promise<void> {
      await this.setColorArray(this.activeColor);
    }

    public async off(): Promise<void> {
        await this.ledService.fill(0x00, 0x00, 0x00);
    }

    async setColor(red: number, green: number, blue: number) {
      await this.ledService.fill(red, green, blue);
      this.activeColor = [red, green, blue];
    }

    public blinkTimer(red: number, green: number, blue: number, times: number, duration: number) {
        this.fadeColor(this.activeColor, [red, green, blue], 800);
        setTimeout(() => {
            this.fadeColor([red, green, blue], this.activeColor, 800);
        }, 800);
    }

    public async setBrightness(brightness: number) {
      if (!(brightness <= 1.0 && brightness >= 0.0)) {
        throw new Error("Brightness must be in between 0.0 and 1.0.");
      }

      const hslActiveColor = convert.rgb.hsl(this.activeColor);
      hslActiveColor[2] = 255 * brightness;
      const activeRgbColorWithBrightness = convert.hsl.rgb(hslActiveColor);

      await this.setColorArray(activeRgbColorWithBrightness);
      this.activeColor = activeRgbColorWithBrightness;
    }

    private async setColorArray(color: number[]) {
      if (!color || color.length !== 3) {
        throw new Error("color must have three number items");
      }
      await this.ledService.fill(color[0], color[1], color[2]);
    }

    private fadeColor(color1: number[], color2: number[], duration: number) {
        const steps = 20;
        const durationStep = duration / steps;
        for (let i = 0; i < steps; i++) {
            const factor = i / steps;
            setTimeout(async () => {
                const interpolatedColor = this.interpolateColor(color1, color2, factor);
                await this.setColorArray(interpolatedColor);
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

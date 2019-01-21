import ILightsService from "./Interfaces/ILightsService";
import SPILed from "../lib/spi-led";
import { ISensorService } from "./Interfaces/ISensorService";

export default class LEDLightsService implements ILightsService {
  private ledService: SPILed;
  private status: "on" | "off" = "off";
  private statusAuto: "on" | "off" = "off";
  private brightness: number = 1.0;
  private doorOpen: boolean = false;

  private COLDWHITE: [number, number, number] = [0xff, 0xff, 0xff];
  private activeColor: [number, number, number] = this.COLDWHITE;
  private WARMWHITE: [number, number, number] = [0xd9, 0x00, 0xff];


  public constructor(sensorService: ISensorService) {
    this.ledService = new SPILed(0, 0, 160);
    this.activeColor = this.COLDWHITE;

    sensorService.doorOpen$.subscribe({
      error: err => {
        console.log("Error on retrieving next: " + err);
      },
      next: open => {
        if (open === true && !this.doorOpen) {
          this.fadeColor(
            LEDLightsService.calcColorWithBrightness(
              this.activeColor,
              this.brightness
            ),
            this.COLDWHITE,
            500
          );
        } else if (open === false && this.doorOpen) {
          this.fadeColor(
            this.COLDWHITE,
            LEDLightsService.calcColorWithBrightness(
              this.activeColor,
              this.brightness
            ),
            500
          );
        }
        this.doorOpen = open;
      }
    });
  }

  public async autoOff(): Promise<void> {
    this.statusAuto = "off";
    await this.ledService.fill(0x00, 0x00, 0x00);
  }

  public async autoOn(): Promise<number> {
    this.statusAuto = "on";
    this.status = "off";
    this.activeColor = this.WARMWHITE;
    this.brightness = 0.8;

    await this.update();
    return this.brightness;
  }

  public async on(): Promise<number> {
    this.status = "on";
    this.statusAuto = "off";
    this.brightness = 1;
    await this.update();
    return this.brightness;
  }

  public async off(): Promise<void> {
    this.status = "off";
    await this.ledService.fill(0x00, 0x00, 0x00);
  }

  async setColor(red: number, green: number, blue: number) {
    this.activeColor = [red, green, blue];
    await this.update();
  }

  public blinkTimer(
    color: [number, number, number],
    times: number,
    duration: number
  ) {
    for (let i = 0; i < times; i++) {
      setTimeout(() => {
        this.fadeColor(
          LEDLightsService.calcColorWithBrightness(
            this.activeColor,
            this.brightness
          ),
          color,
          duration
        );
        setTimeout(() => {
          this.fadeColor(
            color,
            LEDLightsService.calcColorWithBrightness(
              this.activeColor,
              this.brightness
            ),
            duration
          );
        }, duration);
      }, i * duration * 2);
    }
  }

  public async setBrightness(brightness: number) {
    if (!(brightness <= 1.0 && brightness >= 0.0)) {
      throw new Error("Brightness must be in between 0.0 and 1.0.");
    }
    this.brightness = brightness;
    await this.update();
  }

  private async update() {
    if (!(this.status == "on" || this.statusAuto == "on")) return;
    await this.setColorArray(
      LEDLightsService.calcColorWithBrightness(
        this.activeColor,
        this.brightness
      )
    );
  }

  private static calcColorWithBrightness(
    color: [number, number, number],
    brightness: number
  ) {
    return [color[0] * brightness, color[1] * brightness, color[2] * brightness]
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
        const interpolatedColor = LEDLightsService.interpolateColor(
          color1,
          color2,
          factor
        );
        await this.setColorArray(interpolatedColor);
      }, durationStep * (i + 1));
    }
  }

  private static interpolateColor(
    color1: number[],
    color2: number[],
    factor: number
  ): number[] {
    if (arguments.length < 3) {
      factor = 0.5;
    }
    const result = color1.slice();
    for (let i = 0; i < 3; i++) {
      result[i] = Math.round(result[i] + factor * (color2[i] - color1[i]));
    }
    return result;
  }
}

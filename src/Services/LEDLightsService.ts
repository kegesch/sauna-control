import ILightsService from "./Interfaces/ILightsService";
import SPILed from "../lib/spi-led";
import {ISensorService} from "./Interfaces/ISensorService";
import ISystemService, {SystemState} from "./Interfaces/ISystemService";

export default class LEDLightsService implements ILightsService {
  private ledService: SPILed;
  private brightness: number = 1.0;
  private doorOpen: boolean = false;

  private isAuto = false;
  private currentTemp: number;

  private COLDWHITE: [number, number, number] = [0xff, 0xff, 0xff];
  private DARK: [number, number, number]  =  [0x00, 0x00, 0x00];
  private activeColor: [number, number, number] = this.COLDWHITE;
  private WARMWHITE: [number, number, number] = [0xd9, 0x00, 0xff];

  private COLDBLUE: [number, number, number] = [0x00, 0x00, 0xFF];
  private WARMRED: [number, number, number] = [0xFF, 0x00, 0x00];

  private LEDAMOUNT = 160;


  public constructor(sensorService: ISensorService, systemService: ISystemService) {
    this.ledService = new SPILed(0, 0, this.LEDAMOUNT);
    this.activeColor = this.DARK;

    sensorService.doorOpen$.subscribe({
      error: err => {
        console.error("Error on retrieving next: " + err);
      },
      next: open => {
        if(systemService.systemState === SystemState.OFF) return;

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

    sensorService.temperature$.subscribe(async (temp: number) => {
      this.currentTemp = temp;
      if(this.isAuto) {
        await this.setAutoColor(temp);
      }
    })
  }

  private async setAutoColor(temp: number) {
    if(!temp) return;
    const interpolationStep = Math.min(Math.max(temp, 0), 100) / 100;
    const interpolated = LEDLightsService.interpolateColor(this.COLDBLUE, this.WARMRED, interpolationStep);
    const colors = LEDLightsService.calcColorWithBrightness(interpolated, this.brightness);
    this.activeColor = colors;
    await this.setColorArray(colors);
  }

  public async autoOn(): Promise<number> {
    this.brightness = 0.8;
    this.isAuto = true;

    await this.setAutoColor(this.currentTemp);
    return this.brightness;
  }

  public async off(): Promise<void> {
    this.activeColor = this.DARK;
    this.isAuto = false;
    await this.update();
  }

  async setColor(red: number, green: number, blue: number): Promise<number>  {
    this.brightness = 1;
    this.isAuto = false;
    this.activeColor = [red, green, blue];
    await this.update();
    return this.brightness;
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
  ) : [number, number, number] {
    return [color[0] * brightness, color[1] * brightness, color[2] * brightness]
  }

  private printColor(color: [number, number, number]) {
    console.log("color: r" + color[0] + " g" + color[1] + " b" + color[2]);
  }

  private async setColorArray(color: [number, number, number]) {
    if (!color) {
      throw new Error("Color must not be undefined.");
    }
    await this.ledService.fill(color[0], color[1], color[2]);
  }

  private fadeColor(color1: [number, number, number], color2: [number, number, number], duration: number) {
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
    color1: [number, number, number],
    color2: [number, number, number],
    factor: number
  ): [number, number, number] {

    let result: [number, number, number] = [color1[0], color1[2], color1[2]];
    for (let i = 0; i < 3; i++) {
      result[i] = Math.round(result[i] + factor * (color2[i] - color1[i]));
    }
    return result;
  }
}

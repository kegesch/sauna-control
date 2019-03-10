import {action, computed, flow, observable} from "mobx";
import ILightsService from "../../Services/Interfaces/ILightsService";
import {MaterialColors} from "../HelperComponents";
import ISystemService from "../../Services/Interfaces/ISystemService";

export default class LightsStore {
  @observable
  public isOn: boolean = false;

  @observable
  public isAuto: boolean = false;

  @observable
  public brightness: number = 100;

  @observable
  public selectedColorIndex: number = -1;

  @computed
  public get selectedColor() {
    return this.colors[this.selectedColorIndex];
  };

  public colors = [MaterialColors.white, MaterialColors.purple, MaterialColors.ledBlue, MaterialColors.ledRed];

  private lightsService: ILightsService;

  constructor(lightsService: ILightsService, systemService: ISystemService) {
    this.lightsService = lightsService;
    systemService.isOn$.subscribe({
      next: async value => {
        if(!value) {
          this.off();
        }
      },
      error: err => {
        console.error("could not retrieve next system status");
      }
    })
  }

  @action
  public selectColor(index: number) {
    this.selectedColorIndex = index;
    this.brightness = 100;
    let colorArray = this.colorToHexArray(this.colors[index]);
    this.lightsService.setColor(colorArray[0], colorArray[1], colorArray[2]);
    this.isAuto = false;
    this.isOn = true;
  }

  private colorToHexArray(color: string): [number, number, number] {
    const number = parseInt(color.substr(1), 16);
    return [(number >> 16) & 0xff, (number >> 8) & 0xff, number & 0xff];
  }

  enableAuto = flow(this.enableAutoAsync);
  private *enableAutoAsync(): any {
    this.isAuto = true;
    this.isOn = true;
    this.selectedColorIndex = -1;
    const actualBright = yield this.lightsService.autoOn();
    this.brightness = actualBright * 100;
  }

  off = flow(this.offAsync);
  private *offAsync(): any {
    this.isAuto = false;
    this.isOn = false;
    this.selectedColorIndex = -1;
    yield this.lightsService.off();
  }

  setBrightness = flow(this.setBrightnessAsync);
  private *setBrightnessAsync(brightness: number): any {
    if (brightness < 0 || brightness > 100) {
      return;
    }

    yield this.lightsService.setBrightness(this.brightness / 100);

    this.brightness = brightness;
  }
}

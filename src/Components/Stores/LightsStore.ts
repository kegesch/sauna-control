import {action, computed, flow, observable} from "mobx";
import ILightsService from "../../Services/Interfaces/ILightsService";
import {MaterialColors} from "../HelperComponents";

export default class LightsStore {
  @observable
  public isOn: boolean = false;

  @observable
  public isAuto: boolean = false;

  @observable
  public brightness: number = 100;

  @observable
  public selectedColorIndex: number = 0;

  @computed
  public get selectedColor() {
    return this.colors[this.selectedColorIndex];
  };

  public colors = [MaterialColors.white, MaterialColors.purple, MaterialColors.ledBlue, MaterialColors.ledRed];

  private lightsService: ILightsService;

  constructor(lightsService: ILightsService) {
    this.lightsService = lightsService;
  }

  @action
  public selectColor(index: number) {
    this.selectedColorIndex = index;
    let colorArray = this.colorToHexArray(this.colors[index]);
    this.lightsService.setColor(colorArray[0], colorArray[1], colorArray[2]);
  }

  private colorToHexArray(color: string): [number, number, number] {
    const number = parseInt(color.substr(1), 16);
    return [(number >> 16) & 0xff, (number >> 8) & 0xff, number & 0xff];
  }

  toggleAuto = flow(this.toggleAutoAsync);
  private *toggleAutoAsync(): any {
    if (!this.isAuto) {
      const actualBright = yield this.lightsService.autoOn();
      this.brightness = actualBright * 100;
    } else {
      yield this.lightsService.autoOff();
    }

    this.isAuto = !this.isAuto;
    if (this.isAuto && this.isAuto === this.isOn) this.isOn = !this.isAuto;
  }

  togglePower = flow(this.togglePowerAsync);
  private *togglePowerAsync(): any {
    if (!this.isOn) {
      const actualBright = yield this.lightsService.on();
      this.brightness = actualBright * 100;
    } else {
      yield this.lightsService.off();
    }
    this.isOn = !this.isOn;
    if (this.isOn && this.isAuto === this.isOn) this.isAuto = !this.isOn;
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

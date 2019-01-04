import {flow, observable} from "mobx";
import ILightsService from "../../Services/Interfaces/ILightsService";

export default class LightsStore {

    @observable
    public isOn: boolean = false;

    @observable
    public isAuto: boolean = false;

    @observable
    public brightness: number = 100;

    private lightsService: ILightsService;

    constructor(lightsService: ILightsService) {
        this.lightsService = lightsService;
    }

    toggleAuto = flow(this.toggleAutoAsync);
    private * toggleAutoAsync(): any {
      if(!this.isAuto) {
        const actualBright = yield this.lightsService.autoOn();
        console.log(actualBright);
        this.brightness = actualBright * 100;
      }  else {
        yield this.lightsService.autoOff();
      }

      this.isAuto = !this.isAuto;
      if(this.isAuto && this.isAuto === this.isOn) this.isOn = !this.isAuto;
    }

    togglePower = flow(this.togglePowerAsync);
    private * togglePowerAsync(): any {
        if (!this.isOn) {
          const actualBright = yield this.lightsService.on();
          this.brightness = actualBright * 100;
        } else {
            yield this.lightsService.off();
        }
        this.isOn = !this.isOn;
        if(this.isOn && this.isAuto === this.isOn) this.isAuto = !this.isOn;
    };

    setBrightness = flow(this.setBrightnessAsync);
    private * setBrightnessAsync(brightness: number): any {
        if (brightness < 0 || brightness > 100) { return; }

        yield this.lightsService.setBrightness(this.brightness / 100);

        this.brightness = brightness;
    }
}

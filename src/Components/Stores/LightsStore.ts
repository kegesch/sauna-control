import {action, flow, observable} from "mobx";
import ILightsService from "../../Services/Interfaces/ILightsService";

export default class LightsStore {

    @observable
    public isOn: boolean;

    @observable
    public isAuto: boolean;

    @observable
    public brightness: number = 100;

    private lightsService: ILightsService;

    constructor(lightsService: ILightsService) {
        this.lightsService = lightsService;
    }

    @action
    public toggleAuto() {
        this.isAuto = !this.isAuto;
    }

    togglePower = flow(function * (): any {
        if (!this.isOn) {
            yield this.lightsService.setColor(0xFF, 0xFF, 0xFF);
        } else {
            yield this.lightsService.off();
        }
        this.isOn = !this.isOn;
    });


    setBrightness = flow(function * (brightness: number): any {
        if (brightness < 0 || brightness > 100) { return; }

        yield this.lightsService.setBrightness(this.brightness / 100);

        this.brightness = brightness;
    });
}

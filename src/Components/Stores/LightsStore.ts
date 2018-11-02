import {action, observable} from "mobx";
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

    @action
    public togglePower() {
        this.isOn = !this.isOn;
        if (this.isOn) {
            this.lightsService.on();
            this.lightsService.setColor(0xFF, 0xFF, 0xFF);
        } else {
            this.lightsService.off();
        }
    }

    @action
    public setBrightness(brightness: number) {
        if (brightness < 0 || brightness > 100) { return; }

        this.brightness = brightness;
        this.lightsService.setBrightness(this.brightness / 100);
    }
}

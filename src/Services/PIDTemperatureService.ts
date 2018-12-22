import * as Controller from "node-pid-controller";
import * as Rx from "rxjs";
import {Resources} from "../Model/Resources";
import {ISensorService} from "./Interfaces/ISensorService";
import ITemperatureService from "./Interfaces/ITemperatureService";

export default class PIDTemperatureService implements ITemperatureService {

    public temperature$: Rx.Subject<number> = new Rx.Subject<number>();

    private sensorService: ISensorService;

    private pid: Controller;

    private targetTemp: number;
    private currentTemp: number;
    private timer;

    private state: number;

    public constructor(sensorService: ISensorService) {
        this.sensorService = sensorService;

        this.pid = new Controller({
            dt: 1,
            k_d: 0.01,
            k_i: 0.01,
            k_p: 0.25,
        });

        this.sensorService.temperature$.subscribe({
            error: () => {console.error("Could not retrieve temperature from SensorService.")},
            next: (value: number) => {
                this.temperature$.next(value);
                this.currentTemp = value;
            },
        });
    }

    public setTargetTemperature(temp: number): void {
        this.targetTemp = temp;
        this.pid.setTarget(this.targetTemp);

        clearInterval(this.timer);
        const that = this;
        this.timer = setInterval(() => {
           const correction = that.pid.update(that.currentTemp);
           if (correction > 0) {
              that.sensorService.setHeat(true);
           } else {
              that.sensorService.setHeat(false);
           }
        }, 5 * 1000);
    }

    public getState(): number {
        return this.state;
    }

    public setState(state: number) {
        if (state !== Resources.State.OFF || state !== Resources.State.ON) {
            throw new Error("State must be either On or Off");
        }
        this.state = state;
    }
}

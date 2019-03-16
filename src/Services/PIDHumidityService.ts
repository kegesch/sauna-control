import { Subject } from "rxjs";
import IHumidityService from "./Interfaces/IHumidityService";
import { ISensorService } from "./Interfaces/ISensorService";
import * as Controller from "node-pid-controller";

export default class PIDHumidityService implements IHumidityService {
  public humidity$: Subject<number> = new Subject<number>();

  private pid: Controller;
  private sensorService: ISensorService;
  private targetHumid: number;
  private currentHumid: number = 50;
  private timer: any;

  constructor(sensorService: ISensorService) {
    this.sensorService = sensorService;

    this.pid = new Controller({
      dt: 1,
      k_d: 0.01,
      k_i: 0,
      k_p: 0.15
    });

    this.sensorService.humidity$.subscribe({
      error: () =>
        console.error("Could not retrieve humidity from SensorService."),
      next: (value: number) => {
        this.currentHumid = value;
        this.humidity$.next(value);
      }
    });
  }

  public setTargetHumidity(humidityPercentage: number): void {
    this.targetHumid = humidityPercentage;
    this.pid.setTarget(this.targetHumid);

    clearInterval(this.timer);
    const that = this;
    this.timer = setInterval(() => {
      const correction = that.pid.update(that.currentHumid);
      if (correction > 0) {
        this.sensorService.setEvaporate(true);
      } else {
        this.sensorService.setEvaporate(false);
      }
    }, 1 * 1000);
  }

  public stop() {
    this.sensorService.setEvaporate(false);
    clearInterval(this.timer);
  }
}

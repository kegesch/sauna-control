import ITemperatureService from "./Interfaces/ITemperatureService";
import {ISensorService} from "./Interfaces/ISensorService";
import Hysteresis from "../lib/Hysteresis";
import * as Rx from "rxjs";
import IHumidityService from "./Interfaces/IHumidityService";

export default class HysteresisHumidityService implements IHumidityService {
  public humidity$: Rx.Subject<number> = new Rx.Subject<number>();
  private sensorService: ISensorService;
  private currentHumid = 0;
  private interval: any = undefined;
  private hysteresis: Hysteresis = null;


  public constructor(sensorService: ISensorService) {
    this.sensorService = sensorService;
    this.hysteresis = new Hysteresis(0.02);

    this.sensorService.humidity$.subscribe({
      error: () => {
        console.error("Could not retrieve temperature from SensorService.");
      },
      next: (value: number) => {
        this.humidity$.next(value);
        this.currentHumid = value;
      }
    });
  }

  setTargetHumidity(humidityPercentage: number): void {
      clearInterval(this.interval);
      this.hysteresis.setTarget(humidityPercentage);
      const that = this;
      this.interval = setInterval(() => {
          that.sensorService.setEvaporate(that.hysteresis.update(that.currentHumid));
      }, 1000);
  }

  stop(): void {
    this.sensorService.setEvaporate(false);
    clearInterval(this.interval);
  }

}

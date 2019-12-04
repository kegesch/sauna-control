import ITemperatureService from "./Interfaces/ITemperatureService";
import {ISensorService} from "./Interfaces/ISensorService";
import Hysteresis from "../lib/Hysteresis";
import * as Rx from "rxjs";

export default class HysteresisTemperatureService implements ITemperatureService {
  public temperature$: Rx.Subject<number> = new Rx.Subject<number>();
  private sensorService: ISensorService;
  private currentTemp = 0;
  private interval: any = undefined;
  private hysteresis: Hysteresis = null;


  public constructor(sensorService: ISensorService) {
    this.sensorService = sensorService;
    this.hysteresis = new Hysteresis(2);

    this.sensorService.temperature$.subscribe({
      error: () => {
        console.error("Could not retrieve temperature from SensorService.");
      },
      next: (value: number) => {
        this.temperature$.next(value);
        this.currentTemp = value;
      }
    });
  }

  setTargetTemperature(temp: number): void {
      clearInterval(this.interval);
      this.hysteresis.setTarget(temp);
      const that = this;
      this.interval = setInterval(() => {
          that.sensorService.setHeat(that.hysteresis.update(that.currentTemp));
      }, 1000);
  }

  stop(): void {
    this.sensorService.setHeat(false);
    clearInterval(this.interval);
  }

}

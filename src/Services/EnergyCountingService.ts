import {IEnergyCountingService} from "./Interfaces/IEnergyCountingService";
import {Subject} from "rxjs";
import {ISensorService} from "./Interfaces/ISensorService";

export class EnergyCountingService implements IEnergyCountingService {

  public currentDemandInMin$: Subject<number> = new Subject();

  private isHeating = false;
  private isEvaporating = false;
  private heatingTime: number = 0;
  private evaporationTime: number = 0;

  private lastHeatCheck = -1;
  private lastEvapCheck = -1;

  public constructor(sensorService: ISensorService) {

    this.lastHeatCheck = this.getCurrentTimestamp();
    this.lastEvapCheck = this.getCurrentTimestamp();

    setInterval(() => {
      this.currentDemandInMin$.next(this.calculateDemandInMin())
    }, 5000);

    sensorService.heating$.subscribe((isHeating: boolean) => {
      const currentTimeStamp = this.getCurrentTimestamp();
      if(this.isHeating) {
        this.heatingTime += currentTimeStamp - this.lastHeatCheck;
      }
      this.isHeating = isHeating;
      this.lastHeatCheck = currentTimeStamp;
    });

    sensorService.evaporating$.subscribe((isEvaporating: boolean) => {
      const currentTimeStamp = this.getCurrentTimestamp();
      if(this.isEvaporating) {
        this.evaporationTime += currentTimeStamp - this.lastEvapCheck;
      }
      this.isEvaporating = isEvaporating;
      this.lastEvapCheck = currentTimeStamp;
    });

  }

  private calculateDemandInMin(): number {
    return (this.heatingTime * 2 + this.evaporationTime) / 60;
  }

  private getCurrentTimestamp() {
    return Math.floor(Date.now() / 1000);
  }
}

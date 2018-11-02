import {Subject} from "rxjs";
import IHumidityService from "./Interfaces/IHumidityService";
import {ISensorService} from "./Interfaces/ISensorService";

export default class HumidityService implements IHumidityService {

    public humidity$: Subject<number> = new Subject<number>();

    private sensorService: ISensorService;

    constructor(sensorService: ISensorService) {
        this.sensorService = sensorService;

        this.sensorService.humidity$.subscribe({
            error: () => console.error("Could not retrieve humidity from SensorService."),
            next: (value: number) => this.humidity$.next(value),
        });

    }

    public setTargetHumidity(humidityPercentage: number): void {
        this.sensorService.setEvaporate(true);
    }
}

import * as Rx from "rxjs";

export default interface IHumidityService {
    humidity$: Rx.Subject<number>;
    setTargetHumidity(humidityPercentage: number): void;
    stop(): void;
}

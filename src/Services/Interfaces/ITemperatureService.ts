import * as Rx from "rxjs";

export default interface ITemperatureService {
    temperature$: Rx.Subject<number>;
    setTargetTemperature(temp: number): void;
    stop(): void;
}

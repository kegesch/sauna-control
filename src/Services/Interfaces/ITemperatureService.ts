import * as Rx from "rxjs";

export default interface ITemperatureService {
    temperature$: Rx.Subject<number>;
    setTargetTemperature(temp: number): void;
    setState(state: number);
    getState(): number;
}

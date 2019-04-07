import * as Rx from "rxjs";

export interface IEnergyCountingService {
  currentDemandInMin$: Rx.Subject<number>;
}

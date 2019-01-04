import * as Rx from "rxjs";

export interface ISensorService {
  heating$: Rx.Subject<boolean>;
  temperature$: Rx.Subject<number>;
  humidity$: Rx.Subject<number>;
  evaporating$: Rx.Subject<boolean>;
  doorOpen$: Rx.Subject<boolean>;
  energyOn$: Rx.Subject<boolean>;
  setHeat(heat: boolean): void;
  setEvaporate(evaporate: boolean): void;
}

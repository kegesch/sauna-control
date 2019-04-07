import * as Rx from "rxjs";

export enum SystemState {
  ON = "on", OFF = "off"
}

export default interface ISystemService {
  systemState: SystemState;
  isOn$: Rx.Subject<boolean>;
}

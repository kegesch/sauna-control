import * as Rx from "rxjs";

export default interface ISystemService {
  systemState: "on" | "off";
  isOn$: Rx.Subject<boolean>;
}

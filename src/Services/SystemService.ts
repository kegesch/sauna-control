import ISystemService, {SystemState} from "./Interfaces/ISystemService";
import * as Rx from "rxjs";

export default class SystemService implements ISystemService {
  private systemStateVar: SystemState;

  public isOn$: Rx.Subject<boolean> = new Rx.Subject<boolean>();

  public set systemState(state: SystemState) {
    this.systemStateVar = state;
    this.isOn$.next(state == SystemState.ON);
  }

  public get systemState() {
    return this.systemStateVar;
  }
}

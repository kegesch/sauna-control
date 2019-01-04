import ISystemService from "./Interfaces/ISystemService";
import * as Rx from "rxjs";

export default class SystemService implements ISystemService {

    private systemStateVar: "on" | "off";

    public isOn$: Rx.Subject<boolean> = new Rx.Subject<boolean>();

    public set systemState(state: "on" | "off") {
        this.systemStateVar = state;
        this.isOn$.next(state == "on");
    }

    public get systemState() {
        return this.systemStateVar;
    }
}

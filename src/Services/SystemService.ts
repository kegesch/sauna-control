import ISystemService from "./Interfaces/ISystemService";

export default class SystemService implements ISystemService {

    private systemStateVar: "on" | "off";

    public set systemState(state: "on" | "off") {
        this.systemStateVar = state;
    }

    public get systemState() {
        return this.systemStateVar;
    }
}
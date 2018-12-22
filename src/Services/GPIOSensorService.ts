// @ts-ignore
import i2c_htu21d from "htu21d-i2c";
import {Gpio} from "onoff";
import * as Rx from "rxjs";
import {ISensorService} from "./Interfaces/ISensorService";
import ISystemService from "./Interfaces/ISystemService";

export default class GPIOSensorService implements ISensorService {

    public heating$: Rx.Subject<boolean> = new Rx.Subject<boolean>();
    public temperature$: Rx.Subject<number> = new Rx.Subject<number>();
    public humidity$: Rx.Subject<number> = new Rx.Subject<number>();
    public evaporating$: Rx.Subject<boolean> = new Rx.Subject<boolean>();
    public doorOpen$: Rx.Subject<boolean> = new Rx.Subject<boolean>();
    public energyOn$: Rx.Subject<boolean> = new Rx.Subject<boolean>();

    private systemService: ISystemService;

    private MUTEX: boolean = false;

    private door: Gpio;
    private energy: Gpio;
    private heatPhase12: Gpio;
    private heatPhase3: Gpio;
    private evaporate: Gpio;

    private sensor: any;

    private timer: any;
    private fetchInterval: number = 1000 * 5; // every 5 seconds

    public constructor(systemService: ISystemService) {
        this.systemService = systemService;

        this.door = new Gpio(26, "in");
        this.energy = new Gpio(16, "in");
        this.heatPhase12 = new Gpio(17, "out");
        this.heatPhase3 = new Gpio(5, "out");
        this.evaporate = new Gpio(22, "out");

        this.sensor = new i2c_htu21d();

        this.timer = setInterval(async () => {
            this.temperature$.next(await this.getCurrentTemperature());
            this.humidity$.next(await this.getHumidity());
            this.doorOpen$.next(this.isDoorOpen());
            this.energyOn$.next(this.isEnergyOn());
        }, this.fetchInterval);
    }

    public setHeat(heat: boolean): void {
        if (this.systemService.systemState === "on" && heat && !this.isDoorOpen()) {
            this.heatPhase12.writeSync(1);
            this.heatPhase3.writeSync(1);
            this.heating$.next(true);
            this.evaporate.writeSync(0);
            this.evaporating$.next(false);
        } else {
            this.heatPhase12.writeSync(0);
            this.heatPhase3.writeSync(0);
            this.heating$.next(false);
        }

        this.MUTEX = heat;
    }

    public setEvaporate(evaporate: boolean): void {
        if (this.MUTEX && this.systemService.systemState === "on" && evaporate && !this.isDoorOpen()) {
            this.evaporate.writeSync(1);
            this.evaporating$.next(true);
        } else {
            this.evaporate.writeSync(0);
            this.evaporating$.next(false);
        }
    }

    public finalize(): void {
        this.door.unexport();
        this.energy.unexport();
        this.heatPhase12.writeSync(0);
        this.heatPhase12.unexport();
        this.heatPhase3.writeSync(0);
        this.heatPhase3.unexport();
        this.evaporate.writeSync(0);
        this.evaporate.unexport();

        clearInterval(this.timer);
    }

    private async getCurrentTemperature(): Promise<number> {
        return new Promise<number>(function (resolve, reject) {
            try {
              this.sensor.readTemperature(resolve);
            } catch (e) {
              reject(e);
            }
        });
    }

    private async getHumidity(): Promise<number> {
        return new Promise<number>(function (resolve, reject) {
            try {
              this.sensor.readHumiditiy(resolve);
            } catch (e) {
              reject(e);
            }
        });
    }

    private isDoorOpen(): boolean {
        return this.door.readSync() === 0;
    }

    private isEnergyOn(): boolean {
        return this.energy.readSync() === 1;
    }
}

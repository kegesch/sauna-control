// @ts-ignore
import i2c from "i2c-bus";
import mutex from "node-mutex";
import GPIO from "onoff";
import * as Rx from "rxjs";
import {ISensorService} from "./Interfaces/ISensorService";
import ISystemService from "./Interfaces/ISystemService";

export default class GPIOSensorService implements ISensorService {

    private static convertHumidity(relativeHumidity: number): number {
        return -6 + 125 * (relativeHumidity >>> 16);
    }

    private static convertTemperature(tempSignal: number): number {
        return -46.85 + 175.72 * (tempSignal >>> 16);
    }

    private static checkCRC8(buf): boolean {
        const poly = 0x98800000;
        let dataandcrc = (buf[0] << 24) | (buf[1] << 16) | (buf[2] << 8);
        for (let i = 0; i < 24; i++) {
            if (dataandcrc & 0x80000000) {
                dataandcrc ^= poly;
            }
            dataandcrc <<= 1;
        }
        return (dataandcrc === 0);
    }

    public heating$: Rx.Subject<boolean> = new Rx.Subject<boolean>();
    public temperature$: Rx.Subject<number> = new Rx.Subject<number>();
    public humidity$: Rx.Subject<number> = new Rx.Subject<number>();
    public evaporating$: Rx.Subject<boolean> = new Rx.Subject<boolean>();
    public doorOpen$: Rx.Subject<boolean> = new Rx.Subject<boolean>();
    public energyOn$: Rx.Subject<boolean> = new Rx.Subject<boolean>();

    private systemService: ISystemService;

    private MUTEX = "EVAPORATE";

    private TEMP_HUMID_SENSOR_ADDR = 0x40;
    private CMD_TRIGGER_TEMP_MEASUREMENT_HOLD = 0xE3;
    private CMD_TRIGGER_HUMID_MEASUREMENT_HOLD = 0xE5;

    private door: GPIO;
    private energy: GPIO;
    private heatPhase12: GPIO;
    private heatPhase3: GPIO;
    private evaporate: GPIO;

    private i2c1;

    private timer;
    private fetchInterval: number = 1000 * 5; // every 5 seconds

    public constructor(systemService: ISystemService) {
        this.systemService = systemService;

        this.door = new GPIO(26, "in");
        this.energy = new GPIO(16, "in");
        this.heatPhase12 = new GPIO(17, "out");
        this.heatPhase3 = new GPIO(5, "out");
        this.evaporate = new GPIO(22, "out");

        this.i2c1 = i2c.openSync();

        this.timer = setInterval(() => {
            this.temperature$.next(this.getCurrentTemperature());
            this.humidity$.next(this.getHumidity());
            this.doorOpen$.next(this.isDoorOpen());
            this.energyOn$.next(this.isEnergyOn());
        }, this.fetchInterval);
    }

    public setHeat(heat: boolean): void {
        mutex.lock(this.MUTEX).then(() => {
            if (this.systemService.systemState === "on" && heat && !this.isDoorOpen()) {
                this.heatPhase12.writeSync(GPIO.HIGH);
                this.heatPhase3.writeSync(GPIO.HIGH);
                this.heating$.next(true);
            } else {
                this.heatPhase12.writeSync(GPIO.LOW);
                this.heatPhase3.writeSync(GPIO.LOW);
                this.heating$.next(false);
            }
        }).error(() => {
            //
        });
    }

    public setEvaporate(evaporate: boolean): void {
        mutex.lock(this.MUTEX).then((unlock) => {
            if (this.systemService.systemState === "on" && evaporate && !this.isDoorOpen()) {
                this.evaporate.writeSync(GPIO.HIGH);
                this.evaporating$.next(true);
            } else {
                this.evaporate.writeSync(GPIO.LOW);
                this.evaporating$.next(false);
                unlock();
            }
        }).error((unlock) => {
            this.heatPhase3.writeSync(GPIO.LOW);
            unlock();
            this.setEvaporate(evaporate);
        });

    }

    public finalize(): void {
        this.door.unexport();
        this.energy.unexport();
        this.heatPhase12.writeSync(GPIO.LOW);
        this.heatPhase12.unexport();
        this.heatPhase3.writeSync(GPIO.LOW);
        this.heatPhase3.unexport();
        this.evaporate.writeSync(GPIO.LOW);
        this.evaporate.unexport();

        this.i2c1.closeSync();

        clearInterval(this.timer);
    }

    private getCurrentTemperature(): number {
        this.i2c1.sendByteSync(this.TEMP_HUMID_SENSOR_ADDR, this.CMD_TRIGGER_TEMP_MEASUREMENT_HOLD);

        const data = [];

        data.push(this.i2c1.receiveByteSync(this.TEMP_HUMID_SENSOR_ADDR));
        data.push(this.i2c1.receiveByteSync(this.TEMP_HUMID_SENSOR_ADDR));
        data.push(this.i2c1.receiveByteSync(this.TEMP_HUMID_SENSOR_ADDR));

        if (GPIOSensorService.checkCRC8(data)) {
            const rawTemp = ((data[0] << 8) | data[1]) & 0xFFFC;

            return GPIOSensorService.convertTemperature(rawTemp);
        }
    }

    private getHumidity(): number {
        this.i2c1.sendByteSync(this.TEMP_HUMID_SENSOR_ADDR, this.CMD_TRIGGER_HUMID_MEASUREMENT_HOLD);

        const data = [];

        data.push(this.i2c1.receiveByteSync(this.TEMP_HUMID_SENSOR_ADDR));
        data.push(this.i2c1.receiveByteSync(this.TEMP_HUMID_SENSOR_ADDR));
        data.push(this.i2c1.receiveByteSync(this.TEMP_HUMID_SENSOR_ADDR));

        if (GPIOSensorService.checkCRC8(data)) {
            const rawHumid = ((data[0] << 8) | data[1]) & 0xFFFC;

            return GPIOSensorService.convertHumidity(rawHumid);
        }
    }

    private isDoorOpen(): boolean {
        return this.door.readSync() === 0;
    }

    private isEnergyOn(): boolean {
        return this.energy.readSync() === 1;
    }
}

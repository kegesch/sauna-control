import { action, computed, observable } from "mobx";
import IHumidityService from "../../Services/Interfaces/IHumidityService";
import { ISensorService } from "../../Services/Interfaces/ISensorService";
import ITemperatureService from "../../Services/Interfaces/ITemperatureService";
import { observer } from "mobx-react";
import ISystemService from "../../Services/Interfaces/ISystemService";

export default class SensorStore {
  @observable
  public setPointTemp: number = 70;

  @observable
  public setPointHumid: number = 50;

  @observable
  public selectedSetPoint: "temp" | "humid" | null = null;

  @observable
  public currentTemp: number = 0;

  @observable
  public currentHumid: number = 0;

  @observable
  public isHeating: boolean;

  @observable
  public isEvaporating: boolean;

  @observable
  public isTempOn: boolean;

  @observable
  public isEvapOn: boolean;

  private temperatureService: ITemperatureService;
  private humidityService: IHumidityService;

  constructor(
    temperatureService: ITemperatureService,
    humidityService: IHumidityService,
    sensorService: ISensorService,
    systemService: ISystemService
  ) {
    this.temperatureService = temperatureService;
    this.humidityService = humidityService;

    this.temperatureService.temperature$.subscribe({
      error: () =>
        console.error(
          "Could not retrieve temperature from TemperatureService."
        ),
      next: (value: number) => this.setCurrentTemp(value)
    });

    this.humidityService.humidity$.subscribe({
      error: () =>
        console.error("Could not retrieve humidity from PIDHumidityService."),
      next: (value: number) => this.setCurrentHumid(value)
    });

    sensorService.evaporating$.subscribe({
      error: () =>
        console.error("Could not retrieve evaporating from SensorService."),
      next: (value: boolean) => this.setEvaporating(value)
    });

    sensorService.heating$.subscribe({
      error: () =>
        console.error("Could not retrieve heating from SensorService."),
      next: (value: boolean) => this.setHeating(value)
    });

    systemService.isOn$.subscribe({
      error: () =>
        console.error("Could not retrieve system status from SystemService."),
      next: (value: boolean) => {
        if (value) {
          this.humidityService.setTargetHumidity(this.setPointHumid);
          this.temperatureService.setTargetTemperature(this.setPointTemp);
        } else {
          this.humidityService.stop();
          this.temperatureService.stop();
        }
      }
    });
  }

  @action
  public setSetPoint(num: number) {
    if (this.selectedSetPoint === "temp") {
      this.setTemp(num);
    } else if (this.selectedSetPoint === "humid") {
      this.setHumid(num);
    }
  }

  @computed
  public get setPoint() {
    if (this.selectedSetPoint === "temp") {
      return this.setPointTemp;
    } else if (this.selectedSetPoint === "humid") {
      return this.setPointHumid;
    }
    // throw new Error("No SetPoint selected. There must be a selected SetPoint to fetch its current value.");
  }

  @action
  public selectSetPoint(setPoint: "temp" | "humid" | null) {
    this.selectedSetPoint = setPoint;
  }

  @action
  private setHumid(humid: number) {
    if (humid > 100 || humid < 0) {
      return;
    }

    this.setPointHumid = humid;
    this.humidityService.setTargetHumidity(humid);
  }

  @action
  private setTemp(temp: number) {
    if (temp > 105 || temp < 0) {
      return;
    }

    this.setPointTemp = temp;
    this.temperatureService.setTargetTemperature(temp);
  }

  @action
  private setCurrentTemp(temp: number) {
    this.currentTemp = Math.round(temp);
  }

  @action
  private setCurrentHumid(humid: number) {
    this.currentHumid = Math.round(humid);
  }

  @action
  private setEvaporating(isEvaporating: boolean) {
    this.isEvaporating = isEvaporating;
  }

  @action
  private setHeating(isHeating: boolean) {
    this.isHeating = isHeating;
  }
}

import { action, computed, observable } from "mobx";
import IHumidityService from "../../Services/Interfaces/IHumidityService";
import { ISensorService } from "../../Services/Interfaces/ISensorService";
import ITemperatureService from "../../Services/Interfaces/ITemperatureService";
import ISystemService from "../../Services/Interfaces/ISystemService";
import SaunaMode from "../../Model/SaunaMode";

import finlandImage from "../../../assets/icons/images/finland.png";
import aromaImage from "../../../assets/icons/images/aroma.png";
import softImage from "../../../assets/icons/images/soft.png";
import tropicalImage from "../../../assets/icons/images/tropical.png";

export default class SensorStore {
  @observable
  public setPointTemp: number = 70;

  @observable
  public setPointHumid: number = 50;

  @observable
  public selectedSaunaMode: SaunaMode = null;

  public saunaModes: SaunaMode[];

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

  private finlandMode: SaunaMode = new SaunaMode("finland sauna", 70, 100, 90, 3, 3, 3, finlandImage);
  private tropicalMode: SaunaMode = new SaunaMode("tropical bath", 45, 60, 55, 10, 20, 15, tropicalImage);
  private softDampfMode: SaunaMode = new SaunaMode("soft dampf", 45, 60, 55, 40, 55, 45, softImage);
  private aromaBathMode: SaunaMode = new SaunaMode("aroma bath", 40, 45, 40, 40, 55, 50, aromaImage);

  constructor(
    temperatureService: ITemperatureService,
    humidityService: IHumidityService,
    sensorService: ISensorService,
    systemService: ISystemService
  ) {
    this.temperatureService = temperatureService;
    this.humidityService = humidityService;

    this.saunaModes = [this.finlandMode, this.tropicalMode, this.softDampfMode, this.aromaBathMode];

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
        if (value && this.selectedSaunaMode) {
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
  public selectSaunaMode(mode: SaunaMode) {
    this.selectedSaunaMode = mode;
    if(!mode) {
      this.humidityService.stop();
      this.temperatureService.stop();
    } else {
      this.setTemp(mode.defaultTemperature);
      this.setHumid(mode.defaultHumidity);
    }
  }

  @action
  public setHumid(humid: number) {
    if (this.selectedSaunaMode && (humid > this.selectedSaunaMode.maxHumidity || humid < this.selectedSaunaMode.minHumidity)) {
      return;
    }

    this.setPointHumid = humid;
    this.humidityService.setTargetHumidity(humid);
  }

  @action
  public setTemp(temp: number) {
    if (this.selectedSaunaMode  && (temp > this.selectedSaunaMode.maxTemperature || temp < this.selectedSaunaMode.minTemperature)) {
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

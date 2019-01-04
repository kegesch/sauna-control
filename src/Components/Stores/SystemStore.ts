import { action, computed, observable } from "mobx";
import { ISensorService } from "../../Services/Interfaces/ISensorService";
import ISystemService from "../../Services/Interfaces/ISystemService";

export default class SystemStore {
  @computed
  public get isOn() {
    return this.systemState === "on";
  }

  @observable
  public systemState: "on" | "off" = "off";

  @observable
  public doorOpen: boolean;

  @observable
  public energyOn: boolean;

  private systemService: ISystemService;

  constructor(systemService: ISystemService, sensorService: ISensorService) {
    this.systemService = systemService;

    sensorService.doorOpen$.subscribe({
      error: () =>
        console.error("Could not retrieve door status from SensorService."),
      next: (value: boolean) => this.setDoorOpen(value)
    });

    sensorService.energyOn$.subscribe({
      error: () =>
        console.error("Could not retrieve energy status from SensorService."),
      next: (value: boolean) => this.setEnergyOn(value)
    });
  }

  @computed
  public get errorMessage(): string {
    const doorError = "Türe ist geöffnet.";
    const energyError = "Notauschalter ist aus.";

    const errors = [];

    if (!this.energyOn) {
      errors.push(energyError);
    }
    if (this.doorOpen) {
      errors.push(doorError);
    }

    return errors.join(" | ");
  }

  @action
  public toggleState() {
    if (this.isOn) {
      this.systemState = "off";
      this.systemService.systemState = "off";
    } else {
      this.systemState = "on";
      this.systemService.systemState = "on";
    }
  }

  @action
  private setDoorOpen(open: boolean) {
    this.doorOpen = open;
  }

  @action
  private setEnergyOn(energyOn: boolean) {
    this.energyOn = energyOn;
  }
}

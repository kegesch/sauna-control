export default class SaunaMode {
  public name: string;
  public minTemperature: number;
  public maxTemperature: number;
  public defaultTemperature: number;
  public minHumidity: number;
  public maxHumidity: number;
  public defaultHumidity: number;
  public iconImage: string;

  public constructor(name: string, minTemp: number, maxTemp: number, defaultTemp: number, minHumid: number, maxHumid: number, defaultHumid: number, iconImage: string) {
    this.name = name;
    this.minTemperature = minTemp;
    this.maxTemperature = maxTemp;
    this.defaultTemperature = defaultTemp;
    this.minHumidity = minHumid;
    this.maxHumidity = maxHumid;
    this.defaultHumidity = defaultHumid;
    this.iconImage = iconImage;
  }
}

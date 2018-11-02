import {observable} from "mobx";
import {IWeatherService} from "../../Services/Interfaces/IWeatherService";
import OpenWeatherService from "../../Services/OpenWeatherService";

export default class WeatherStore {

    @observable public currentTemp: number = 0;

    private weatherService: IWeatherService = new OpenWeatherService();

    private fetchTimeout: number = 1000 * 10 * 60; // 10min

    constructor() {

        this.weatherService.getCurrentTemp((temp) => this.currentTemp =  Math.round(temp));

        setInterval(() => {
            this.weatherService.getCurrentTemp((temp) => this.currentTemp =  Math.round(temp));
        }, this.fetchTimeout);
    }

}

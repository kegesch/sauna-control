import {IWeatherService} from "./Interfaces/IWeatherService";

export default class OpenWeatherService implements IWeatherService {

    private logger = console;

    private API_KEY: string = "83b68a1d5e3d994cc3666f307730fb26";
    private URL: string = "https://api.openweathermap.org/data/2.5/";
    private CURRENT_WEAHTER_PATH: string = "weather/";
    private CITY_ID: string = "2924803";
    private UNITS: string = "metric";

    public getCurrentTemp(callback): void {
        const url = this.buildRequestUrl();
        fetch(url).then((response) => {
            return response.json();
        }).then((json) => {
            const temp = json.main.temp;
            callback(temp);
        }).catch((err) => {
            this.logger.error("Could not fetch from OpenWeatherService. " + err);
        });
    }

    private buildRequestUrl(): string {
        return this.URL + this.CURRENT_WEAHTER_PATH + "?"
            + "id=" + this.CITY_ID + "&"
            + "units=" + this.UNITS + "&"
            + "APPID=" + this.API_KEY;
    }

}

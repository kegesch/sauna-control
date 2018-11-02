export interface IWeatherService {
    getCurrentTemp(fn: (temp: number) => void): void;
}

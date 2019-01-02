export default interface ILightsService {
    setColor(red: number, green: number, blue: number): void;
    off(): void;
    autoOn(): void;
    autoOff(): void;
    blinkTimer(red: number, green: number, blue: number, times: number, duration: number): void;
    setBrightness(brightness: number): void;
}

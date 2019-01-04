export default interface ILightsService {
    setColor(red: number, green: number, blue: number): void;
    off(): void;
    on(): void;
    autoOn(): void;
    autoOff(): void;
    blinkTimer(color: [number, number, number], times: number, duration: number): void;
    setBrightness(brightness: number): void;
}

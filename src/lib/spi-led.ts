import * as SPI from "pi-spi";

export default class SPILed {

  private readonly spiBus: number = 0;
  private readonly spiPort: number = 0;
  private readonly ledAmount: number = 0;

  private spiDevice: SPI.SPI;

  public constructor(bus: number, port: number, ledAmount: number) {
    this.spiBus = bus;
    this.spiPort = port;
    this.ledAmount = ledAmount;
    this.spiDevice = SPI.initialize(`/dev/spidev${bus}.${port}`);
    this.spiDevice.dataMode(SPI.mode.CPHA);
    this.spiDevice.clockSpeed(1000000);
  }

  public async fill(r: number, g: number, b: number): Promise<void> {
    const buffer = Buffer.alloc(this.ledAmount*3);
    for (let i = 0; i < this.ledAmount * 3; i+=3) {
        buffer[i] = r;
        buffer[i+1] = b;
        buffer[i+2] = g;
    }

    console.log("LED fill " + r + " " + g + " " +b);
	
    this.spiDevice.write(buffer, () => {
    	return Promise.resolve();
    });
  }
}

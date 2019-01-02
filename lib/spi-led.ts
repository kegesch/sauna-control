import * as SPI from "pi-spi";

export default class SPILed {

  private spiBus = 0;
  private spiPort = 0;
  private ledAmount = 0;

  private spiDevice: SPI.SPI;

  public SPILed(bus: number, port: number, ledAmount: number) {
    this.spiBus = bus;
    this.spiPort = port;
    this.ledAmount = ledAmount;
    this.spiDevice = SPI.initialize(`/dev/spidev${bus}.${port}`)
  }

  public async fill(r: number, g: number, b: number): Promise<void> {
    const buffer = Buffer.alloc(this.ledAmount*3);
    for (let i = 0; i < this.ledAmount * 3; i+=3) {
        buffer[i] = r;
        buffer[i+1] = b;
        buffer[i+2] = g;
    }
    this.spiDevice.transfer(buffer, () => {
      return Promise.resolve();
    });
  }
}

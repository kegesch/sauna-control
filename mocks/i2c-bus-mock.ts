export default class I2cBusMock {
    public static openSync(): Bus {
        return new Bus();
    }
}

class Bus {
    public sendByteSync(address: number, byte: number) {
        return;
    }

    public receiveByteSync(adress: number) {
        return 0x1;
    }

    public closeSync() {
        return;
    }
}
